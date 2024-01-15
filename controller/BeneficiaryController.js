const Beneficiary = require("../models/Followup");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");

function BeneficiaryController(){
    const newBeneficiary  = async (req, res) => {
        try {
            // Get user input
            const {email, accountName, accountNumber, accountType, nickname = "", currency= '$', status ='active' } = req.body;

            // Validate user input
            if (!(email && accountName && accountNumber && accountType)) {
                return res.status(400).send("Email, name, account number and account type are compulsory in adding a new Beneficiary.");
            }

            // check if user already exist
            // Validate if account number already exists in our database
            const oldBeneficiary = await Beneficiary.findOne({accountNumber});

            if (oldBeneficiary) {
                return res.status(409).send("Clear your previous Beneficiary before applying for another.");
            }

            // Create user in our database
            const beneficiary = await Beneficiary.create({
                email, accountName, accountNumber, accountType, nickname, currency, status
            });

            if (beneficiary){
                return res.status(201).json(beneficiary);
            }
            else{
                return res.status(400).send('Error in Beneficiary creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allBeneficiarys = async (req, res) => {
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
                Beneficiary: q
            }

            if (q && q.length) {
                const beneficiarys = await Beneficiary.paginate(query, options);

                if (beneficiarys){
                    return res.send({
                        status: "success",
                        data: beneficiarys
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching Beneficiarys with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const beneficiarys = await Beneficiary.paginate({}, options);

                if (beneficiarys){
                    return res.send({
                        status: "success",
                        data: beneficiarys
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching Beneficiarys failed'
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

    const selectBeneficiary  = async (req, res) => {
        try {
            // Get user input
            const { email, accountNumber } = req.params;

            let query = {
                $and: [
                    { email },
                    { accountNumber }
                ]
            }

            const beneficiary = await Beneficiary.find(query);

            console.log({beneficiary})

            if (!beneficiary){
                return res.send({
                    status: 'error',
                    data: 'No bank account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: beneficiary
            });
        } catch (err) {
            console.log(err);
        }
    }

    const editBeneficiary  = async (req, res) => {
        try {
            // Get user input
            const { email, accountNumber, payload } = req.body;

            let query = {
                $and: [
                    { email },
                    { accountNumber }
                ]
            }

            const beneficiary = await Beneficiary.findOneAndUpdate(query, payload);

            console.log({beneficiary})

            if (!beneficiary){
                return res.send({
                    status: 'error',
                    data: 'No bank account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: beneficiary
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectUserBeneficiarys  = async (req, res) => {
        try {
            // Get user input
            const { email } = req.params;

            let query = {
                email
            }

            const beneficiary = await Beneficiary.find(query);

            console.log({beneficiary})

            if (!beneficiary){
                return res.send({
                    status: 'error',
                    data: 'No bank account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: beneficiary
            });
        } catch (err) {
            console.log(err);
        }
    }

    return { newBeneficiary, allBeneficiarys, selectBeneficiary, selectUserBeneficiarys, editBeneficiary }
}

module.exports = BeneficiaryController
