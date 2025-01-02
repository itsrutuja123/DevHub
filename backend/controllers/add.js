const fs = require('fs').promises;
const path =require('path');

//funstion to copy the file and add it to staging named folder to add in repo
async function addRepo(filePath){
    const repoPath = path.resolve(process.cwd(),'.Git');
    const stagingPath =path.join(repoPath,'staging');

    try{
        await fs.mkdir(stagingPath,{recursive:true});
        const fileName =path.basename(filePath); // to read the filename given bu user
        //to copy the file in staging path 
        await fs.copyFile(filePath,path.join(stagingPath,fileName));
        console.log(`Hooray! File ${fileName} added to the staging area :)`);
    }
    catch(err){
        console.error("Oops! Error adding the file:",err ,":(");
    }

}

module.exports={addRepo};