const express = require('express');
const BeneficiaryRouter = express.Router();
const BeneficiaryController = require("../controller/BeneficiaryController")();

BeneficiaryRouter.route('/beneficiary/new')
    .post(BeneficiaryController.newBeneficiary)

BeneficiaryRouter.route('/beneficiary/all/:page/:perPage/')
    .get(BeneficiaryController.allBeneficiarys)

BeneficiaryRouter.route('/beneficiary/details/:email/:accountNumber/')
    .get(BeneficiaryController.selectBeneficiary)

BeneficiaryRouter.route('/beneficiary/user/:email/')
    .get(BeneficiaryController.selectUserBeneficiarys)

BeneficiaryRouter.route('/beneficiary/edit')
    .post(BeneficiaryController.editBeneficiary)

module.exports = BeneficiaryRouter;
