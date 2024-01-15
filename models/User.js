const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    username: { type: String, required: false, },
    type: { type: String, default: "" },
    password: { type: String, default: "" },
    phone: { type: String, required: false, unique: false },
    pin: { type: String, unique: false },
    verified: {type: Boolean, default: false },
    loginToken: { type: String },
    emailOTP: { type: String }
},{
  collection: 'users',
  versionKey: false
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", userSchema);
