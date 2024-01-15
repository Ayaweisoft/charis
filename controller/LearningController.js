const Profile = require("../models/Learning");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");
const {Schema} = require("mongoose");

function LearningController(){
    const newProfile  = async (req, res) => {
        try {
            // Get user input
            const {
                firstName,
                lastName,
                email,
                program,
                church,
                phone,
                occupation,
                gender,
                } = req.body;

            // Validate user input
            if (!(firstName)) {
                return res.status(400).send("User email is compulsory.");
            }

            // check if user already exist
            // Validate if profile already exists in our database
            const oldProfile = await Profile.findOne({email});

            // if (oldLoan && email !== "admin" && oldLoan?.status === "completed") {
            //     return res.status(409).send("Clear your previous loan before applying for another.");
            // }

            // Create user in our database
            const profile = await Profile.create({
                firstName,
                lastName,
                email,
                program,
                church,
                phone,
                occupation,
                gender,
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

    return { newProfile, allProfiles }
}

module.exports = LearningController
