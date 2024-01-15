const express = require('express');
const adminRouter = express.Router();
const AdminController = require("../controller/AdminController")();

adminRouter.route('/all-users/:page/:perPage/')
    .get(AdminController.allUsers)

adminRouter.route('/user/:email')
    .get(AdminController.selectUserByEmail)

adminRouter.route('/user-by-id/:id')
    .get(AdminController.selectUserById)

adminRouter.route('/delete-user')
    .post(AdminController.deleteUser)

adminRouter.route('/edit-user')
    .post(AdminController.editUser)

module.exports = adminRouter;
