const express = require('express');
const FDRRouter = express.Router();
const FDRController = require("../controller/FDRController")();

FDRRouter.route('/FDRs/new')
    .post(FDRController.newFDR)

FDRRouter.route('/FDR/update-balance')
    .post(FDRController.updateFDRBalance)

FDRRouter.route('/FDR/update-name')
    .post(FDRController.updateFDRName)

FDRRouter.route('/FDR/update-status')
    .post(FDRController.updateFDRStatus)

FDRRouter.route('/FDR/all/:page/:perPage/')
    .get(FDRController.allFDRs)

FDRRouter.route('/FDR/details/:email/:FDRName/')
    .get(FDRController.selectFDR)

FDRRouter.route('/FDR/user/:email/')
    .get(FDRController.selectUserFDR)

FDRRouter.route('/FDR/edit-fdr/')
    .post(FDRController.editFDR)

module.exports = FDRRouter;
