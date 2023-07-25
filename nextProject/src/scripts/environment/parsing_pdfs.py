# import modules
import pdf2image
import pytesseract
import os
import sys
import gensim
import shutil
import pdfplumber
import num2words
import spacy
import fitz

nlp = spacy.load('en_core_web_sm')

categories = [

    'data analysis',
        'classifying and representing data (grouped and ungrouped)',
        'exploring and describing data arising from a single continuous variable',
    'relative frequency and probability',
    'bivariate data analysis',
    'the normal distribution',

    'formulae and equations',
    'linear relationships',
    'types of relationships',
        'simultaneous linear equations',
        'non-linear relationships',

    'network concepts',
        'networks',
        'shortest paths',
    'critical path analysis',

    'applications of measurement',
        'practicalities of measurement',
        'permimeter, area and volume',
        'units of energy and mass',
    'working with time',
    'non-right-angled trigonometry',
    'rates and ratios',

    'money matters',
        'earning and managing money',
        'budgeting and household expenses',
    'investments and loans',
        'investments',
        'depreciation and loans'
    'annuities'

]

def parse_pdf(pdfname, first_sr_question_num, last_page_num):
    # store pdf with convert_from_path function
    images = pdf2image.convert_from_path(pdfname, grayscale=True)
    all_page_imgs = []
    for img in images:
        # perform OCR and get the data
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)

        # add to list
        all_page_imgs.append(data)

    # setting up boundaries for cropping question images for all pages
    right = images[0].size[0]
    left = 0

    # setting default variables
    question_num = 1
    count = 0

    question_types = {}
    # getting all question types
    if os.path.isfile(f'question_types/{pdfname[:-4]}.txt'):
        with open(f'question_types/{pdfname[:-4]}.txt', 'r') as f:
            for line in f:
                parts = line.split()
                question_types[parts[0]] = parts[1]

    # making a folder to store the images in 
    folder_name = pdfname[:-4]
    if os.path.isdir(folder_name):
        shutil.rmtree(folder_name)
    os.mkdir(folder_name)

    # list that contains all the data of the pages that the current question exists on
    # each index will be a tuple in the form (page_data, (top, bottom))
    # where the top and bottom indicates the pixel values of the top and bottom of the question
    questions_page_data = []
    

    # multiple choice section



    # long response section
    question_num = first_sr_question_num - 1

    # parsing through all the images and cropping out each question, and parsing text etc
    for page_data in all_page_imgs[:last_page_num+2]:
        words = page_data['text']

        # setting boundaries for cropping questions in this page
        top = 0
        bottom = 0

        # see if question has continued from previous page, if not, increase question_num
        i, question_num, question_page = get_next_question_identifier(words, question_num, 0)

        # question has continued from previous page
        if question_page == "B":
            top = max(page_data['top'][i] - 10, 0)

        # a new question has been reached, parse the previous one
        elif question_page == "A":
            if question_num != first_sr_question_num:
                parse_question_text(questions_page_data, question_num - 1, folder_name, pdfname, question_types)
            top = max(page_data['top'][i] - 10, 0)
            questions_words = []
            questions_page_data = []
        
        # there are no questions on this page
        else:
            count += 1
            continue
        
        # loop through the rest of the questions on this page
        while i < len(words):
            # getting j value of the next question identifier
            j, question_num, question_page = get_next_question_identifier(words, question_num, i)

            # there are no more questions on this page
            if question_page is None:
                question_page = "A"
                questions_words += page_data['text'][i:]
                bottom = images[0].size[1]
                questions_page_data.append((page_data, (top, bottom)))
                break
            # we have reached a new question, so we need to crop and parse the previous question
            elif question_page == "A":
                bottom = page_data['top'][j] - 10
                new_crop = images[count].crop((left, top, right, bottom))
                save_image(new_crop, folder_name, pdfname, question_num - 1)
                questions_words += page_data['text'][i:j-1]
                questions_page_data.append((page_data, (top, bottom)))
                parse_question_text(questions_page_data, question_num - 1, folder_name, pdfname, question_types)
                top = bottom
                j += 1
            i = j

        # get the image of the last question on this page
        if question_num != first_sr_question_num - 1:
            new_crop = images[count].crop((left, top, right, bottom))
            save_image(new_crop, folder_name, pdfname, question_num)
        count += 1
    
    # parse text for final question
    parse_question_text(questions_page_data, question_num, folder_name, pdfname, question_types)

def save_image(img, folder_name, pdfname, question_num):
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    letter_idx = 0
    while os.path.exists(f'{folder_name}/{pdfname}_q{question_num}{letters[letter_idx]}.jpg'):
        letter_idx += 1
    img.save(f'{folder_name}/{pdfname}_q{question_num}{letters[letter_idx]}.jpg', 'JPEG')

def get_next_question_identifier(words, question_num, i):
    """
    following options, add more later as we find examples:
        question 16
        question sixteen
        q 16
        q sixteen

        q16
        sixteen
    """
    while i < len(words):
        # two word question identifier
        if words[i].lower() == 'q' or words[i].lower() == 'question':
            # check for the next word
            # question has continued from previous page
            if words[i+1].lower().startswith(str(question_num)) or \
            words[i+1].lower().startswith(num2words.num2words(question_num)):
                return i+2, question_num, "B"
            # question starts on this page, hence previous question ended on last page
            elif words[i+1].lower().startswith(str(question_num + 1)) or \
            words[i+1].lower().startswith(num2words.num2words(question_num + 1)):
                return i+2, question_num + 1, "A"    
        # one word question identifier
        else:
            # question has continued from previous page
            if words[i].lower().startswith(f'q{question_num}') or \
            words[i].lower().startswith(num2words.num2words(question_num)):
                return i+1, question_num, "B"
            # question starts on this page, hence previous question ended on last page
            elif words[i].lower().startswith(f'q{question_num + 1}') or \
            words[i].lower().startswith(num2words.num2words(question_num + 1)):
                return i+1, question_num + 1, "A"
        i += 1
    # no more questions on this page
    return i, question_num, None


def parse_old_pdf(pdfname, first_sr_question_num, last_page_num):
    pass

def get_section_identifiers(letter):
    return [
        f'{letter})', 
        f'{letter}.', 
        f'({letter})',
        f'{letter}:'
    ]

"""
ANOTHER OPTION FOR THIS FUNCTION
words will be parsed in with the page data, so we will have access to the pixel values of each word
we will use the pixel values of each word to figue out what section it belongs to
"""
def split_into_sections(questions_page_data, question_num):

    # first we will parse through and get the letter sections
    # letters that will be used to split the questions into sections
    letters = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    letter_idx = 0
    letter_section_identifiers = get_section_identifiers(letters[letter_idx+1])
    letters_pixel = []

    pixel_page_value = 10000

    while True:
        # relate the letter sections to their pixel values on the page
        letter_idx_pixel = []

        # parse through all pages the question is on
        for i, page_data_tuple in enumerate(questions_page_data):
            # get info from page data tuple
            words, pixels = page_data_tuple[0]['text'], page_data_tuple[0]['top']
            top, bottom = page_data_tuple[1]

            # traverse through all words on the page looking for the letter section identifier
            j = 0
            while j < len(words):
                # we have found a new letter section
                if words[j] in letter_section_identifiers and pixels[j] >= top and pixels[j] <= bottom:    
                    # add info to list
                    letter_idx_pixel.append(pixels[j] + i * pixel_page_value)
                j += 1

        # if no next section was found in all the pages, we have found all the sections
        if len(letter_idx_pixel) == 0:
            break

        # only keep the letter section identifier with the lowest pixel value
        lowest_idx = 0
        lowest_pixel_value = letter_idx_pixel[0]
        for j in range(1, len(letter_idx_pixel)):
            if letter_idx_pixel[j] < lowest_pixel_value:
                lowest_idx = j
                lowest_pixel_value = letter_idx_pixel[j]
        letters_pixel.append(letter_idx_pixel[lowest_idx])

        # update variables for next section
        letter_idx += 1
        letter_section_identifiers = get_section_identifiers(letters[letter_idx+1])
    
    # ensure the letters are in order, if not, something has gone wrong, raise an error
    for i in range(len(letters_pixel) - 1):
        if letters_pixel[i] > letters_pixel[i+1]:
            raise Exception(f"ERROR: Letter sections for question {question_num} are not in order")
        
    # i sections that are associated with each letter section
    letter_i_sections = [[] for _ in range(len(letters_pixel))]

    # for all letter sections, find if they have any i sections in them
    # i's that will be used to split the letter sections into further sections
    i_levels = ["", "i", "ii", "iii", "iv", "v"]
    i_idx = 0
    i_section_identifiers = get_section_identifiers(i_levels[i_idx+1])
    while True:

        # relate the i sections to their pixel values on the page
        i_idx_pixel = []

        for i, page_data_tuple in enumerate(questions_page_data):
            # get info from page data tuple
            words, pixels = page_data_tuple[0]['text'], page_data_tuple[0]['top']
            top, bottom = page_data_tuple[1]

            # traverse through all words on the page looking for the i section identifier
            j = 0
            while j < len(words):
                # we have found a new i section within the bounds of the question
                if words[j] in i_section_identifiers and pixels[j] >= top and pixels[j] <= bottom:                                        
                    # add info to list
                    i_idx_pixel.append(pixels[j] + i * pixel_page_value)
                j += 1

        # if no sections were found, we have found all the sections
        if len(i_idx_pixel) == 0:
            break
        
        # save all the i's that were found into their correct category
        for i in range(len(i_idx_pixel)):
            for j in range(len(letters_pixel)):
                if i_idx_pixel[i] > letters_pixel[j]:
                    # if the i section does not have the previous i section already, then this is false somehow
                    if len(letter_i_sections[j]) != i_idx:
                        break
                    letter_i_sections[j].append(i_idx_pixel[i])
                    break

        # update variables for next section
        i_idx += 1
        i_section_identifiers = get_section_identifiers(i_levels[i_idx+1])
        
    # make a list of all sections present with their boundary pixel values
    sections_pixels = []

    top = questions_page_data[0][1][0]
    bottom = questions_page_data[-1][1][1] + ((len(questions_page_data) - 1) * pixel_page_value)
    
    if len(letters_pixel) == 0:
        sections_pixels.append((f'{question_num}', [top, bottom]))
    else:
        sections_pixels.append((f'{question_num}', [top, letters_pixel[0] - 10]))
        i = 1
        while i < len(letters_pixel):
            j = 0
            while j < len(letter_i_sections[i-1]):
                sections_pixels.append((f'{question_num}{letters[i]}{i_levels[j]}', [sections_pixels[-1][1][1], letter_i_sections[i-1][j] - 10]))
                j += 1
            sections_pixels.append((f'{question_num}{letters[i]}{i_levels[j]}', [sections_pixels[-1][1][1], letters_pixel[i] - 10]))
            i += 1
        sections_pixels.append((f'{question_num}{letters[i]}', [sections_pixels[-1][1][1], bottom]))

    # use the pixel ranges to get the words in each section
    sections = []

    for i in range(len(sections_pixels)):
        # all the words in this section
        words = []
        start_page_idx = sections_pixels[i][1][0] // pixel_page_value
        end_page_idx = sections_pixels[i][1][1] // pixel_page_value

        for j in range(start_page_idx, end_page_idx + 1):
            page_data, (top, bottom) = questions_page_data[j]
            for k in range(len(page_data['text'])):
                if page_data['top'][k] + j * pixel_page_value >= sections_pixels[i][1][0] and \
                page_data['top'][k] + j * pixel_page_value <= sections_pixels[i][1][1]:
                    words.append(page_data['text'][k])
        sections.append((sections_pixels[i][0], words))

    return sections

def is_a_ratio(word):
    parts = word.split(':')
    if len(parts) == 2:
        try:
            int(parts[0])
            int(parts[1])
            return True
        except:
            return False
    return False

def is_a_rate(word):
    if len(word) < 3:
        return False
    if word[0] == '$':
        word = word[1:]
    parts = word.split('/')
    if len(parts) == 2:
        try:
            int(parts[0])
            return True
        except:
            return False
    return False

def is_a_percentage(word):
    if len(word) < 2:
        return False
    if word[-1] == '%':
        try:
            int(word[:-1])
            return True
        except:
            return False
    return False

def parse_question_text(questions_page_data, question_num, folder_name, filename, question_types):
    # we might want things like times, dates, etc, so come back and maybe fix this later
    # things we want:
    # - $num/kwh - DONE
    # - $num/anyrate - DONE
    # - ratios (num:num) - DONE
    # - p.a. - DONE
    # - percentages 19% p.a.
    # NEED TO CHANGE WORDS TO PRESENT TENSE FROM FUTURE OR PAST, THIS IS IMPORTANT
    sections = split_into_sections(questions_page_data, question_num)
    for i in range(len(sections)):
        # getting the words from the section
        words = " ".join(sections[i][1])

        # removing punctuation and numbers
        new_words_string = ''
        for j in range(len(words)):
            if not (words[j] == '-' or words[j] == '.' or words[j] == '?' or \
            words[j] == ',' or words[j] == ')' or words[j] == '(' or words[j] == "'") or \
            words[j] ==  '_':
                new_words_string += words[j]
        
        words = [word.lower() for word in new_words_string.split() if len(word) < 20]
        
        # removing stopwords and changing words to their lemma form
        words = gensim.parsing.preprocessing.remove_stopwords(" ".join(words))

        # making all words their lemma form / present tense form
        doc = nlp(words)
        words = [token.lemma_ for token in doc]

        # removing words that are not alpha, a rate, ratio, or a percentage
        words = set([word for word in words if word.isalpha() or is_a_rate(word) or is_a_ratio(word) or is_a_percentage(word)])

        # make a file storing the text for the quesiton
        with open(f'{folder_name}/{filename}_q_keywords.txt', 'a') as f:
            f.write(f'{sections[i][0]} {question_types.get(sections[i][0], "NULL")} {",".join(words)}\n')

def get_pdf_info():
    old_format = None
    while old_format is None:
        old_format = input("Is the pdf in the old format? (y/n) ") # might need .strip() here i forget
        if old_format.lower() == 'y':
            old_format = True
        elif old_format.lower() == 'n':
            old_format = False
        else:
            print("Please enter either 'y' or 'n'")
            old_format = None
    
    first_sr_question_num = None
    while not first_sr_question_num:
        first_sr_question_num = input("What is the number of the first short response question? ")
        try:
            first_sr_question_num = int(first_sr_question_num)
        except:
            print("Please enter a valid number")
            first_sr_question_num = None
    
    last_page_num = None
    while not last_page_num:
        last_page_num = input("On what page is the last question? ")
        try:
            last_page_num = int(last_page_num)
        except:
            print("Please enter a valid number")
            last_page_num = None

    return old_format, first_sr_question_num, last_page_num

def main():
    # get arguments info
    pdfname = sys.argv[1]
    first_sr_question_num = int(sys.argv[2])
    last_page_num = int(sys.argv[3])

    # check file exists
    if not os.path.isfile(pdfname):
        print("File does not exist")
        return

    # parse the pdf
    parse_pdf(pdfname, first_sr_question_num, last_page_num)

    return

if __name__ == '__main__':
    main()
