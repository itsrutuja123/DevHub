const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid"); //a package to generate a unique ID for each commit (version4) used

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".Git");
  //move file from staging area to commit folder
  const stagedPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    //creating an ID
    const commitID = uuidv4();
    //create a new folder with the name of ID
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });
    //read files from staged path
    const files = await fs.readdir(stagedPath);
    //loop through each file and copy it to the commit folder
    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file),
        path.join(commitDir, file)
      ); //start and end location of files to copy along with name
    }
    //create JSON file to keep track of commit data 
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString()  })
    ); //stringfy converts JS to JSON date stored when the commit is created
    console.log(`Yay! commit ${commitID} created with meassage: ${message}`);
  } catch (err) {
    console.error("Oops! Error cmmiting Change:", err,":(");
  }
}

module.exports = { commitRepo };
