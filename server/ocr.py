from pdf2image import convert_from_path
import numpy as np
import cv2
import pytesseract
import re
import pyphen
from math import *

# converts all pages of PDF to PIL images and converts those images to numpy array for processing
def convert_to_image(file_path):
    page_images = convert_from_path(file_path) # array of PIL image objects
    manipulated_images = [np.array(page) for page in page_images]
    return manipulated_images

def process_pdf_page(pages):
    text_contents = {}
    pattern = re.compile(r'^[!@#$%^&*(),.?":{}|<>]+$')
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
        text_contents[f"Page {i + 1}"] = list(map(lambda t: str(t).strip(), list(filter(lambda x: x != "" and len(x) > 1 and not bool(pattern.match(x)), extracted_text.split("\n"))))) # this is an array of all the text contents
    return text_contents

def calculate_text_statistics(text_contents):
    num_words, num_chars, num_sentences, num_syllables = 0, 0, 0, 0
    pages = text_contents.keys()
    dic = pyphen.Pyphen(lang='en_US')
    for page in pages:
        text = text_contents[page]
        for sentence in text:
            num_sentences += 1
            words = sentence.split(" ") # in one given sentence
            num_words += len(words)
            for i in range(len(words)):
                num_chars += len(words[i])
                num_syllables += len(dic.inserted(words[i]).split('-')) 
    averageSyllablesPerWord = num_syllables / num_words
    averageWordsPerSentence = num_words / num_sentences
    return {"Number of words": num_words, "Average word length": num_chars // num_words, "Number of characters": num_chars, "Number of sentences": num_sentences, "Number of syllables": num_syllables, "Legibility index": round(abs(((averageWordsPerSentence * 1.015) + (averageSyllablesPerWord * 84.6)) - 206.835))}    