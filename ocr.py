from pdf2image import convert_from_path
import numpy as np
import cv2
import pytesseract
import matplotlib.pyplot as plt

# converts all pages of PDF to PIL images and converts those images to numpy array for processing
def convert_to_image(file_path):
    page_images = convert_from_path(file_path) # array of PIL image objects
    manipulated_images = [np.array(page) for page in page_images]
    return manipulated_images

def process_pdf_page(pages):
    text_contents = {}
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
        text_contents[f"Page {i + 1}"] = extracted_text
    return text_contents

def calculate_text_statistics():
    # number of words
    # average word length
    # number of characters
    # number of sentences
    # number of syllables
    # legibility index
    raise NotImplementedError

def generate_visualizations():
    # save the visualization and send the image to the frontend so it can be displayed accordingly
    raise NotImplementedError

if __name__ == "__main__":
    pdf_images = convert_to_image("Shreyas Viswanathan Resume.pdf")
    text_contents = process_pdf_page(pdf_images)
    print(list(filter(lambda x: x != "", text_contents["Page 1"].split("\n"))))
