//import multer from 'multer';
//import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

//const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

const clearDir = async (directory) => {
  const filesInDirectory = await fs.readdir(directory);
  if (filesInDirectory.length > 0) {
    for (const file of filesInDirectory) {
      await fs.unlink(path.join(directory, file));
    }
  }
};

const processFiles = async (req, res, processDir, uploadDir, userToken,  args) => {
  //processed file will be named as the name of the uploadDir's folder.pdf
  const pdfURL = `/${userToken}.pdf`;

  return new Promise((resolve, reject) => {
    let exitCode = 1;

    const argArray = args.split(' ');
    const length = Math.floor(argArray.length / 3) * 3;
    const pythonArgs = argArray.slice(0, length);


    for (let i = 0; i < pythonArgs.length - 1; i += 3) { //adding the full path to the files
      pythonArgs[i] = path.join(processDir, pythonArgs[i]);
    }

    console.log(pythonArgs)

    const pythonProcess = spawn('python3', [
      path.join(process.cwd(), 'src', 'scripts', 'environment', 'main.py'),
      ...pythonArgs,  // Spread the individual args as separate arguments
    ]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      exitCode = code;
      resolve(exitCode); // Resolve the promise with the exit code
    });
  })
    .then((exitCode) => {
      if (exitCode === 0) {
        // File processing completed successfully
        return fs.readFile(path.join("public", pdfURL))
          .then((processedFile) => {
            // res.setHeader('Content-Disposition', `attachment; filename=${userToken}.pdf`);
            // res.setHeader('Content-Type', 'application/pdf');
            // res.send(processedFile);
            // //const fileStream = fs.createReadStream(pdfURL);
            // //fileStream.pipe(res);
            const timestamp = Date.now();
            const unqiuePDFURL = `${pdfURL}?t=${timestamp}`;
            
            res.json({ pdfURL: unqiuePDFURL });
            return unqiuePDFURL;

          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          });


      } else {
        // File processing encountered an error
        res.status(500).json({ error: 'File processing error' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};


const handler = async (req, res) => {
  let args = ""

  const form = formidable();

  new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      args = fields.body

      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  console.log(args)
  

  try {
    const userToken = req.cookies['userToken'];
    if (!userToken){ //hassan replace this with a check against a database
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const encodedArgs = req.cookies['args']
    const decodedArgs = decodeURIComponent(encodedArgs);

    console.log(decodedArgs)

    //const lastQuestionPage = req.cookies['lastQuestionPage']
    //const firstQuestionNumber = req.cookies['firstQuestionNumber']

    //console.log("lastQuestionPage: " + lastQuestionPage)
    //console.log("firstQuestionNumber: " + firstQuestionNumber)


    const processDir = path.join(process.cwd(), 'src', 'uploads', 'unprocessed', userToken);
    //const uploadDir = path.join(process.cwd(), 'src', 'uploads', 'processed', userToken);
    const uploadDir = path.join(process.cwd(), 'public');


    const unqiuePDFURL = await processFiles(req, res, processDir, uploadDir, userToken, decodedArgs);

    //await clearDir(processDir);

  } catch (error) {
    console.error(error)
  }

};

export default handler;