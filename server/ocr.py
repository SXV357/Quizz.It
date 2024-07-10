from pdf2image import convert_from_path, convert_from_bytes
import numpy as np
import cv2
import pytesseract
import re
import pyphen
from math import *
from textblob import TextBlob
from typing import Dict

# converts all pages of PDF to PIL images and converts those images to numpy array for processing
def convert_to_image(file_bytes: bytes):
    # find a general package to handle this for all the supported document types
    page_images = convert_from_bytes(file_bytes) # array of PIL image objects
    manipulated_images = [np.array(page) for page in page_images]
    return manipulated_images

def process_pdf_page(pages) -> Dict[str, list[str]]:
    text_contents = {}
    pattern = re.compile(r'^[!@#$%^&*(),.?":{}|<>]+$|^\d+')
    for i in range(len(pages)):
        current_page = pages[i]
        # fix the alignment of the image in case it is not straight(TENTATIVE)
        grayscale = cv2.cvtColor(current_page, cv2.COLOR_BGR2GRAY)
        orientation = pytesseract.image_to_osd(grayscale) # string containing info about image orientation
        rotation_angle = int(orientation.split("\n")[1].split(":")[1])
        modified_img = grayscale.copy()
        match rotation_angle:
            case 0:
                pass
            case 180:
                modified_img = cv2.rotate(grayscale, cv2.ROTATE_180)
            case -90:
                modified_img = cv2.rotate(grayscale, cv2.ROTATE_90_CLOCKWISE)
            case 90:
                modified_img = cv2.rotat(grayscale, cv2.ROTATE_90_COUNTERCLOCKWISE)
        # apply gaussian blur and binarize it using otsu's thresholding
        blurred = cv2.GaussianBlur(modified_img, (3,3), 0)
        _, thresh_img = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        # run the page through pyseterract to extract the text contents
        extracted_text = pytesseract.image_to_string(thresh_img)
        lines = extracted_text.split("\n")
        for j in range(len(lines)):
            # filters out all words which purely have only spaces or whitespaces, and ones that solely consist of numbers or special characters
            lines[j] = " ".join(list(filter(lambda word: bool(word.strip()) and not bool(pattern.match(word)), lines[j].split(" "))))
        text_contents[f"Page {i + 1}"] = "\n".join(lines)
    
    # print(f"text contents: {text_contents}")

    return text_contents

def determine_reading_level(score: float) -> str:
    level = None
    match score:
        case _ if 0 <= score <= 29:
            level = "Very Confusing"
        case _ if 30 <= score <= 49:
            level = "Difficult"
        case _ if 50 <= score <= 59:
            level = "Fairly Difficult"
        case _ if 60 <= score <= 69:
            level = "Standard"
        case _ if 70 <= score <= 79:
            level = "Fairly Easy"
        case _ if 80 <= score <= 89:
            level = "Easy"
        case _ if 90 <= score <= 100:
            level = "Very Easy"
        case _:
            level = "The document has too little text to determine an appropriate readability score"
    
    return level

# edge cases:
    # 1. user uploads a valid but empty document - DONE
    # 2. user uploads a document without an extension - DONE

def calculate_text_statistics(text_contents: Dict[str, str]) -> Dict[str, float]:
    # text_contents is a dictionary that maps page numbers to the text contained in them
    num_words, num_chars, num_sentences, num_syllables = 0, 0, 0, 0
    pages = list(text_contents.keys())
    # print(f"keys: {pages}")
    dic = pyphen.Pyphen(lang='en_US') # eventually move towards accepting documents containing different languages
    for page in pages:
        curr = TextBlob(text_contents[page])
        words, sentences = curr.words, curr.sentences
        # print(f"Words: {words} Sentences: {sentences}")
        for word in words:
            num_chars += len(word) # number of characters in this page
            num_syllables += len(dic.inserted(word).split('-')) # number of syllables in this given word
        num_words += len(words) # number of words on the given page
        num_sentences += len(sentences) # number of sentences in this page

    averageSyllablesPerWord = (num_syllables / num_words)
    averageWordsPerSentence = (num_words / num_sentences)
    averageWordLength = (num_chars // num_words)
    flesch_score = round(206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord), 2)

    return {"Number of words": num_words, "Average word length": averageWordLength, "Number of characters": num_chars, "Number of sentences": num_sentences, "Number of syllables": num_syllables, "Legibility index": flesch_score, "Reading level": determine_reading_level(flesch_score)}        