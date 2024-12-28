const fs= require('fs');
const path =require('path');
const {promisify} = require('util'); //this package allows to check for existing things 

const readdir =promisify(fs.readdir); //read only if repo exist
const copyFile = promisify(fs.copyFile); //if commit exist files of that copy in parent directory

async function revertRepo(){
    const repoPath =path.resolve(process.cwd(),'.Git');
    const commitsPath =path.join(repoPath,'commits');

    try{
        //read commit path 
        const commitDir= path.join(commitsPath,commitID);
        const files= await readdir(commitDir); //if unable to read meand no such commit exist or else
        //copy files from commit to parent directory
        const parentDir = path.resolve(repoPath,'..');
        for(const file of files){
            await copyFile(path.join(commitDir,file),path.join(parentDir,file)); //copy from commitdir to parentdir
        }
        console.log(`Revert successful to commitID:${commitID}`);
    }
    catch(err){
        console.log("Error reverting to commit:",err)
    }
}

module.exports={revertRepo};