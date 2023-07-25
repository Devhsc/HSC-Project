# take a list of words from a question, and removing everything besides words from the dictionary
# also remove any words that are in the stop words list
# then save the words to a file and match them to the quesiton number and category of question
import english_words
import gensim

def parse_question_text(words, question_num, folder_name, filename):
    # we might want things like times, dates, etc, so come back and maybe fix this later
    words = gensim.parsing.preprocessing.remove_stopwords(" ".join([word.lower() for word in words if word.lower() in dictionary])).split(" ")

    # make a file storing the text for the quesiton
    with open(f'{folder_name}/{filename}_q_keywords.txt', 'a') as f:
        f.write(f'{question_num} {" ".join(words)}\n')

dictionary = english_words.get_english_words_set(['web2'], lower=True)

parse_question_text(['', '', '', '', '14', 'Consider', 'the', 'diagram', 'below.', '', '', '', ' ', '', '', '', 'What', 'is', 'the', 'true', 'bearing', 'of', 'A', 'from', 'B?', '', '', '', 'A.', '025°', '', 'B.', '065°', '', 'Cc.', '115°', '', 'D.', '=', '295°', '', '', '', '15', 'A', 'total', 'of', '11', '400', 'people', 'entered', 'a', 'running', 'race.', 'The', 'ratio', 'of', 'professional', 'runners', 'to', '', 'amateurs', 'was', '3:16.', 'All', 'the', 'professional', 'runners', 'completed', 'the', 'race', 'while', '600', 'of', 'the', '', 'amateurs', 'did', 'not', 'complete', 'the', 'race.', '', '', '', 'For', 'those', 'who', 'completed', 'the', 'race,', 'what', 'is', 'the', 'ratio,', 'in', 'simplest', 'form,', 
'of', 'professional', '', 'runners', 'to', 'amateurs?', '', '', '', 'A.', '1:2', '', 'B.', '1:5', '', 'Cc.', '1:8', '', 'D.', '1:19'], 2, "test_folder", "test_file")
