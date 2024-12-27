//Read the user input command and pass the control to respective controller file
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers"); //Utility to extract space from commands
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

//argv are arguments from system commands and give the list of-(command,description,parameters,method to call)
yargs(hideBin(process.argv))
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add files to repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file); //passing file name as argument
    }
  )
  .command(
    "commit <message>",
    "Commit the changes",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit changes",
        type: "string",
      });
    },
    (args)=>{
        commitRepo(args.message); //passing message as argument
    }
  )
  .command("pull", "Pull a repository", {}, pullRepo)
  .command("push", "Push a repository", {}, pushRepo)
  .command(
    "revert <commitID>",
    "Revert to previous commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert",
        type: "string",
      });
    },
    revertRepo
  )
  .demandCommand(1, "You need atleast one command")
  .help().argv;
