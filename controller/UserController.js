const User = require("../models/User");
const Profile = require("../models/Profile");
const Ministry = require("../models/Ministry");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const sendEmail = require("../utils/emails");
const mongoose = require("mongoose");
const {generateOTP} = require("../utils/utilFunctions");

const { TWILIO_SERVICE_SID, TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID } =  process.env
const twilioClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
})

function UserController(){
    const sendOTP = async (req, res, next) => {
        const { phoneNumber } = req.body;

        try{
            // const otpResponse = await twilioClient.verify
            //     .services(TWILIO_SERVICE_SID)
            //     .verifications.create({
            //         to: `${phoneNumber}`,
            //         channel: 'sms'
            //     });
            // res.status(200).send({
            //     status: 'success',
            //     data: otpResponse
            // })

            // temporary code
            const verifiedResponse = {valid: true}
            if (verifiedResponse?.valid){
                console.log("Here")
                //codes to create a new user

                // const oldUser = await User.findOne({username: phoneNumber});
                const oldUser = await User.findOne({username: phoneNumber})

                let user = null


                if (oldUser){
                    user = oldUser
                }
                else{
                    user = await User.create({
                        phone: phoneNumber,
                        username: phoneNumber,
                    });
                }

                // Create loginToken
                const loginToken = jwt.sign(
                    {user_id: user._id, username: user?.username},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "2h",
                    }
                );
                // save user loginToken
                user.loginToken = loginToken;

                // return res.status(201).json(user)
                return res.status(200).send({
                    status: 'success',
                    data: user
                })

            }
            else{
                res.status(209).send({
                    status: "error",
                    msg: 'Invalid OTP'
                })
            }

        }
        catch(err){
            res.status(err?.status || 400).send({
                status: 'error',
                msg: err?.message || 'Something went wrong'
            })
        }
    }
    const verifyOTP = async (req, res, next) => {
        const { phoneNumber, otp } = req.body;

        console.log({phoneNumber})

        try{
            // const verifiedResponse = await twilioClient.verify
            //     .services(TWILIO_SERVICE_SID)
            //     .verificationChecks.create({
            //         to: `${phoneNumber}`,
            //         code: otp
            //     });
            // console.log("Verified Response: ", verifiedResponse)
            const verifiedResponse = {valid: true}
            return true;
            // if (verifiedResponse?.valid){
            //     //codes to create a new user
            //
            //     // const oldUser = await User.findOne({username: phoneNumber});
            //     const oldUser = await User.findOne({username: phoneNumber})
            //
            //     let user = null
            //
            //
            //     if (oldUser){
            //         user = oldUser
            //     }
            //     else{
            //         user = await User.create({
            //             phone: phoneNumber,
            //             username: phoneNumber,
            //         });
            //     }
            //
            //     // Create loginToken
            //     const loginToken = jwt.sign(
            //         {user_id: user._id, username: user?.username},
            //         process.env.JWT_SECRET,
            //         {
            //             expiresIn: "2h",
            //         }
            //     );
            //     // save user loginToken
            //     user.loginToken = loginToken;
            //
            //     return res.status(201).json(user)
            // }
            // else{
            //     res.status(209).send({
            //         status: "error",
            //         msg: 'Invalid OTP'
            //     })
            // }
        }
        catch (err){
            res.status(err?.status || 400).send({
                status: "error",
                message: err?.message || 'Something went wrong'
            })
        }
    }
    const register  = async (req, res) => {
        try {
            console.log("In Backend")
            // Get user input
            const {firstName, lastName, email, password,
             } = req.body;

            console.log(req.body)

            // Validate user input
            if (!(email && password && firstName && lastName)) {
                res.status(400).json("Email, first name, last name and password are required");
            }

            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await User.findOne({email});

            // check if there's already a church admin for the ministry
            // const filter = {
            //     $and: [
            //         { ministry },
            //         { type }
            //     ]
            // }
            // const oldAdmin = await User.findOne(filter)

            if (oldUser) {
                return res.status(409).json("User Already Exists. Please Login");
            }

            // if (oldAdmin){
            //     return res.status(409).json("Church Admin Already Exists for Ministry.Please contact support.");
            // }

            //Encrypt user password
            let encryptedPassword = await bcrypt.hash(password, 10);

            // // Create Ministry
            // const newMinistry = await Ministry.create({
            //     name: ministry, // sanitize: convert email to lowercase
            // });
            //
            // console.log({newMinistry})
            // console.log("Ministry ID: ", newMinistry?._id)

            // Create user in our database
            console.log("Got to create user code")
            const user = await User.create({
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                username: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
            });

            // Create loginToken
            const loginToken = jwt.sign(
                {user_id: user._id, email},
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                }
            );
            // save user loginToken
            user.loginToken = loginToken;

            // create basic user profile data
            // Create user in our database
            const profile = await Profile.create({
                firstName,
                lastName,
                email: email?.toLowerCase(),
            });

            // create email verification link
            const secret = jwt.sign({email}, process.env.JWT_SECRET)
            const verifyUrl = `/email/verify/${new Buffer.from(secret, 'utf8').toString('base64')}`;
            // const verifyUrl  = `/email/verify/${new Buffer.alloc(32, secret).toString('base64')}`;
            // console.log("Verify URL: ", verifyUrl)
            // console.log("Secret: ", secret)
            const verificationUrl = `${process.env.FRONT_END}${verifyUrl}`;

            // construct verification email
            const source = fs.readFileSync("./storage/emails/verifyEmail.mjml", "utf8");
            const htmlOutput = mjml2html(source);
            const template = Handlebars.compile(htmlOutput.html);
            const templateData = {
                firstName,
                url: verificationUrl
            };

            // send verification email
            sendEmail(email, "", "Charis", "Charis <noreply@mudiaga.com.ng>",
                "Registration Successful", "", template(templateData))

            // return new user
            res.status(201).json(user);
        } catch (err) {
            console.log(err);
        }
    }

    const login = async (req, res) => {
        try {
            // Get user input
            const {email, password} = req.body;

            // Validate user input
            if (!(email && password)) {
                res.status(400).json("All input is required");
            }
            // Validate if user exist in our database
            const user = await User.findOne({email});

            if (!user) {
                return res.status(400).json("Email not yet registered. Please sign up to create an account");
            }

            if (user && (await bcrypt.compare(password, user.password))) {
                // Create loginToken
                const loginToken = jwt.sign(
                    {user_id: user._id, email},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "2h",
                    }
                );

                // save user loginToken
                user.loginToken = loginToken;

                // user
                res.status(200).json(user);
            }
            else{
                res.status(400).json("Email or password incorrect");
            }

        } catch (err) {
            console.log(err);
        }
    }

    const verifyUser = async (req, res) => {
        let verifyToken = req?.params?.verifyToken;
        let decoded = Buffer.from(verifyToken, 'base64').toString('utf8')


        try {
            decoded = jwt.verify(decoded, process.env.JWT_SECRET);

            const filter = {
                email: decoded?.email
            }

            const update = {
                verified: true,
                emailVerifiedAt: new Date(),
            }

            let user = await User.findOneAndUpdate(filter, update)
            let verifiedUser = await User.findOne(filter)

            if (verifiedUser?.verified) {
                console.log("User: ", verifiedUser)
                // res.redirect("http://localhost:3000/"
                // ) // Todo make a res.send
                return res.send({
                    status: "success"
                })
            } else {
                return res.send(
                    {
                        status: "failed",
                        msg: "Email link expired"
                    }
                )
            }

            // res.send(decoded?.email)
        } catch (err) {
            console.log("Error: ", err)
            res.send(
                {
                    status: "failed",
                    message: "Invalid link"
                }
            )
        }

    }

    const resendVerificationLink = async (req, res) => {
        let email = req?.body?.email
        let user = await User.findOne({email: email})

        if (user) {
            console.log("User: ", user)

            let email = user?.email;
            let firstName = user?.firstName;

            console.log({
                email: email,
                firstName: firstName
            })

            // create email verification link
            const secret = jwt.sign({email}, process.env.JWT_SECRET)
            const verifyUrl = `/email/verify/${new Buffer.from(secret, 'utf8').toString('base64')}`;
            const verificationUrl = `${process.env.FRONT_END}${verifyUrl}`;

            // construct verification email
            const source = fs.readFileSync("./storage/emails/verifyEmail.mjml", "utf8");
            const htmlOutput = mjml2html(source);
            const template = Handlebars.compile(htmlOutput.html);
            const templateData = {
                firstName,
                url: verificationUrl
            };

            // send verification email
            sendEmail(email, "", "Church MS", "Church Management System <noreply@mudiaga.com.ng>",
                "Email Verification", "", template(templateData))

            // res.status(200).send("Done")
            res.send({
                status: 'success',
                message: 'User not found'
            })
        } else {
            res.send({
                status: 'error',
                message: 'User not found'
            })
        }

    }

    const forgotPassword = async (req, res) => {
        let email = req?.body?.email
        console.log("Email: ", email)
        let user = await User.findOne({email: email})

        if (user) {
            console.log("User: ", user)

            let firstName = user?.firstName;

            console.log({
                email: email,
                firstName: firstName
            })

            // create email verification link
            const secret = jwt.sign({email}, process.env.JWT_SECRET)
            const verifyUrl = `/reset-password/${new Buffer.from(secret, 'utf8').toString('base64')}`;
            const verificationUrl = `${process.env.FRONT_END}${verifyUrl}`;

            // construct verification email
            const source = fs.readFileSync("./storage/emails/resetPassword.mjml", "utf8");
            const htmlOutput = mjml2html(source);
            const template = Handlebars.compile(htmlOutput.html);
            const templateData = {
                firstName,
                url: verificationUrl
            };

            // send verification email
            sendEmail(email, "", "Church MS", "Church MS <noreply@mudiaga.com.ng>",
                "Reset your password", "", template(templateData))

            res.send("Done")
        } else {
            res.send({
                status: 'error',
                message: 'Email not registered. Please create account.'
            })
        }
    }

    const resetPassword = async (req, res) => {
        let resetToken = req?.params?.resetToken;
        let decoded = Buffer.from(resetToken, 'base64').toString('utf8')
        decoded = jwt.verify(decoded, process.env.JWT_SECRET);

        try {
            const filter = {
                email: decoded?.email
            }

            const update = {
                password: bcrypt.hashSync(req.body.password, 10),
            }

            console.log("Update: ", update)

            let user = await User.findOneAndUpdate(filter, update)
            let updatedUser = await User.findOne(filter)

            if (updatedUser) {
                console.log("User: ", updatedUser)
                res.send(
                    {
                        status: "success",
                        msg: "Password reset successful."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Password reset failed. Please try again."
                    }
                )
            }

            // res.send(decoded?.email)
        } catch (err) {
            console.log("Error: ", err)
        }

    }

    const resetPassword2 = async (req, res) => {
        const {email, password } = req.body;
        try {
            const filter = {
                email
            }

            const update = {
                password: bcrypt.hashSync(password, 10),
            }

            console.log("Update: ", update)

            let user = await User.findOneAndUpdate(filter, update)
            let updatedUser = await User.findOne(filter)

            if (updatedUser) {
                console.log("User: ", updatedUser)
                res.send(
                    {
                        status: "success",
                        msg: "Password reset successful."
                    }
                )
            } else {
                res.send(
                    {
                        status: "failed",
                        msg: "Password reset failed. Please try again."
                    }
                )
            }

            // res.send(decoded?.email)
        } catch (err) {
            console.log("Error: ", err)
        }

    }

    const sendEmailOTP  = async (req, res) => {
        try {
            const {email} = req.body;
            const otp = generateOTP(4); //generate 6 digits random number

            // construct verification email
            const source = fs.readFileSync("./storage/emails/emailOTP.mjml", "utf8");
            const htmlOutput = mjml2html(source);
            const template = Handlebars.compile(htmlOutput.html);
            const templateData = {
                otp
            };

            // send verification email
            sendEmail(email, "", "Charis", "Charis <noreply@coinminepro.com>",
                "Charis: One Time Password", "", template(templateData))

            // append the otp to the user object
            const user = await User.findOneAndUpdate({email: email},{emailOTP: otp}, {new: true})
            console.log({user})
            if (!user){
                return res.json({
                    status: "failed",
                    message: "Error attaching OTP to user account"
                })
            }

            // return new user
            res.status(201).json({
                status: "success",
                message: "email send successfully"
            });
        } catch (err) {
            res.json({
                status: "failed",
                message: "Email sending failed. Please try again."
            })
            console.log(err);
        }
    }

    const verifyEmailOTP  = async (req, res) => {
        try {
            const {email, otp} = req.body;

            const user =  await User.findOne({email})
            // console.log({user})
            // console.log("Email OTP: ",user?.emailOTP)
            // console.log("Entered OTP: ",otp)
            // console.log("Is Valid: ", user?.emailOTP === otp)

            if (user?.emailOTP !== otp){
                return res.send({
                    valid: false
                })
            }

            return res.send({
                valid: true
            })

        } catch (err) {
            res.json({
                status: "failed",
                message: "OTP Comparison. Please try again."
            })
            console.log(err);
        }
    }

    return { register, login, verifyUser, resendVerificationLink, forgotPassword, resetPassword, resetPassword2,
    verifyOTP, sendOTP, sendEmailOTP, verifyEmailOTP }
}

module.exports = UserController
