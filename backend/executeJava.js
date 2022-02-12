const { exec } = require("child_process");
const fs  = require('fs');
const path =require('path');

const outputPath = path.join(__dirname, "outputs");

if(!fs.existsSync(outputPath)){
  fs.mkdirSync(outputPath, {recursive: true});
}


const executeJava =  async(filepath,className) => {
   //abc.java
   console.log(filepath);
  const jobId = path.basename(filepath).split(".")[0];
  console.log(jobId);
   console.log(outputPath);
   const outPath = path.join(outputPath, `${jobId}.class`);
   console.log(outPath);
  return new Promise((resolve,reject) => {
    try{
      exec(
         `javac ${filepath} -d ${outputPath}`,
         (error, stdout, stderr) => {
          error && reject({ error, stderr });
          stderr && reject(stderr);
          resolve(stdout);
        }
      )
    }

      catch(Exception){
            console.log('error got bro')

      }
   
  });
}


module.exports = {
  executeJava
}