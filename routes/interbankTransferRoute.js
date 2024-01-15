const express = require('express');
const InterbankTransferRouter = express.Router();
const InterbankTransferController = require("../controller/InterbankTransferController")();

InterbankTransferRouter.route('/interbank-transfer/new')
    .post(InterbankTransferController.newTransfer)

InterbankTransferRouter.route('/interbank-transfer/all/:page/:perPage/')
    .get(InterbankTransferController.allTransfers)

InterbankTransferRouter.route('/interbank-transfer/details/:email/:accountNumber/')
    .get(InterbankTransferController.selectTransfer)

InterbankTransferRouter.route('/interbank-transfer/user/:email/')
    .get(InterbankTransferController.selectUserTransfers)

InterbankTransferRouter.route('/interbank-transfer/edit')
    .post(InterbankTransferController.editTransfer)

module.exports = InterbankTransferRouter;
