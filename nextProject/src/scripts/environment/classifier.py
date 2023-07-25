import sys
import pandas as pd
import os
import shutil
import pdf2image

# hardcode for now
classify_sheet = pd.read_csv("ms_standard_2.csv")
topics = classify_sheet.columns.to_list()
topics.remove('word_list')
topics.remove('??')
topics.remove('NULL')



def backup_check(keyword_list):
        topic_dictionary = {}
        for topic in topics:
            topic_dictionary[topic] = 0
        
        for keyword in keyword_list:
            try:
                row_num = classify_sheet.loc[classify_sheet['word_list'] == keyword].index[0]
                for topic in topics:
                    word_output = classify_sheet.iloc[[row_num]][topic].values[0]
                    topic_dictionary[topic] = topic_dictionary[topic] + word_output
            except IndexError:
                continue
            
        max_value = max(topic_dictionary, key=topic_dictionary.get)
        return max_value
        # print(number)
        # print(keyword_list)
        # print(max_value)
        # topics_file.write(f"{number} {max_value}")
        # if not os.path.isdir(f"topic_sorted/{max_value}"):
        #     os.makedirs(f"topic_sorted/{max_value}")
        
        
        # image_file_A = folder + '/' + folder +'.pdf_q' + str(number)[0:2] + 'A' +'.jpg'
        # image_file_B = folder + '/' + folder +'.pdf_q' + str(number)[0:2] + 'B' +'.jpg'
        
        # shutil.copy(image_file_A, f"topic_sorted/{max_value}")
        # try:
        #     shutil.copy(image_file_B, f"topic_sorted/{max_value}")
        # except:
        #     pass
        
        # sys.exit()

def main():
    

    # topics_file = open(f"{sys.argv[1]}_topics.txt", 'a')
    folder = sys.argv[1].split("/")[-2]

    # making folder which has all the questions sorted by topics
    if not os.path.isdir("topic_sorted"):
        os.makedirs("topic_sorted")
    
    # opening the file which has all the questions and keywords
    question_keywords_list_file = open(sys.argv[1], 'r')

    # reading the file which has all the questions and keywords
    question_keywords_list = question_keywords_list_file.readlines()

    # this has to be done by command line arg i believe
    question_num = 16

    # dictionary that relates the questions to the topics they are classified as
    q_topic_dict = {}

    # going through the keyword list and classifying each question
    for line in question_keywords_list:
        question, question_type, words = line.split(' ')
        words = words.split(',')
        if question == str(question_num + 1):
            question_num += 1
        
        # the normal distribution
        if 'zscore' in words or ('normal' in words and 'distribution' in words):
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['the-normal-distribution']
        
        # Q22 2022 HSC
        # linear relationships and types of relationships
        if 'proportional' in words:
            if 'directly' in words:
                q_topic_dict[question] = q_topic_dict.get(question, []) + ['linear-relationships']
            if 'inversely' in words:
                q_topic_dict[question] = q_topic_dict.get(question, []) + ['types-of-relationships']
        
        # network concepts and critical path analysis
        if 'network' in words:
            if 'shortest' in words or ('spanning' in words and 'tree' in words):
                q_topic_dict[question] = q_topic_dict.get(question, []) + ['network-concepts']
            if 'critical' in words or 'flow' in words or 'capacity' in words:
                q_topic_dict[question] = q_topic_dict.get(question, []) + ['critical-path-analysis']
        
        # Q32 2022 HSC
        # rates and ratios
        if 'kwh' in words or 'ratio' in words or 'bpm' in words:
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['rates-and-ratios']
        
        # working with time
        if 'utc' in words:
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['working-with-time']
        
        # annuities
        if 'annuity' in words:
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['annuities']
        
        # investments and loans
        elif 'pa' in words or ('per' in words and 'annum' in words) or 'compound' in words or \
        'interest' in words or 'decliningbalance' in words or 'depreciation' in words or \
        'annual' in words or 'straightline' in words or 'depreciate' in words or 'salvage' in words:
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['investments-and-loans']
        
        # money matters
        if 'commission' in words or 'tax' in words:
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['money-matters']

        # relative frequency and probability
        if 'probability' in words:
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['relative-frequency-and-probability']
        
        # Q23 2022 HSC
        # bivariate data and analysis
        if 'data' in words or 'table' in words or 'correlation' in words or 'regression' in words:
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['bivariate-data-and-analysis']
        
        # non-right-angled trigonometry
        if 'angle' in words or 'rightangle' in words or 'sine' in words or 'cosine' in words or \
        'bearing' in words:
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['non-right-angled-trigonometry']
        
        # applications of measurement
        if 'area' in words or 'volume' in words or 'surface' in words or 'perimeter' in words:
            q_topic_dict[question] = q_topic_dict.get(question, []) + ['applications-of-measurement']
        
        if not q_topic_dict.get(question, False):
            continue
            # q_topic_dict[question] = q_topic_dict.get(question, []) + [backup_check(words)]


        for q_topic in q_topic_dict[question]:
            if not os.path.isdir(f"topic_sorted/{q_topic}"):
                os.makedirs(f"topic_sorted/{q_topic}")
        
        
            image_file_A = folder + '/' + folder +'.pdf_q' + str(question)[0:2] + 'A' +'.jpg'
            image_file_B = folder + '/' + folder +'.pdf_q' + str(question)[0:2] + 'B' +'.jpg'
            
            shutil.copy(image_file_A, f"topic_sorted/{q_topic}")
            try:
                shutil.copy(image_file_B, f"topic_sorted/{q_topic}")
            except:
                pass
        
        # sys.exit()
        

    print(q_topic_dict)


    





if __name__ == '__main__':
    main()