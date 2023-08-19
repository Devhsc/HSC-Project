//import multer from 'multer';
//import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

//const upload = multer({ dest: 'uploads/' });
let userToken = 'testUserToken';

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req, uploadDir, saveLocally = false) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = uploadDir
    options.filename = (name, ext, path, form) => {
      
      //return Date.now().toString() + '_' + path.originalFilename; //moved to user side
      //return key;
      return path.originalFilename;
      
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      //console.log(fields.key)

      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

const test = async () => {
  console.log(userToken)

}


const handler = async (req, res) => {
  try {
    userToken = req.cookies['userToken'];
    if (!userToken){ //hassan replace this with a check against a database
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userTokenPath = path.join(process.cwd(), 'src', 'uploads', 'unprocessed', userToken);
    
    try {
      await fs.stat(userTokenPath); //check if the userTokenPath exists
    } catch {
      console.log('creating path')
      await fs.mkdir(userTokenPath);
    }

    //await fs.readdir(userTokenPath);
    await readFile(req, userTokenPath, true);
    res.json({ done: 'ok' });

  } catch (error) {
    console.error(error)
  }

  test()

};

export default handler;