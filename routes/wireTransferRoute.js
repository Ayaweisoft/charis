const express = require('express');
const WireTransferRouter = express.Router();
const WireTransferController = require("../controller/WireTransferController")();

WireTransferRouter.route('/wire-transfer/new')
    .post(WireTransferController.newTransfer)

WireTransferRouter.route('/wire-transfer/all/:page/:perPage/')
    .get(WireTransferController.allTransfers)

WireTransferRouter.route('/wire-transfer/details/:email/:accountNumber/')
    .get(WireTransferController.selectTransfer)

WireTransferRouter.route('/wire-transfer/user/:email/')
    .get(WireTransferController.selectUserTransfers)

WireTransferRouter.route('/wire-transfer/edit')
    .post(WireTransferController.editTransfer)

module.exports = WireTransferRouter;
