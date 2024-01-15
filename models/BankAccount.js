const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const accountSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    currency: { type: String, required: true },
    bank: { type: String, default: "" },
    accountNumber: {type: Number },
    accountName: {type: Number },
    accountType: { type: String, default: ""},
    status: { type: String, default: "active"},
    balance: { type: Number, default: 0 },
},{
  collection: 'accounts',
  versionKey: false
});

accountSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Account", accountSchema);
