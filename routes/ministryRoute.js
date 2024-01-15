const express = require('express');
const MinistryRouter = express.Router();
const MinistryController = require("../controller/MinistryController")();
// const auth = require("../middleware/auth");

MinistryRouter.route('/ministries/new')
    .post(MinistryController.newMinistry)

MinistryRouter.route('/ministries/edit')
    .post(MinistryController.editMinistry)

MinistryRouter.route('/ministries/all/:page/:perPage/')
    .get(MinistryController.allMinistries)

MinistryRouter.route('/ministries/details/:email/')
    .get(MinistryController.selectMinistry)


module.exports = MinistryRouter;
