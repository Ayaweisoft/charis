const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");
const {Schema} = require("mongoose");

function ProfileController(){
    const newProfile  = async (req, res) => {
        try {
            // Get user input
            const { user,
                username,
                firstName,
                lastName,
                email,
                dob,
                status,
                country,
                countryCode,
                phone,
                occupation,
                gender,
                city,
                state,
                zip,
                address,
                lga,
                joinDate,
             } = req.body;

            // Validate user input
            if (!(email)) {
                return res.status(400).send("User email is compulsory.");
            }

            // check if user already exist
            // Validate if profile already exists in our database
            const oldProfile = await Profile.findOne({user});

            if (oldProfile){
                return res.send({status: "error", msg: "A profile with that email already exists." })
            }

            // if (oldLoan && email !== "admin" && oldLoan?.status === "completed") {
            //     return res.status(409).send("Clear your previous loan before applying for another.");
            // }

            // Create user in our database
            const profile = await Profile.create({
                user,
                username,
                firstName,
                lastName,
                email,
                dob,
                status,
                country,
                countryCode,
                phone,
                occupation,
                gender,
                city,
                state,
                zip,
                address,
                joinDate,
                lga,
            });

            if (profile){
                return res.status(201).json(profile);
            }
            else{
                return res.status(400).send('Error in profile creation. Please try again later.')
            }
        } catch (err) {
            console.log(err);
        }
    }

    const allProfiles = async (req, res) => {
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
                Profile: q
            }

            if (q && q.length) {
                const profiles = await Profile.paginate(query, options);

                if (profiles){
                    return res.send({
                        status: "success",
                        data: profiles
                    });
                }
                else{
                    return res.send({
                        status: "error",
                        message: "Fetching profiles with query failed"
                    });
                }
            } else {
                // Pagination of all posts
                const profiles = await Profile.paginate({}, options);

                if (profiles){
                    return res.send({
                        status: "success",
                        data: profiles
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

    const selectProfile  = async (req, res) => {
        try {
            // Get user input
            const { user } = req.params;

            // let query = {
            //     $and: [
            //         { email },
            //         { method }
            //     ]
            // }

            const profile = await Profile.findOne({email: user});

            console.log({profile})

            if (!profile){
                return res.send({
                    status: 'error',
                    data: 'No profile with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: profile
            });
        } catch (err) {
            console.log(err);
        }
    }

    const editProfile  = async (req, res) => {
        try {
            // Get user input
            const { email, payload } = req.body;

            // let query = {
            //     $and: [
            //         { email },
            //         { method }
            //     ]
            // }

            console.log({email, payload});
            const profile = await Profile.findOneAndUpdate({email}, payload, {new: true});

            console.log({profile})

            if (!profile){
                return res.send({
                    status: 'error',
                    data: 'No profile with that id'
                })
            }

            // return the subscription found
            res.status(200).send({
                status: 'success',
                data: profile
            });
        } catch (err) {
            return res.send({
                status: 'error',
                msg: err
            })
        }
    }

    return { newProfile, editProfile, allProfiles, selectProfile }
}

module.exports = ProfileController
