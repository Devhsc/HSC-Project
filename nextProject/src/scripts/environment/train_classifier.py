import sys
import pandas as pd
import os

def add_topics_check(type, sheet):
    if type not in sheet.columns:
        return type
    else:
        return False

def main():
    files = os.listdir(sys.argv[1])
    for file in files:
        question_keywords_list_file = open(f"{sys.argv[1]}/{file}", 'r')
        question_keywords_list = question_keywords_list_file.readlines()
        # removing multiple choice questions
        



        subject_topics_matrix = pd.read_csv(sys.argv[2])
        for question in question_keywords_list:
            try:
                number, topic, keywords = question.split()
            except ValueError:
                continue

            column_to_add = add_topics_check(topic, subject_topics_matrix)

            if column_to_add:
                print(column_to_add)
                subject_topics_matrix[column_to_add] = 0

            keyword_list = keywords.split(',')
            for keyword in keyword_list:
                if not subject_topics_matrix['word_list'].isin([keyword]).any():

                    subject_topics_matrix = pd.concat([subject_topics_matrix, pd.DataFrame([{'word_list':keyword}])])
                    
                    row_num = subject_topics_matrix.loc[subject_topics_matrix['word_list'] == keyword].index
                    print(row_num)
                    col_num = subject_topics_matrix.columns.get_loc(topic)

        subject_topics_matrix = subject_topics_matrix.fillna(0)
        subject_topics_matrix.reset_index(drop=True, inplace=True)
        print(subject_topics_matrix)


        print("Now finding quantities of each")
        for question in question_keywords_list:
            try:
                
                number, topic, keywords = question.split()
            except ValueError:
                continue

            keyword_list = keywords.split(',')
            for keyword in keyword_list:                
                row_num = subject_topics_matrix.loc[subject_topics_matrix['word_list'] == keyword].index[0]
                print(f'ROW:{row_num}')
                col_num = subject_topics_matrix.columns.get_loc(topic)
                print(f"CONTENT:{subject_topics_matrix.iat[row_num, col_num]}")
                # sys.exit()
                try:
                    subject_topics_matrix.iat[row_num, col_num] = subject_topics_matrix.iat[row_num, col_num] + 1
                except TypeError:
                    print("typeerror")
                            
                    
                # else:
                #     row_num = int(subject_topics_matrix[subject_topics_matrix['word_list'] == keyword].index.values[0])
                #     print(subject_topics_matrix.at[0, 'word_list'])
                #     print("LL")
                #     print(row_num)
                #     print("LL")

                #     print("LL")
                #     print(subject_topics_matrix.at[row_num, topic])
                #     print("LL")
                #     # subject_topics_matrix.at[row_num, topic] = int(subject_topics_matrix.at[row_num, topic]) + 1
                #     # subject_topics_matrix.at[, topic]
                # # subject_topics_matrix[topic]





        print(subject_topics_matrix)
        subject_topics_matrix.to_csv(sys.argv[2], index=False)
        question_keywords_list_file.close()

        # qk_cursor = 0
        # while qt_cursor < len(question_types_list):
        #     question_types = question_types_list[qt_cursor].split()
        #     print(f"question_types: {question_types[0]}")

        #     question_keywords_data = ""
        #     if str(question_keywords_list[qk_cursor].split()[0]) != question_types[0]:
        #         # question_keywords_data += question_keywords_list[qk_cursor]
        #         qk_cursor += 1

        #     question_keywords_data = question_keywords_list[qk_cursor]
        #     qk_cursor += 1
            
        #     print(f"question_keywords: {question_keywords_data}")
            
        #     columns_to_add = add_topics_check(question_types[1:], subject_topics_matrix)
            
            
        #     if columns_to_add:
        #         for column_to_add in columns_to_add:
        #             print(column_to_add)
        #             subject_topics_matrix[column_to_add] = ''

        #     qt_cursor += 1
        

        
    
    


if __name__ == '__main__':
    main()