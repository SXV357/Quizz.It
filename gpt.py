from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
# client = OpenAI(api_key = os.environ.get("OPENAI_API_KEY"))

# def generate_questions(extracted_text, question_types):
#     response = client.chat.completions.create(model="gpt-3.5-turbo",
#     messages=[
#         {"role": "system", "content": "Tl;dr"},
#         {"role": "user", "content": f"Given the following text, generate a set of 15-20 questions that cover a mix of question types. These questions should assess basic document comprehension or serve as practice for an exam. Consider including a variety of question types such as factual, inferential, and evaluative questions. Text: {extracted_text}. Question types to include: {question_types}"},
#     ])
#     questions = response.choices[0].message.content

#     return questions

# def answer_questions(text, query):
#     response = client.chat.completions.create(model="gpt-3.5-turbo",
#     messages=[
#         {"role": "system", "content": "Tl;dr"},
#         {"role": "user", "content": f"Given the following text snippet, provide detailed and contextually accurate responses to the questions that follow. If the information is not present in the provided text, please indicate so. Text: {text}. Question: {query}"},
#     ])

#     response = response.choices[0].message.content

#     return response