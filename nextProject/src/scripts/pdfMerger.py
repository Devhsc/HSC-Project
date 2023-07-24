#!/usr/bin/python

import os
import sys
from pdfrw import PdfWriter, PdfReader

def merge_pdfs(input_directory, output_dir):
    writer = PdfWriter()

    # Iterate over the files in the directory
    for root, dirs, files in os.walk(input_directory):
        for filename in files:
            if filename.endswith('.pdf'):
                file_path = os.path.join(root, filename)
                writer.addpages(PdfReader(file_path).pages)

    # Write the merged PDF to the output file
    output_file = input_directory.split("/")[-1] + ".pdf"
    if output_dir[-1] != "/":
        output_dir += "/"
    output_dir = output_dir + output_file
    writer.write(output_dir)
    print("PDF files successfully merged!")

if __name__ == "__main__":

    if len(sys.argv) != 3:
        print("Usage: python pdfProcessor.py [INPUT_DIR] [OUTPUT_DIR]")
        sys.exit(1)
    input_directory = sys.argv[1]
    output_dir = sys.argv[2]

    merge_pdfs(input_directory, output_dir)

