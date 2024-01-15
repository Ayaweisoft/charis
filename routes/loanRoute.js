const express = require('express');
const LoanRouter = express.Router();
const LoanController = require("../controller/LoanController")();

LoanRouter.route('/loans/new')
    .post(LoanController.newLoan)

LoanRouter.route('/loans/update-balance')
    .post(LoanController.updateLoanBalance)

LoanRouter.route('/loans/update-name')
    .post(LoanController.updateLoanName)

LoanRouter.route('/loans/update-status')
    .post(LoanController.updateLoanStatus)

LoanRouter.route('/loans/update-installments')
    .post(LoanController.updateLoanInstallments)

LoanRouter.route('/loans/all/:page/:perPage/')
    .get(LoanController.allLoans)

LoanRouter.route('/loans/details/:email/:loanName/')
    .get(LoanController.selectLoan)

LoanRouter.route('/loans/user/:email/')
    .get(LoanController.selectUserLoans)

LoanRouter.route('/loans/edit-loan')
    .post(LoanController.editLoan)

module.exports = LoanRouter;
