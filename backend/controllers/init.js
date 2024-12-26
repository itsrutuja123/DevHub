const fs=require('fs').promises; //node file system import 
const path = require('path');

async function initRepo(){
    const repoPath = path.resolve(process.cwd(),".Git"); //gives the correct working directory and creates hidden folder Git
    const commitsPath = path.join(repoPath,'commits');

    try{
        await fs.mkdir(repoPath,{recursive:true});//recursive to create nested folder structure
        await fs.mkdir(commitsPath,{recursive:true});
        await fs.writeFile(path.join(repoPath,'config.json'),JSON.stringify({bucket: process.env.S3_BUCKET}));
        console.log("Repository initialized");
    }
    catch(err){
            console.error("Error initialising the repository",err)
    }
}

module.exports={initRepo};


