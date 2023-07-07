const { spawn } = require('child_process');

const processPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonScript = spawn('python', ['path/to/your/script.py', filePath]);

    pythonScript.stdout.on('data', (data) => {
      // Handle any output from the Python script
      console.log(`Python script output: ${data}`);
    });

    pythonScript.stderr.on('data', (data) => {
      // Handle any error output from the Python script
      console.error(`Python script error: ${data}`);
      reject(data);
    });

    pythonScript.on('close', (code) => {
      // The Python script has finished running
      console.log(`Python script exited with code ${code}`);
      resolve();
    });
  });
};

// Assume `uploadedFiles` is an array of file paths uploaded by the user
const uploadedFiles = ['/path/to/file1.pdf', '/path/to/file2.pdf'];

const processUploadedFiles = async () => {
  for (const filePath of uploadedFiles) {
    try {
      await processPDF(filePath);
      console.log(`PDF processing complete for file: ${filePath}`);
    } catch (error) {
      console.error(`Error processing PDF: ${error}`);
    }
  }
};

processUploadedFiles();
