const Queue = require("bull");

const Job = require('./models/Job');

const { executePy } = require("./executePy");
const jobQueue = new Queue("job-runner-queue");
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({data}) => {
    console.log(data);
    const jobId = data.id;
    const job = await Job.findById(jobId);
    if(job === undefined){
      throw Error("job not found");
    }
    console.log("Fetched Job", job);
      try{  
        let output;
        job["startedAt"] = new Date();
        /*if(language === "java"){
            output = await executeJava(filepath);
        } else*/
         if(job.language === "py"){
            output = await executePy(job.filepath);
            console.log(output);
        }
        
        job["completedAt"]= new Date();
        job["status"] = "success";
        job["output"] = output;

        await job.save();
        console.log(job);
        return res.json({ filepath, output});
        return true;
    } catch (err) {
        job["completedAt"] = new Date();
        job["status"] ="error";
        job["output"] =JSON.stringify(err);
        await job.save();
        throw Error(JSON.stringify(err));
        res.status(500).json({ err });
    }
    
    
});
jobQueue.on('failed', (error) => {
  console.log(error.data.id, "failed", error.failedReason);
});


const addJobToQueue = async (jobId) => {
  await jobQueue.add({ id: jobId});
}

module.exports = {
  addJobToQueue,
}