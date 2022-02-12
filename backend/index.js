/*const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost/compilerdb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    err && console.error(err);
    console.log("Successfully connected to MongoDB: compilerdb");
  }
);
const { generateFile } = require('./generateFile');
//const { executeJava } = require('./executeJava')

const { addJobToQueue } = require('./jobQueue');
const Job = require("./models/Job");


const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.get('/', (req, res)=> {
    return res.json({hello: "world!"});
});
/*app.post('/run', async (req, res) => {
    const { language, code, } = req.body;
    console.log(language, "Length: ",code.length);

    if( code === undefined){
        return res.status(400).json({ success: false, error: "Empty code body"});
    }
    

    //need to generate c++ file with content from request
        const filepath = await  generateFile(language, code,/*className);
    // we need to run the file and send the response
        //const output = await executeJava(filepath,className);
       /* const job = await new Job({ language, filepath }).save();
        
         const jobId = job["_id"];
         addJobToQueue(jobId);
        res.status(201).json({success:true, jobId });
        
      
        
    });
app.get("/status", async(req,res) => {

    const jobId = req.query.id;
    console.log(" status required: ", jobId);

    if(jobId == undefined){
        res.status(400).json({ success: false, error: "missing id query param"});
    }
    
        const job = await  Job.findById(jobId);
        if(job === undefined){
            return res.status(404).json({ success: false, error: "invalid job id"});
        }
        return res.status(200).json({success: true,job});


});


    
     
app.listen(5000,() => {
    console.log(`Listening on port 5000!`);
})*/

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost/compilerdb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    err && console.error(err);
    console.log("Successfully connected to MongoDB: compilerdb");
  }
);

const { generateFile } = require("./generateFile");

const { addJobToQueue } = require("./jobQueue");
const Job = require("./models/Job");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  const { language = "py", code } = req.body;

  console.log(language, "Length:", code.length);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  // need to generate a c++ file with content from the request
  const filepath = await generateFile(language, code);
  // write into DB
  const job = await new Job({ language, filepath }).save();
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ jobId });
});

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  console.log(` status required:  ${jobId}`);
  //console.log(jobId);
  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }

  const job = await Job.findById(jobId);

  if (job === undefined) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }

  return res.status(200).json({ success: true, job });
});

app.listen(5000, () => {
  console.log(`Listening on port 5000!`);
});