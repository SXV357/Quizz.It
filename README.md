# Quizz.It

Quizz.It is a full-stack educational productivity application designed to streamline access to college students' most common educational needs, such as getting access to efficient document summaries, finding questions to use to study for tests/quizzes, and if they have access to some sort of document and want to understand it in depth. It was submitted to Purdue's BoilerMake XI hackathon back in Jan 2024, and was shortlisted for several awards such as Klaviyo's, "We always put our customers first", "Best use of AI in education", and BoilerBookings', "Project that helps college students the most". The original application originally used a different tech stack, but since then has been significantly refactored to enhance user experience and also ensure resilience and security. The following are the key components of this application:
- Frontend: React, HTML/CSS/JavaScript, React router, Firebase, Material UI
- Backend: Python, Flask, Firebase Admin SDK, Gemini API, LangChain, OpenCV, NumPy, Pytesseract

## Setup and Installation

Before setting anything up in the client and server directories make sure to run the following commands to clone the repository and then navigate to the correct directory:
```
git clone https://github.com/YourUsername/Quizz.It.git
cd Quizz.It
```

Once you've cloned the repository, you also need to do the following things:
- Create a firebase project, enabling authentication, firestore, and cloud storage and do the following things:
    - Obtain the API key and related environment variables to be used on the client side which will be provided to you by default once the project has been created
    - In order to obtain the same to set up the Admin SDK, click the gear icon next to `Project Overview` and click the `Project Settings` button. Then navigate to the `Service accounts` tab where the default `Firebase Admin SDK` panel will be open. Here, select the `Python` option and click `Generate new private key`. This will download the required credentials into a JSON file on your local machine. Make sure to save this in a secure location as you will be using this later on.
    - Enable CORS for the firebase storage bucket. For this go to Google Cloud Platform and navigate to the firebase project you just created. Then click the terminal icon in the top right to activate the cloud shell. Once the shell has been setup, click the `Open editor` button. Once the editor loads, create a new file called `cors.json` and input the following information, making sure to save it:
    - ```
        [{
            "origin": ["*"],
            "method": ["*"],
            "maxAgeSeconds": 3600
        }]
        ```
    - Once you've created this configuration file, navigate back to the shell and execute the following command to enable CORS. In case you're wondering where to find the storage bucket URl, navigate to the storage tab in your firebase project and copy the link that starts with `gs://`:
    - ```
       gsutil cors set cors.json {your firebase storage bucket URL} 
      ```
    - You will also need to obtain a Gemini API key through Google's AI Studio

Now that all the background work is done, you need to set up a few things on both the client and server side to ensure smooth functioning.

### Client Setup
Navigate to the client directory by running `cd client`. Then create a `.env` file in the root directory and make sure it is structured exactly as follows with the information you obtained when you initially set up the firebase project:
```
REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
REACT_APP_APP_ID=
REACT_APP_MEASUREMENT_ID=
```
Once you have all this set up, execute `npm install` to install all the necessary dependencies and then run `npm start` to start the application.
### Server Setup
Navigate to the server directory by running `cd server`. Then, run the following commands to create a virtual environment, start it, and install the necessary dependencies:
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Once you have done so, create a `.env` file and structure it exactly as follows:
```
PROJECT_ID=
PRIVATE_KEY_ID=
PRIVATE_KEY=
CLIENT_EMAIL=
CLIENT_ID=
AUTH_URI=
TOKEN_URI=
AUTH_PROVIDER_X509_CERT_URL=
CLIENT_X509_CERT_URL=
STORAGE_BUCKET=
GOOGLE_API_KEY=
```
The first 9 pieces of information are the ones you will obtain through the JSON file downloaded to your local machine which has the required credentials to set up the Admin SDK. The `STORAGE_BUCKET` value is the exact same as as the `REACT_APP_STORAGE_BUCKET` value and the last one is for the API key you generated through Google's AI Studio for the Gemini API. Once you have all of this setup, simply execute `python3 server.py` to start the server. There may be a situation where you find that the server is taking too long to start. In that case, deactivate the virtual environment by running the `deactivate` command, then run the server once again.

## Contributing

Contributions to this project are welcome as there are a lot of things that can still be done to make the application more robust. Before you make any contributions, you must abide to the following guidelines:
- Make sure to fork the repository
- When submitting changes either for a new/existing feature, or for a bug, create a pull request and assign Shreyas Viswanathan as the primary reviewer; only approved changes will be merged into the application.