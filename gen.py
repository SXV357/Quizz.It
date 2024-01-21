from openai import OpenAI
import os

client = OpenAI(api_key = os.environ.get("OPENAI_API_KEY"))

def generate_questions(input_text):
    # Example input text
    template = """ The sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma,
    with internal convective motion that generates a magnetic field via a dynamo process.
    The sun is by far the most important source of energy for life on Earth. """

    # Generate multiple-choice question
    mcq_input_prompt = f"Multiple-choice question for the following text: {input_text}"
    mcq_prompt = template + mcq_input_prompt

    mcq_completion = client.chat.completions.create(model="gpt-3.5-turbo",
messages=[
    {"role": "system", "content": "Tl;dr"},
    {"role": "user", "content": f"Generate a Multiple Choice Question: {page_text}"},
])
    mcq_message = mcq_completion.choices[0].text
    mcq_output_list = mcq_message.split("\n")
    mcq_index = mcq_output_list.index("Multiple Choice Question:")
    if mcq_index != -1:
            mcq_question = mcq_output_list[mcq_index + 1]


        # Generate short answer question
    saq_input_prompt = f"Short answer question for the following text: {input_text}"
    saq_prompt = template + saq_input_prompt

    saq_completion = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "Tl;dr"},
        {"role": "user", "content": f"Generate a Short Answer Question: {page_text}"},
    ])
    saq_message = saq_completion.choices[0].text
    saq_output_list = saq_message.split("\n")
    saq_index = saq_output_list.index("Short Answer Question:")

    if saq_index != -1:
        saq_question = saq_output_list[saq_index + 1]

        # Generate long answer question
        laq_input_prompt = f"Long answer question for the following text: {input_text}"
        laq_prompt = template + laq_input_prompt

        laq_completion = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "Tl;dr"},
        {"role": "user", "content": f"Generate a Short Answer Question: {page_text}"},
    ])

        laq_message = laq_completion.choices[0].text
        laq_output_list = laq_message.split("\n")
        laq_index = laq_output_list.index("Long Answer Question:")

        if laq_index != -1:
            laq_question = laq_output_list[laq_index + 1]
        return {
            "multiple_choice": mcq_question if mcq_index != -1 else "No multiple-choice question generated.",
            "short_answer": saq_question if saq_index != -1 else "No short answer question generated.",
            "long_answer": laq_question if laq_index != -1 else "No long answer question generated."
        }

# Example usage
input_text = "The Earth revolves around the sun."
generated_questions = generate_questions(input_text)
print("Generated Multiple Choice Question:", generated_questions["multiple_choice"])
print("Generated Short Answer Question:", generated_questions["short_answer"])
print("Generated Long Answer Question:", generated_questions["long_answer"])





# def generate_questions(input_text):
#     # Generate multiple choice question
#     mcq_question = f"Multiple-choice question for the following text\n{input_text}"
#     mcq_response = openai.Completion.create(
#         engine="gpt-3.5-turbo",
#         prompt=mcq_question,
#         max_tokens=100
#     )
#     mcq = mcq_response.choices[0].text.strip()

#     # Generate short answer question
#     saq_question = f"Short answer question for the following text\n{input_text}"
#     saq_response = openai.Completion.create(
#         engine="gpt-3.5-turbo",
#         prompt=saq_question,
#         max_tokens=100
#     )
#     saq = saq_response.choices[0].text.strip()

#     # Generate long answer question
#     laq_question = f"Long answer question for the following text\n{input_text}"
#     laq_response = openai.Completion.create(
#         engine="gpt-3.5-turbo",
#         prompt=laq_question,
#         max_tokens=100
#     )
#     laq = laq_response.choices[0].text.strip()

#     return {
#         "multiple_choice": mcq,
#         "short_answer": saq,
#         "long_answer": laq
#     }

# # Example input text
# input_text = """
# The sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma,
# with internal convective motion that generates a magnetic field via a dynamo process.
# The sun is by far the most important source of energy for life on Earth.
# """

# # Generate questions
# questions = generate_questions(input_text)

# # Print the generated questions
# print("Multiple Choice Question:", questions["multiple_choice"])
# print("\nShort Answer Question:", questions["short_answer"])
# print("\nLong Answer Question:", questions["long_answer"])
