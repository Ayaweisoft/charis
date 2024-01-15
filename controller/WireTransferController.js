const WireTransfer = require("../models/Devotional");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");

function WireTransferController(){
    const newTransfer  = async (req, res) => {
        try {
            // Get user input
            const {email, bankTo, swiftCode, routingNumber, country, accountNumber, accountName,
                amount, note="", currency= '$', status ='pending' } = req.body;

            // Validate user input
            if (!(email && bankTo && swiftCode && routingNumber)) {
                return res.status(400).send("Email, bank to, swift code and routing number are compulsory in adding a new Beneficiary.");
            }

            // check if user already exist
            // Validate if account number already exists in our database
            // const oldBeneficiary = await Beneficiary.findOne({accountNumber});
            //
            // if (oldBeneficiary) {
            //     return res.status(409).send("Clear your previous Beneficiary before applying for another.");
            // }

            // Create user in our database
            const transfer = await WireTransfer.create({
                email, bankTo, swiftCode, routingNumber, country, accountNumber, accountName,
                amount, note, currency, status
            });

            if (transfer){
                return res.status(201).json(transfer);
            }
            else{
                return res.status(400).send('Error in Wire Transfer. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allTransfers = async (req, res) => {
        try {
            const page = req.params?.page;
            const perPage = req.params?.perPage;
            const q = req.query?.q;

            const options = {
                page: page,
                limit: perPage,
                sort: {createdAt: -1}
            }

            const query = {
                WireTransfer: q
            }

            if (q && q.length) {
                const transfers = await WireTransfer.paginate(query, options);

                if (transfers){
                    return res.send({
                        status: "success",
                        data: transfers
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching Wire Transfers with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const transfers = await WireTransfer.paginate({}, options);

                if (transfers){
                    return res.send({
                        status: "success",
                        data: transfers
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching Wire Transfers failed'
                    })
                }


            }
        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }

    const selectTransfer  = async (req, res) => {
        try {
            // Get user input
            const { email, accountNumber } = req.params;

            let query = {
                $and: [
                    { email },
                    { accountNumber }
                ]
            }

            const transfer = await WireTransfer.find(query);

            console.log({transfer})

            if (!transfer){
                return res.send({
                    status: 'error',
                    data: 'No Wire Transfer with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: transfer
            });
        } catch (err) {
            console.log(err);
        }
    }

    const editTransfer  = async (req, res) => {
        try {
            // Get user input
            const { email, accountNumber, payload } = req.body;

            let query = {
                $and: [
                    { email },
                    { accountNumber }
                ]
            }

            const transfer = await WireTransfer.findOneAndUpdate(query, payload);

            console.log({transfer})

            if (!transfer){
                return res.send({
                    status: 'error',
                    data: 'No Wire Transfer with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: transfer
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectUserTransfers  = async (req, res) => {
        try {
            // Get user input
            const { email } = req.params;

            let query = {
                email
            }

            const transfer = await WireTransfer.find(query);

            console.log({transfer})

            if (!transfer){
                return res.send({
                    status: 'error',
                    data: 'No Wire Transfer with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: transfer
            });
        } catch (err) {
            console.log(err);
        }
    }

    return { newTransfer, allTransfers, selectTransfer, selectUserTransfers, editTransfer }
}

module.exports = WireTransferController
