import parsing_pdfs
import os
import fitz
import sys
# 595 x 842

def split_topic_name(raw):
    word_list = raw.split('-')
    revised = word_list[0]
    word_index = 1
    while word_index < len(word_list):
        revised += ' ' + word_list[word_index]
        word_index += 1
    return revised

def split_q_name(raw):
    raw2 = raw.split(".pdf")
    paper = raw2[0]
    question = raw2[1].split(".jpg")[0].split("_")[1]
    if question[-1] == "A":
        question = question[:-1]
    elif question[-1] == "B":
        question = question[:-1] + " (continued)"
    else:
        pass
    return paper + " " + question

os.chdir('src/scripts/environment')
os.system('pwd')

papers_used = []


i = 1
print(sys.argv)
while i < len(sys.argv) - 1:
    file = sys.argv[i]
    papers_used.append(file)
    print(f"Parsing file {file}")
    first_sr_question_num = sys.argv[i+1]
    last_sr_page_num = sys.argv[i+2]
    os.system(f"python3 parsing_pdfs.py {file} {first_sr_question_num} {last_sr_page_num}")
    foldername = file[:-4]
    keywords = f'{foldername}/{file}_q_keywords.txt'
    classify_sheet = 'ms_standard_2.csv'
    os.system(f"python3 classifier.py {keywords}")
    i += 3



# file_list = os.listdir('.')
# for file in file_list:
#     if file[-4:] == ".pdf":
#         papers_used.append(file[:-4])
#         print(f"For {file}:\n")
#         os.system(f"python3 parsing_pdfs.py {file}")
#         foldername = file[:-4]
#         keywords = foldername + '/' + file + "_q_keywords.txt"
#         os.system(f"python3 classifier.py {keywords}")

doc = fitz.open()
page_index = -1
dir_list = sorted(os.listdir('topic_sorted'))

page_index += 1
doc.new_page(page_index)

doc[page_index].insert_font(fontname='roboto', fontfile='./Roboto_Mono/static/RobotoMono-Bold.ttf')
doc[page_index].insert_font(fontname='robotoi', fontfile='./Roboto_Mono/static/RobotoMono-LightItalic.ttf')

doc[page_index].insert_image(filename='logo.png', rect=fitz.Rect(30,50,565,150))
doc[page_index].insert_textbox(fitz.Rect(1,150,595,200), "Past Paper Topic Sort", fontsize = 35,fontname = 'roboto', align = 1)  
doc[page_index].insert_textbox(fitz.Rect(1,200,595,250), "Mathematics Standard 2", fontsize = 25,fontname = 'robotoi', align = 1)  

height = 300
doc[page_index].insert_textbox(fitz.Rect(30,height,296,height+20), "Topics Selected:", fontsize = 15,fontname = 'roboto', align = 0)  
height = height + 30



for name in os.listdir('topic_sorted'):
    if name[0] == '.':
        continue
    doc[page_index].insert_textbox(fitz.Rect(30,height,296,height+20), f"- {name}", fontsize = 10,fontname = 'robotoi', align = 0)  
    height = height + 20

height = 300
doc[page_index].insert_textbox(fitz.Rect(296,height,565,height+20), "Papers Used:", fontsize = 15,fontname = 'roboto', align = 0)  
height = height + 30

for name in papers_used:
    
    doc[page_index].insert_textbox(fitz.Rect(296,height,565,height+20), f"- {name}", fontsize = 10,fontname = 'robotoi', align = 0)  
    height = height + 20


# doc[page_index].insert_image(filename='opacity_logo.png', rotate=90, rect=fitz.Rect(0,0,595,842))


doc[page_index].draw_rect(fitz.Rect(8, 8, 587, 834),width=4,color=(179/256, 4/256, 4/256))

for dir in os.listdir('topic_sorted'):
    if dir[0] == '.':
        continue

    fancy_topic = split_topic_name(dir)

    page_index += 1
    doc.new_page(page_index)

    
    
    doc[page_index].draw_rect(fitz.Rect(8, 8, 587, 834),width=4,color=(36/256, 36/256, 36/256))

    doc[page_index].insert_font(fontname='roboto', fontfile='./Roboto_Mono/static/RobotoMono-Bold.ttf')
    doc[page_index].insert_textbox(fitz.Rect(1,380,595,842), fancy_topic, fontsize = 30,fontname = 'roboto', align = 1)  
    
    
    
    question_list = sorted(os.listdir(f"topic_sorted/{dir}"))
    for question in question_list:
        fancy_question = split_q_name(question)

        page_index += 1
        doc.new_page(page_index)
        doc[page_index].insert_font(fontname='roboto', fontfile='./Roboto_Mono/static/RobotoMono-Bold.ttf')
        doc[page_index].insert_font(fontname='robotoi', fontfile='./Roboto_Mono/static/RobotoMono-LightItalic.ttf')
        doc[page_index].insert_textbox(fitz.Rect(30,40,565,60), fancy_question, fontsize = 15,fontname = 'roboto', align = 0)  
        doc[page_index].insert_image(filename = f"topic_sorted/{dir}/{question}", rect = fitz.Rect(30, 70, 565, 791))
        # rect1 = doc[page_index].new_shape()
        doc[page_index].draw_rect(fitz.Rect(30, 70, 565, 791),width=4,color=(142/256, 4/256, 201/256))
        # rect1.finish(fill=(142/256, 4/256, 201/256),)
        doc[page_index].insert_textbox(fitz.Rect(30,801,565,842), fancy_topic, fontsize = 15,fontname = 'robotoi', align = 0)  

        # doc[page_index].insert_image(filename='opacity_logo.png', rotate=90, rect=fitz.Rect(0,0,595,842))

doc.save(f'/Users/bryden/Coding/Projects/HSC-Project/nextProject/public/{sys.argv[-1]}.pdf')
doc.save(f'/Users/bryden/Coding/Projects/HSC-Project/nextProject/public/{sys.argv[-1]}.pdf')
