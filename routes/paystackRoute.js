const express = require('express');
const PaystackRouter = express.Router();
const PaystackController = require("../controller/PaystackController")();

PaystackRouter.route('/customers/new')
    .post(PaystackController.newCustomer)

PaystackRouter.route('/customers/:perPage/:page')
    .get(PaystackController.allCustomers)

PaystackRouter.route('/customers/:email_or_code')
    .get(PaystackController.getCustomer)

PaystackRouter.route('/customers/edit/:code')
    .put(PaystackController.editCustomer)

PaystackRouter.route('/paystack/banks-list')
    .get(PaystackController.listBanks)

PaystackRouter.route('/paystack/countries-list')
    .get(PaystackController.listCountries)

PaystackRouter.route('/paystack/states-list')
    .get(PaystackController.listStates)

PaystackRouter.route('/paystack/virtual-account')
    .post(PaystackController.newVirtualAccount)

PaystackRouter.route('/paystack/customer-and-virtual-account')
    .post(PaystackController.newCustomerAndVirtualAccount)

PaystackRouter.route('/paystack/virtual-account-list')
    .get(PaystackController.listVirtualAccounts)

PaystackRouter.route('/paystack/account/:id')
    .get(PaystackController.fetchVirtualAccounts)

PaystackRouter.route('/paystack/requery-dedicated-account/:accountNumber')
    .get(PaystackController.requeryDedicatedAccount)

PaystackRouter.route('/paystack/all-transactions')
    .get(PaystackController.listAllTransactions)

PaystackRouter.route('/paystack/transaction-details/:id')
    .get(PaystackController.fetchTransactionDetails)

PaystackRouter.route('/paystack/verify-account/:bank_code/:account_number')
    .get(PaystackController.resolveAccountNumber)

PaystackRouter.route('/paystack/create-transfer-recipient')
    .post(PaystackController.createTransferRecipient)

PaystackRouter.route('/paystack/transfer-recipients-list')
    .get(PaystackController.listTransferRecipients)

PaystackRouter.route('/paystack/transfer-recipients/details/:id_or_code')
    .get(PaystackController.fetchTransferRecipient)

PaystackRouter.route('/paystack/initiate-transfer')
    .post(PaystackController.initiateTransfer)

PaystackRouter.route('/paystack/list-transfers')
    .get(PaystackController.listTransfers)

module.exports = PaystackRouter;
