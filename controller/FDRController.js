const FDR = require("../models/Department");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");

function FDRController(){
    const newFDR  = async (req, res) => {
        try {
            // Get user input
            const { email, FDRName, minimum, maximum, amount, profit, status="running", intervalType ='fixed', lockedInPeriod = '1 year',
            date = new Date(), dueDate = new Date().setFullYear(new Date().getFullYear() + 1), isCore=false } = req.body;

            // Validate user input
            if (!(email && FDRName && minimum && maximum && amount && profit)) {
                return res.status(400).send("Username, name, minumum, maximum, amount and profit are compulsory in applying foe a new FDR.");
            }

            // check if user already exist
            // Validate if account number already exists in our database
            // const oldFDR = await FDR.findOne({email});

            // if (oldFDR) {
            //     return res.status(409).send("Clear your previous FDR before applying for another.");
            // }

            // Create user in our database
            const fdr = await FDR.create({
                email, FDRName, minimum, maximum, amount, profit, intervalType, lockedInPeriod,
                date, dueDate, status, isCore
            });

            if (fdr){
                return res.status(201).json(fdr);
            }
            else{
                return res.status(400).send('Error in FDR creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateFDRBalance  = async (req, res) => {
        try {
            // Get user input
            const {email, FDRName, amount} = req.body;

            if (!(email && FDRName && amount)){
                return res.status(400).send("Username, FDR Name and Balance compulsory")
            }

            const filter = {
                $and: [
                    { email },
                    { FDRName }
                ]
            }

            let update = {
                amount
            }

            let fdr = await FDR.findOneAndUpdate(filter, update)
            let updatedFDR = await FDR.findOne(filter)

            if (fdr) {
                console.log("Updated FDR: ", updatedFDR)
                res.send(
                    {
                        status: "success",
                        msg: "FDR balance updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "FDR balance update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateFDRName  = async (req, res) => {
        try {
            // Get user input
            const {email, oldName, FDRName} = req.body;

            if (!(email && oldName && FDRName)){
                return res.status(400).send("Email and FDR name compulsory")
            }

            const filter = {
                $and: [
                    { email },
                    { FDRName: oldName }
                ]
            }

            let update = {
                FDRName
            }

            let fdr = await FDR.findOneAndUpdate(filter, update)

            console.log({fdr})

            let updatedFilter = {
                $and: [
                    { email },
                    { FDRName }
                ]
            }
            let updatedFDR = await FDR.findOne(filter)

            console.log({updatedFDR})

            if (fdr) {
                console.log("Updated FDR: ", updatedFDR)
                res.send(
                    {
                        status: "success",
                        msg: "FDR Name updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "FDR Name update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateFDRStatus  = async (req, res) => {
        try {
            // Get user input
            const {email, oldStatus, newStatus} = req.body;

            if (!(email && oldStatus)){
                return res.status(400).send("Email and FDR status compulsory")
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

            let fdr = await FDR.findOneAndUpdate(filter, update)

            console.log({fdr})

            let updatedFilter = {
                $and: [
                    { email },
                    { status: newStatus }
                ]
            }
            let updatedFDR = await FDR.findOne(filter)

            console.log({updatedFDR})

            if (fdr) {
                console.log("Updated FDR: ", updatedFDR)
                res.send(
                    {
                        status: "success",
                        msg: "FDR status updated successfully."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "FDR status update failed. Please try again."
                    }
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allFDRs = async (req, res) => {
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
                FDR: q
            }

            if (q && q.length) {
                const fdrs = await FDR.paginate(query, options);

                if (fdrs){
                    return res.send({
                        status: "success",
                        data: fdrs
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching FDRs with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const fdrs = await FDR.paginate({}, options);

                if (fdrs){
                    return res.send({
                        status: "success",
                        data: fdrs
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching FDRs failed'
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

    const selectFDR  = async (req, res) => {
        try {
            // Get user input
            const { email, FDRName } = req.params;

            let query = {
                $and: [
                    { email },
                    { FDRName }
                ]
            }

            const fdr = await FDR.find(query);

            console.log({fdr})

            if (!fdr){
                return res.send({
                    status: 'error',
                    data: 'No bank account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: fdr
            });
        } catch (err) {
            console.log(err);
        }
    }

    const editFDR  = async (req, res) => {
        try {
            // Get user input
            const { email, FDRName, payload } = req.body;

            let query = {
                $and: [
                    { email },
                    { FDRName }
                ]
            }

            const fdr = await FDR.findOneAndUpdate(query, payload);

            console.log({fdr})

            if (!fdr){
                return res.send({
                    status: 'error',
                    data: 'No bank account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: fdr
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectUserFDR  = async (req, res) => {
        try {
            // Get user input
            const { email } = req.params;

            let query = {
                email
            }

            const fdr = await FDR.find(query);

            console.log({fdr})

            if (!fdr){
                return res.send({
                    status: 'error',
                    data: 'No bank account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: fdr
            });
        } catch (err) {
            console.log(err);
        }
    }

    return { newFDR, updateFDRBalance, updateFDRName, updateFDRStatus,
     allFDRs, selectFDR, selectUserFDR, editFDR }
}

module.exports = FDRController
