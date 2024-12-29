const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const mainRouter = require("./routes/main.router");
// Read the user input command and pass the control to respective controller file
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers"); // Utility to extract space from commands
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config(); // to enable .env file values
// argv are arguments from system commands and give the list of-(command, description, parameters, method to call)
yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, startServer)
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
      addRepo(argv.file); // passing file name as argument
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
    (args) => {
      commitRepo(args.message); // passing message as argument
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
    (argv) => {
      revertRepo(argv.commitID); // passing commit ID as argument
    }
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

// as command is demanded this is required
function startServer() {
  // creating express app
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGO_URL;
  
  // Establish MongoDB connection with proper options
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB:", err);
      process.exit(1); // Exit if MongoDB fails
    });

  app.use(cors({ origin: '*' })); // allow request from all sources
  app.use("/",mainRouter);

  

  let user = 'test'; // default user
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Setting up Socket.IO connection
  io.on("connection", (socket) => {
    socket.on('joinRoom', (userID) => {
      user = userID;
      console.log('===');
      console.log(user);
      console.log("====");
      socket.join(userID);
    });
  });

  // CRUD operations will be executed after MongoDB connection is open
  const db = mongoose.connection;
  db.once('open', async () => {
    console.log("CRUD operations called");
    // CRUD operations
  });

  // Start the HTTP server only if MongoDB connection is successful
  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
