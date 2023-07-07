# !/usr/bin/python
# Remove the first two pages (cover sheet) from the PDF

from pdfrw import PdfReader, PdfWriter
import sys


def pdf_mod(input_file, output_dir):
    # Define the reader and writer objects
    reader_input = PdfReader(input_file)
    writer_output = PdfWriter()

    # Go through the pages one after the next
    for current_page in range(len(reader_input.pages)):
        #if current_page > 0:
            reader_input.pages[current_page].Rotate = 90
            writer_output.addpage(reader_input.pages[current_page])
            #print("adding page %i" % (current_page + 1))

    # Write the modified content to disk
    name = input_file.split("/")[-1]
    new_file = output_dir
    if new_file[-1] != "/":
        new_file += "/"
    new_file += name

    writer_output.write(new_file)
    print("Done!")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdfProcessor.py [PDF_FILE] [OUTPUT_DIR]")
        sys.exit(1)

    pdf_file = sys.argv[1]
    output_dir = sys.argv[2]

    pdf_mod(pdf_file, output_dir)
