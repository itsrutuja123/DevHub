const fs = require('fs').promises;
const path = require('path');
const {s3,S3_BUCKET} = require('../config/aws-config');

async function pushRepo(){
    const repoPath = path.resolve(process.cwd(),'.Git');
    const commitsPath = path.join(repoPath,'commits');

    try{
        //read folder 
        const commitDirs = await fs.readdir(commitsPath);
        for( const commitDir of commitDirs ){ //loop for multiple folders
            const commitPath = path.join(commitsPath,commitDir); //multiple commits possible in commit folder
            const files = await fs.readdir(commitsPath); //read the files

            for(const file of files){ //loop for files in folder
                const filePath = path.join(commitPath,file);
                const fileContent = await fs.readFile(filePath);
                const params ={
                    //setting AWS parameters
                    BUCKET : S3_BUCKET,
                    Key : `commits/${commitDir}/${file}`,
                    Body : fileContent ,

                };
                await s3.upload(params).promise(); //this can take time and hence promise
            }
        }
        console.log("Successfully pushed files");
    }
    catch(err){
        console.error("Errro pushing files",err);
    }
}

module.exports={pushRepo};