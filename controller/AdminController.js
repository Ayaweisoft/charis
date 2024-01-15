const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const moment = require("moment");
const path = require("path");

function AdminController(){
    const allUsers = async (req, res) => {
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
                email: q
            }

            if (q && q.length) {
                const users = await User.paginate(query, options);

                if (users){
                    return res.send({
                        status: "success",
                        data: users
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching users with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const users = await User.paginate({}, options);

                if (users){
                    return res.send({
                        status: "success",
                        data: users
                    });
                }
                else{
                    res.send({
                        status: 'error',
                        message: 'Fetching users failed'
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

    const selectUserByEmail  = async (req, res) => {
        try {
            // Get user input
            const { email } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const user = await User.findOne({email: email});

            if (!user){
                return res.send({
                    status: 'error',
                    data: 'No user with the specified email'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: user
            });
        } catch (err) {
            console.log(err);
        }
    }

    const editUser  = async (req, res) => {
        try {
            // Get user input
            const { id, payload } = req.body;

            // check if user already exist
            // Validate if user exist in our database
            const user = await User.findOneAndUpdate({_id: id},payload,{new: true});

            if (!user){
                return res.send({
                    status: 'error',
                    data: 'No user with the specified email'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: user
            });
        } catch (err) {
            console.log(err);
        }
    }

    const selectUserById  = async (req, res) => {
        try {
            // Get user input
            const { id } = req.params;

            // check if user already exist
            // Validate if user exist in our database
            const user = await User.findById(id);

            if (!user){
                return res.send({
                    status: 'error',
                    data: 'No user with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: user
            });
        } catch (err) {
            console.log(err);
        }
    }

    const deleteUser = async (req, res) => {
        try {
            const {email} = req.body;
            const user = await User.find({email});
            if (!user) {
                return res.status(404).send({
                    status: "error",
                    msg: "User not found"
                });
            }

            let deletedUser = await User.findOneAndDelete({email});

            if (deletedUser){
                return res.send({
                    status: "success",
                    msg: "User deleted"
                });
            }
            else{
                return res.send({
                    status: "error",
                    msg: "User not deleted successfully"
                });
            }


        } catch (e) {
            return res.send({
                status: 'error',
                message: e.toString()
            });
        }
    }

    return { allUsers, deleteUser, selectUserByEmail, selectUserById, editUser }
}

module.exports = AdminController;
