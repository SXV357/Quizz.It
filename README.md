# QuizzIt

## Inspiration

There are plenty of learning resources out there that students have access to, but each resource tends to only consist of kind of functionality, thereby limiting students' learning experience. From this standpoint, our group sought to build a platform that not only is a one-stop-shop for tools that students will find useful as they navigate either their high school or college career, but one that helps them better grasp concepts as well as save a lot of time.

## What it does

The tool allows a user to first upload a PDF of any kind, whether it is a research paper, a text book, a general book, or scanned notes. The user is then able to access three primary functionalities, one being a feature that allows a user to select which file they would like to obtain a concise summary on since multiple file uploads are permitted and along with a summary, statistics about the file are also displayed such as its legibility index. The other one is a feature where the user can select a file to get questions generated for and they can also at the same time choose what kinds of questions they would like generated whether it may be multiple choice, true or false, short answer or all three. The generated questions are then by default exported as a PDF for the user to access later on. There's also a mini chatbot feature where the user can ask questions about any of their uploaded files and get a response within a matter of seconds. This serves to get better clarification on concepts the user did not understand if at all they used the text summary feature.

## How we built it

We used the flask framework to construct the frontend with the server completely built using Python. The UI is written in pure HTML and CSS and javascript is used for purposes of processing user input, error handling and routing throughout the application. We also made use of OpenAI's API in order to enable the test question generation feature, and for the summary generation and chatbot feature, we fine-tuned open-source pre-trained models from the HuggingFace platform on custom data and integrated the functionality within the backend.

## Challenges we ran into

There are many challenges our team encountered during the course of this project. One of them was deciding what web development tech stack would be most appropriate to use since we had the option of doing vanilla web development, or going with a framework such as React, Flask, or even Django but we had to make sure that everyone's experience was well-suited for a specific suite. At the same time, we had many issues with respect to using OpenAI's API since we had to deal with logistical issues with respect to configuring the API keys. At the same time, learning how to fine-tune open-source models on custom data was also a challenge since it was the first time for  all of us who were doing this. There were also several issues with configuring endpoints and routing throughout the application, since it had been a while since any of use had used Flask.

## Accomplishments that we're proud of

We are proud of how we developed an intuitive interface with a decent suite of features that can help positively enhance a student's learning experience. The fact that we were able to integrate quite a diverse tech stack, as well as include a bonus feature at the end, which is the mini chat-bot with the ability to query for a specific file's data is something we are quite satisfied with. 

## What we learned

One of the biggest takeaways is the importance of persisting when debugging a problem. There were many issues our team ran into along the way which were quite tricky to debug, but continuing to work through them and utilize available resources as well as seek outside help when necessary helped us achieve our goals. At the same time, we also learned more about open-source pre-trained model integration and how flask works.

## What's next for Quizz.It
- Flash card feature where a card can be flipped to view its corresponding answer
- Matching feature where users can match terms to their definitions
- Timed quiz within the application that is scored
- Add user authentication and database integration to ensure data security
- In-browser annotation tool for all file uploads
