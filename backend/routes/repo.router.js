const express = require('express');
const repoController = require('../controllers/repoController');
const repoRouter = express.Router();

// Define routes for repository operations
repoRouter.post("/repo/createRepo", repoController.createRepository);
repoRouter.get("/repo/getAllRepo", repoController.getAllRepository);
repoRouter.get("/repo/id/:id", repoController.fetchRepositoryById); // Avoid route conflicts
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName); // Fixed typo and conflict
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoryForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);

// Export the router
module.exports = repoRouter;
