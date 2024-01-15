const express = require('express');
const ProfileRouter = express.Router();
const ProfileController = require("../controller/ProfileController")();

ProfileRouter.route('/profiles/new')
    .post(ProfileController.newProfile)

ProfileRouter.route('/profiles/all/:page/:perPage/')
    .get(ProfileController.allProfiles)

ProfileRouter.route('/profiles/details/:user')
    .get(ProfileController.selectProfile)

ProfileRouter.route('/profiles/edit')
    .post(ProfileController.editProfile)

module.exports = ProfileRouter;
