const Loan = require("../models/Message");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");

function LoanController(){
    const newLoan  = async (req, res) => {
        try {
            // Get user input
            const { isCore = false, email, method, amount, coin="",
                walletAddress="", bankName = "", accountNumber= '$',
                status ='pending', accountName = "", swiftCode="",
                routingNumber="", city="", zipCode="", date = new Date(),
             } = req.body;

            // Validate user input
            if (!(email && amount)) {
                return res.status(400).send("Username and amount are compulsory in applying for a new loan.");
            }

            // check if user already exist
            // Validate if account number already exists in our database
            const oldLoan = await Loan.findOne({email});

            // if (oldLoan && email !== "admin" && oldLoan?.status === "completed") {
            //     return res.status(409).send("Clear your previous loan before applying for another.");
            // }

            // Create user in our database
            const loan = await Loan.create({
                isCore,
                email,
                method,
                amount,
                coin,
                walletAddress,
                bankName,
                accountName,
                status,
                accountNumber,
                swiftCode,
                routingNumber,
                zipCode,
                city,
                date,
            });

            if (loan){
                return res.status(201).json(loan);
            }
            else{
                return res.status(400).send('Error in withdrawal creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateLoanBalance  = async (req, res) => {
        try {
            // Get user input
            const {email, loanName, amount} = req.body;

            if (!(email && loanName && amount)){
                return res.status(400).send("Username, Loan Name and Balance compulsory")
            }

            const filter = {
                $and: [
                    { email },
                    { loanName }
                ]
            }

            let update = {
                amount
            }

            let loan = await Loan.findOneAndUpdate(filter, update)
            let updatedLoan = await Loan.findOne(filter)

            if (updatedLoan) {
                console.log("Updated Loan: ", updatedLoan)
                res.send(
                    {
                        status: "success",
                        msg: "Loan balance updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Loan balance update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateLoanName  = async (req, res) => {
        try {
            // Get user input
            const {email, oldName, loanName} = req.body;

            if (!(email && loanName)){
                return res.status(400).send("Email and Loan name compulsory")
            }

            const filter = {
                $and: [
                    { email },
                    { loanName: oldName }
                ]
            }

            let update = {
                loanName
            }

            let loan = await Loan.findOneAndUpdate(filter, update)

            console.log({loan})

            let updatedFilter = {
                $and: [
                    { email },
                    { loanName }
                ]
            }
            let updatedLoan = await Loan.findOne(filter)

            console.log({updatedLoan})

            if (loan) {
                console.log("Updated Loan: ", updatedLoan)
                res.send(
                    {
                        status: "success",
                        msg: "Loan Name updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Loan Name update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateLoanStatus  = async (req, res) => {
        try {
            // Get user input
            const {email, oldStatus, newStatus} = req.body;

            if (!(email && oldStatus)){
                return res.status(400).send("Email and Loan status compulsory")
            }

            const filter = {
                $and: [
                    { email },
                    { status: oldStatus }
                ]
            }

            let update = {
                status: newStatus
            }

            let loan = await Loan.findOneAndUpdate(filter, update)

            console.log({loan})

            let updatedFilter = {
                $and: [
                    { email },
                    { status: newStatus }
                ]
            }
            let updatedLoan = await Loan.findOne(filter)

            console.log({updatedLoan})

            if (loan) {
                console.log("Updated Loan: ", updatedLoan)
                res.send(
                    {
                        status: "success",
                        msg: "Loan status updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Loan status update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateLoanInstallments  = async (req, res) => {
        try {
            // Get user input
            const {email, oldInstallments, newInstallments} = req.body;

            if (!(email && oldInstallments)){
                return res.status(400).send("Email and Installments currently paid compulsory")
            }

            const filter = {
                $and: [
                    { email },
                    { installmentsPaid: oldInstallments }
                ]
            }

            let update = {
                installmentsPaid: newInstallments
            }

            let loan = await Loan.findOneAndUpdate(filter, update)

            console.log({loan})

            let updatedFilter = {
                $and: [
                    { email },
                    { installmentsPaid: newInstallments }
                ]
            }
            let updatedLoan = await Loan.findOne(filter)

            console.log({updatedLoan})

            if (loan) {
                console.log("Updated Loan: ", updatedLoan)
                res.send(
                    {
                        status: "success",
                        msg: "Loan installments updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Loan installments update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allLoans = async (req, res) => {
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
                Loan: q
            }

            if (q && q.length) {
                const loans = await Loan.paginate(query, options);

                if (loans){
                    return res.send({
                        status: "success",
                        data: loans
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching loans with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const loans = await Loan.paginate({}, options);

                if (loans){
                    return res.send({
                        status: "success",
                        data: loans
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching loans failed'
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

    const selectLoan  = async (req, res) => {
        try {
            // Get user input
            const { email, method } = req.params;

            let query = {
                $and: [
                    { email },
                    { method }
                ]
            }

            const loan = await Loan.find(query);

            console.log({loan})

            if (!loan){
                return res.send({
                    status: 'error',
                    data: 'No account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: loan
            });
        } catch (err) {
            console.log(err);
        }
    }

    const editLoan  = async (req, res) => {
        try {
            // Get user input
            const { email, method, payload } = req.body;

            let query = {
                $and: [
                    { email },
                    { method }
                ]
            }

            const loan = await Loan.findOneAndUpdate(query, payload);

            console.log({loan})

            if (!loan){
                return res.send({
                    status: 'error',
                    data: 'No bank account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: loan
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectUserLoans  = async (req, res) => {
        try {
            // Get user input
            const { email } = req.params;

            let query = {
                email
            }

            const loan = await Loan.find(query);

            console.log({loan})

            if (!loan){
                return res.send({
                    status: 'error',
                    data: 'No bank account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: loan
            });
        } catch (err) {
            console.log(err);
        }
    }

    return { newLoan, updateLoanBalance, updateLoanName, updateLoanStatus, updateLoanInstallments,
     allLoans, selectLoan, selectUserLoans, editLoan }
}

module.exports = LoanController
