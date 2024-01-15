const express = require('express');
const bankAccountRouter = express.Router();
const BankAccountController = require("../controller/BankAccountController")();

bankAccountRouter.route('/accounts/new')
    .post(BankAccountController.newAccount)

bankAccountRouter.route('/accounts/update-balance')
    .post(BankAccountController.updateAccountBalance)

bankAccountRouter.route('/accounts/update-name')
    .post(BankAccountController.updateAccountName)

bankAccountRouter.route('/accounts/update-status')
    .post(BankAccountController.updateAccountStatus)

bankAccountRouter.route('/accounts/update-type')
    .post(BankAccountController.updateAccountType)

bankAccountRouter.route('/accounts/update-currency')
    .post(BankAccountController.updateCurrency)

bankAccountRouter.route('/accounts/all/:page/:perPage/')
    .get(BankAccountController.allBankAccounts)

bankAccountRouter.route('/accounts/details/:accountNumber/')
    .get(BankAccountController.selectBankAccount)

bankAccountRouter.route('/accounts/user/:email/')
    .get(BankAccountController.selectUserBankAccounts)

bankAccountRouter.route('/accounts/edit-account/')
    .post(BankAccountController.updateAccount)

module.exports = bankAccountRouter;
