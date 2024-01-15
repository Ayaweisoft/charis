const Ministry = require("../models/Ministry");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");

function MinistryController(){
    const newMinistry  = async (req, res) => {
        try {
            // Get user input
            const { name, alias, incorporationDate,
             } = req.body;

            // Validate user input
            if (!(name)) {
                return res.status(400).send("Ministry name is compulsory.");
            }

            // check if user already exist
            // Validate if account number already exists in our database
            const oldMinistry = await Ministry.findOne({name});

            if (oldMinistry) {
                return res.status(409).send("Ministry already exists");
            }

            // Create user in our database
            const ministry = await Ministry.create({
                name,
                alias,
                incorporationDate,
            });

            if (ministry){
                return res.status(201).json(ministry);
            }
            else{
                return res.status(400).json({status: "error", msg: 'Error in creating new ministry.'})
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allMinistries = async (req, res) => {
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
                Ministry: q
            }

            if (q && q.length) {
                const ministries = await Ministry.paginate(query, options);

                if (ministries){
                    return res.send({
                        status: "success",
                        data: ministries
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching ministries with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const ministries = await Ministry.paginate({}, options);

                if (ministries){
                    return res.send({
                        status: "success",
                        data: ministries
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching ministries failed'
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

    const selectMinistry  = async (req, res) => {
        try {
            // Get user input
            const { email } = req.params;

            // made so that ministry can be selected with name or id
            // let query = {
            //     $or: [
            //         { name },
            //         { _id: name }
            //     ]
            // }

            const ministry = await Ministry.find({email});

            console.log({ministry})

            if (!ministry){
                return res.send({
                    status: 'error',
                    data: 'No account with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: ministry
            });
        } catch (err) {
            console.log(err);
        }
    }

    const editMinistry  = async (req, res) => {
        try {
            // Get user input
            const { id, payload } = req.body;

            // let query = {
            //     $or: [
            //         { name },
            //         { _id: name }
            //     ]
            // }

            const ministry = await Ministry.findOneAndUpdate({_id: id}, payload,{new: true});

            console.log({ministry})

            if (!ministry){
                return res.send({
                    status: 'error',
                    data: 'No ministry with that id or name'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: ministry
            });
        } catch (err) {
            console.log(err);
        }
    }


    return { newMinistry, selectMinistry, editMinistry, allMinistries }
}

module.exports = MinistryController
