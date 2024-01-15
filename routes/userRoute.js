const express = require('express');
const userRouter = express.Router();
const UserController = require("../controller/UserController")();

userRouter.route('/register')
    .post(UserController.register)

userRouter.route('/login')
    .post(UserController.login)

userRouter.route('/send-otp')
    .post(UserController.sendOTP)

userRouter.route('/verify-otp')
    .post(UserController.verifyOTP)

userRouter.route('/send-email-otp')
    .post(UserController.sendEmailOTP)

userRouter.route('/verify-email-otp')
    .post(UserController.verifyEmailOTP)

userRouter.route('/email/verify/:verifyToken')
    .get(UserController.verifyUser)

userRouter.route('/auth/email/verify/resend')
    .post(UserController.resendVerificationLink)

userRouter.route('/email/forgotpassword')
    .post(UserController.forgotPassword)

// userRouter.get('/email/reset/:resetToken', (req, res) => {
//     let resetToken = req?.params?.resetToken;
//     res.send("At verification page.")
// })

userRouter.route('/email/reset/:resetToken')
    .post(UserController.resetPassword)

userRouter.route('/email/password-reset')
    .post(UserController.resetPassword2)

userRouter.get('/logout',async (req, res) => {
    let filter = {email: req?.params?.email}
    let update = { loginToken: null }
    let user = await User.findOneAndUpdate(filter, update)

    if (user){
        res.send({
            status: "success",
            msg: "Logged out successfully"
        })
    }
    else{
        res.send ({
            status: "404 error",
            msg: "User not found"
        })
    }

})

module.exports = userRouter;
