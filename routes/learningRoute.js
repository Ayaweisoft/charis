const express = require('express');
const LearningRouter = express.Router();
const LearningController = require("../controller/LearningController")();

LearningRouter.route('/learners/new')
    .post(LearningController.newProfile)

LearningRouter.route('/learners/all/:page/:perPage/')
    .get(LearningController.allProfiles)


module.exports = LearningRouter;
