import multer from 'multer';
//import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

//const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req, saveLocally = false) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), '/src', 'uploads','unprocessed');
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + '_' + path.originalFilename;
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

const handler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + '/src', 'uploads', 'unprocessed'));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + '/src', 'uploads', 'unprocessed'));
  }
  await readFile(req, true);
  res.json({ done: 'ok' });
};



export default handler;
