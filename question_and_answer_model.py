from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key = os.environ.get("OPENAI_API_KEY"))
page_text = "What is my favorite color?"

response = client.chat.completions.create(model="gpt-3.5-turbo",
messages=[
    {"role": "system", "content": "Tl;dr"},
    {"role": "user", "content": f"Answer this question: {page_text}"},
])
page_summary = response.choices[0].message.content


print(page_summary)