const BankAccount = require("../models/FinanceReport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");

function BankAccountController(){
    const newAccount  = async (req, res) => {
        try {
            // Get user input
            const { user, bank, accountName, accountNumber, accountType, balance=0, currency= 'NGN', status ='active'} = req.body;

            // Validate user input
            if (!(user && accountName && accountNumber && accountType)) {
                return res.status(400).send("Account Name, Number and Type are compulsory in creating an account");
            }

            // check if user already exist
            // Validate if account number already exists in our database
            const oldAccount = await BankAccount.findOne({accountNumber});

            if (oldAccount) {
                return res.status(409).send("Account Already Exists. Please Create Another.");
            }

            // Create user in our database
            const account = await BankAccount.create({
                user,
                bank,
                accountName,
                accountNumber,
                accountType,
                balance,
                currency,
                status,
            });

            if (account){
                return res.status(201).json(account);
            }
            else{
                return res.status(400).send('Error in account creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateAccountBalance  = async (req, res) => {
        try {
            // Get user input
            const {accountNumber, balance} = req.body;

            if (!(accountNumber && balance)){
                return res.status(400).send("Account Number and Balance compulsory")
            }

            const filter = {
                accountNumber
            }

            let update = {
                balance: balance
            }

            let account = await BankAccount.findOneAndUpdate(filter, update)
            let updatedAccount = await BankAccount.findOne(filter)

            if (updatedAccount) {
                console.log("Updated Account: ", updatedAccount)
                res.send(
                    {
                        status: "success",
                        msg: "Account balance updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Account balance update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateAccountName  = async (req, res) => {
        try {
            // Get user input
            const {accountNumber, accountName} = req.body;

            if (!(accountNumber && accountName)){
                return res.status(400).send("Account Number and Name compulsory")
            }

            const filter = {
                accountNumber
            }

            let update = {
                accountName
            }

            let account = await BankAccount.findOneAndUpdate(filter, update)
            let updatedAccount = await BankAccount.findOne(filter)

            if (updatedAccount) {
                console.log("Updated Account: ", updatedAccount)
                res.send(
                    {
                        status: "success",
                        msg: "Account Name updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Account Name update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateAccountStatus  = async (req, res) => {
        try {
            // Get user input
            const {accountNumber, status} = req.body;

            if (!(accountNumber && status)){
                return res.status(400).send("Account Number and Status compulsory")
            }

            const filter = {
                accountNumber
            }

            let update = {
                status
            }

            let account = await BankAccount.findOneAndUpdate(filter, update)
            let updatedAccount = await BankAccount.findOne(filter)

            if (updatedAccount) {
                console.log("Updated Account: ", updatedAccount)
                res.send(
                    {
                        status: "success",
                        msg: "Account Status updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Account Status update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateAccountType = async (req, res) => {
        try {
            // Get user input
            const {accountNumber, accountType} = req.body;

            if (!(accountNumber && accountType)){
                return res.status(400).send("Account Number and type compulsory")
            }

            const filter = {
                accountNumber
            }

            let update = {
                accountType
            }

            let account = await BankAccount.findOneAndUpdate(filter, update)
            let updatedAccount = await BankAccount.findOne(filter)

            if (updatedAccount) {
                console.log("Updated Account: ", updatedAccount)
                res.send(
                    {
                        status: "success",
                        msg: "Account Type updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Account Type update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateCurrency = async (req, res) => {
        try {
            // Get user input
            const {accountNumber, currency} = req.body;

            if (!(accountNumber && currency)){
                return res.status(400).send("Account Number and currency compulsory")
            }

            const filter = {
                accountNumber
            }

            let update = {
                currency
            }

            let account = await BankAccount.findOneAndUpdate(filter, update)
            let updatedAccount = await BankAccount.findOne(filter)

            if (updatedAccount) {
                console.log("Updated Account: ", updatedAccount)
                res.send(
                    {
                        status: "success",
                        msg: "Account Currency updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Account Currency update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateAccount  = async (req, res) => {
        try {
            // Get user input
            const { user, payload } = req.body;

            if (!(user && payload)){
                return res.status(400).send("Email and Payload compulsory")
            }

            const filter = {
                user
            }


            let account = await BankAccount.findOneAndUpdate(filter, payload, )
            let updatedAccount = await BankAccount.findOne(filter)

            if (updatedAccount) {
                console.log("Updated Account: ", updatedAccount)
                res.send(
                    {
                        status: "success",
                        msg: "Account updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Account Name update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allBankAccounts = async (req, res) => {
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
                bankAccount: q
            }

            if (q && q.length) {
                const accounts = await User.paginate(query, options);

                if (accounts){
                    return res.send({
                        status: "success",
                        data: accounts
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching bank accounts with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const accounts = await BankAccount.paginate({}, options);

                if (accounts){
                    return res.send({
                        status: "success",
                        data: accounts
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching bank accounts failed'
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

    const selectBankAccount  = async (req, res) => {
        try {
            // Get user input
            const { accountNumber } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const account = await BankAccount.find({accountNumber});

            console.log({accountNumber})

            if (!account){
                return res.send({
                    status: 'error',
                    data: 'No bank account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: account
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectUserBankAccounts  = async (req, res) => {
        try {
            // Get user input
            const { email } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const account = await BankAccount.find({email});

            console.log({email})

            if (!account){
                return res.send({
                    status: 'error',
                    data: 'No bank account for that user.'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: account
            });
        } catch (err) {
            console.log(err);
        }
    }

    return { newAccount, updateAccountBalance, updateAccountName, updateAccountStatus,
    updateAccountType, updateCurrency, allBankAccounts, selectBankAccount, selectUserBankAccounts,
    updateAccount, }
}

module.exports = BankAccountController
