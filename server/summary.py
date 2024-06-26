from datasets import load_dataset
from transformers import AutoTokenizer
from transformers import DataCollatorForSeq2Seq
from transformers import AutoModelForSeq2SeqLM, Seq2SeqTrainingArguments, Seq2SeqTrainer
from transformers import pipeline
import pandas as pd

#Start by loading in a bill training data which contains text and its summary:
bill = load_dataset("billsum", split="ca_test")

#Split the dataset into a 60 train and 40 test:
bill = bill.train_test_split(test_size=0.4)

#Load T5 tokenizer to process text and summary:
t5 = "t5-small"
tokenizer = AutoTokenizer.from_pretrained(t5)

check = "summarize: "

#The preprocessing function:
#Check the prefix the input with a 'summarize: '.
#Truncate sequences to be the maximum length. I decided that 2000 should be the max input with 500 as the max output

def preprocess(examples):
    inputs = [check + doc for doc in examples["text"]]
    model_inputs = tokenizer(inputs, max_length=2000, truncation=True)

    labels = tokenizer(text_target=examples["summary"], max_length=500, truncation=True)

    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

#To apply the preprocessing function over the entire dataset, use 🤗 Datasets map method.
tokenized_bill = bill.map(preprocess, batched=True)

#Now create a batch of examples using DataCollatorForSeq2Seq.
data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=t5)

# Note: Metrics is not used in the current model as we did not have enough time to fine tune the model

#Load T5 with AutoModelForSeq2SeqLM:
model = AutoModelForSeq2SeqLM.from_pretrained(t5)

#Method for summarizing:

def remove_duplicates(input_str):
    input = input_str.split(" ")
    used = set()
    result = []

    for word in input:
        if word not in used:
            used.add(word)
            result.append(word)

    return ' '.join(result)

def create_summary(text):
    #Test
    summarizer = pipeline("summarization", model="stevhliu/my_awesome_billsum_model")
    summarizer(text)

    #Tokenize the text:
    tokenizer = AutoTokenizer.from_pretrained("stevhliu/my_awesome_billsum_model")
    inputs = tokenizer(text, return_tensors="pt").input_ids

    #Use generate()
    model = AutoModelForSeq2SeqLM.from_pretrained("stevhliu/my_awesome_billsum_model")
    outputs = model.generate(inputs, max_new_tokens=100, do_sample=False)

    #Decode the generated token ids back into text:
    real_out = tokenizer.decode(outputs[0], skip_special_tokens=True)

    #Remove duplicate words
    real_out = remove_duplicates(real_out)
    
    return real_out
