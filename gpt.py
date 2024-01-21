from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key = os.environ.get("OPENAI_API_KEY"))
page_text = "I have updated to openai v0.27.0, as well as tried using new API keys just incase that was causing the issue. Ive double checked that I actually have updated to the new version of openai 0.27.0 by running “pip list”. "

response = client.chat.completions.create(model="gpt-3.5-turbo",
messages=[
    {"role": "system", "content": "Tl;dr"},
    {"role": "user", "content": f"Summarize this: {page_text}"},
])
page_summary = response.choices[0].message.content


print(page_summary)