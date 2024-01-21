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
