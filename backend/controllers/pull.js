const fs = require('fs').promises;
const path = require('path');
const {s3,S3_BUCKET} =require('../config/aws-config');

async function pullRepo(){
    const repoPath = path .resolve(process.cwd(),'.Git');
    const commitsPath = path.join(repoPath,'commits');
    try{
        //read all data from s3
        const data = await s3.listObjectsV2({Bucket:S3_BUCKET,Prefix:'commits/'}).promise(); //listObject function by aws

        const objects = data.Contents;
        for(const object of objects){
            const key =object.Key; //name of file
            const commitDir =path.join(commitsPath,path.dirname(key).split('/').pop()); //formatting the name to extract key
            await fs.mkdir(commitDir,{recursive:true});

            //AWS parameters
            const params = {
                Bucket: S3_BUCKET,
                Key : key,
            }
            //read file content 
            const fileContent =await s3.getObject(params).promise();
            await fs.writeFile(path.join(repoPath,key),fileContent.Body); //writing file
            console.log("Successfully pulled files")


        }

    }
    catch(err){
        console.error("Error pulling files:",err);
    }
}

module.exports={pullRepo};