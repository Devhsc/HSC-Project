import multer from 'multer';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

const upload = multer({ dest: 'uploads/' });

export default function handler(req, res) {

  if (req.method === 'POST') {
    try {
      upload.single('file')(req, res, (error) => {
        if (error) {
          res.status(400).json({ message: 'Error uploading file' });
        } else {
          const file = req.file;
          // Handle the uploaded file, perform validations, etc.
          res.status(200).json({ message: 'File uploaded successfully' });
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while uploading the file' });
    }
  } else {
    res.status(200).json({ name: 'lel kek' })
  }

}


export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }
  await readFile(req, true);
  res.json({ done: "ok" });
};

export default handler;