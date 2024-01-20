from datasets import load_dataset
from transformers import AutoTokenizer
from transformers import DataCollatorForSeq2Seq
import evaluate
import numpy as np
import torch
from transformers import AutoModelForSeq2SeqLM, Seq2SeqTrainingArguments, Seq2SeqTrainer
from transformers import pipeline

#Start by loading the smaller California state bill subset of the BillSum dataset from the 🤗 Datasets library:
billsum = load_dataset("billsum", split="ca_test")

#Split the dataset into a train and test set with the train_test_split method:
billsum = billsum.train_test_split(test_size=0.2)

#The next step is to load a T5 tokenizer to process text and summary:
checkpoint = "t5-small"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)

prefix = "summarize: "

#The preprocessing function you want to create needs to:
#1)Prefix the input with a prompt so T5 knows this is a summarization task. Some models capable of multiple NLP tasks require prompting for specific tasks.
#2)Use the keyword text_target argument when tokenizing labels.
#3)Truncate sequences to be no longer than the maximum length set by the max_length parameter.

def preprocess_function(examples):
    inputs = [prefix + doc for doc in examples["text"]]
    model_inputs = tokenizer(inputs, max_length=1024, truncation=True)

    labels = tokenizer(text_target=examples["summary"], max_length=128, truncation=True)

    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

#To apply the preprocessing function over the entire dataset, use 🤗 Datasets map method.
#You can speed up the map function by setting batched=True to process multiple elements of the dataset at once:
tokenized_billsum = billsum.map(preprocess_function, batched=True)

#Now create a batch of examples using DataCollatorForSeq2Seq.
#It’s more efficient to dynamically pad the sentences to the longest length in a batch during collation, instead of padding the whole dataset to the maximum length.
data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=checkpoint)

#Then create a function that passes your predictions and labels to compute to calculate the ROUGE metric:
rouge = evaluate.load("rouge")

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    decoded_preds = tokenizer.batch_decode(predictions, skip_special_tokens=True)
    labels = np.where(labels != -100, labels, tokenizer.pad_token_id)
    decoded_labels = tokenizer.batch_decode(labels, skip_special_tokens=True)

    result = rouge.compute(predictions=decoded_preds, references=decoded_labels, use_stemmer=True)

    prediction_lens = [np.count_nonzero(pred != tokenizer.pad_token_id) for pred in predictions]
    result["gen_len"] = np.mean(prediction_lens)

    return {k: round(v, 4) for k, v in result.items()}

#Load T5 with AutoModelForSeq2SeqLM:
model = AutoModelForSeq2SeqLM.from_pretrained(checkpoint)

#Define your training hyperparameters in Seq2SeqTrainingArguments.
#The only required parameter is output_dir which specifies where to save your model.
#You’ll push this model to the Hub by setting push_to_hub=True (you need to be signed in to Hugging Face to upload your model).
#At the end of each epoch, the Trainer will evaluate the ROUGE metric and save the training checkpoint.

#Pass the training arguments to Seq2SeqTrainer along with the model, dataset, tokenizer, data collator, and compute_metrics function.

training_args = Seq2SeqTrainingArguments(
    output_dir="my_awesome_billsum_model",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    weight_decay=0.01,
    save_total_limit=3,
    num_train_epochs=4,
    predict_with_generate=True,
    fp16=True,
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_billsum["train"],
    eval_dataset=tokenized_billsum["test"],
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

#Call train() to finetune your model
trainer.train()

#For summarization you should prefix your input as shown below:
text = "summarize: The Inflation Reduction Act lowers prescription drug costs, health care costs, and energy costs. It's the most aggressive action on tackling the climate crisis in American history, which will lift up American workers and create good-paying, union jobs across the country. It'll lower the deficit and ask the ultra-wealthy and corporations to pay their fair share. And no one making under $400,000 per year will pay a penny more in taxes."

#-----------------------------------------------------------------------------------------------------
#The simplest way to try out your finetuned model for inference is to use it in a pipeline().
#Instantiate a pipeline for summarization with your model, and pass your text to it:
summarizer = pipeline("summarization", model="stevhliu/my_awesome_billsum_model")
summarizer(text)

#Tokenize the text and return the input_ids as PyTorch tensors:
tokenizer = AutoTokenizer.from_pretrained("stevhliu/my_awesome_billsum_model")
inputs = tokenizer(text, return_tensors="pt").input_ids

#Use the generate() method to create the summarization.
model = AutoModelForSeq2SeqLM.from_pretrained("stevhliu/my_awesome_billsum_model")
outputs = model.generate(inputs, max_new_tokens=100, do_sample=False)

#Decode the generated token ids back into text:
tokenizer.decode(outputs[0], skip_special_tokens=True)