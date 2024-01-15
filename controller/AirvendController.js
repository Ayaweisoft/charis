const BankAccount = require("../models/FinanceReport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");
const https = require("https");
var https2 = require('follow-redirects').https;

function AirvendController(){
    const newCustomer  = async (req, res) => {
        try {
            // Get user input
            const { firstName, lastName, phone, email } = req.body;

            // Validate user input
            if (!(firstName && lastName && phone)) {
                return res.status(400).json({ status: "error", msg: "First Name, Last Name and Phone are compulsory in creating an account"});
            }

            // Create new customer on Paystack Dashboard
            const params = JSON.stringify({
                email,
                "first_name": firstName,
                "last_name": lastName,
                phone,

            })

            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: '/customer',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }

            const request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({status: "error", msg: error})
            })

            request.write(params)
            request.end()


        } catch (err) {
            console.log(err);
        }
    }

    const allCustomers  = async (req, res) => {
        try {
            // Get user input
            const { perPage, page, } = req.params;

            // Create new customer on Paystack Dashboard
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/customer`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            const request = https.request(options, response => {
                let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                });

                response.on('end', () => {
                    console.log(JSON.parse(data))
                    return res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({status: "error", msg: error})
            })

            request.end();


        } catch (err) {
            console.log(err);
        }
    }

    const getCustomer  = async (req, res) => {
        try {
            // Get user input
            const { email_or_code, } = req.params;

            console.log({email_or_code})

            // Create new customer on Paystack Dashboard
            const options = {
                hostname: 'api.paystack.co',
                port: 443,
                path: `/customer/${email_or_code}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

            let data = ''
            const request = https.request(options, response => {
                // let data = ''

                response.on('data', (chunk) => {
                    data += chunk
                    console.log({data})
                });

                response.on('end', () => {
                    console.log(JSON.parse(data))
                    return  res.json(JSON.parse(data))
                })
            }).on('error', error => {
                return res.json({status: "error", msg: error})
            })

            // request.write(params)
            request.end()


        } catch (err) {
            console.log(err);
        }
    }
    

    return {   }
}

module.exports = AirvendController;
