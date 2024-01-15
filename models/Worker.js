const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const transactionSchema = new mongoose.Schema({
    // church: { type: Schema.Types.ObjectId, ref: "Church" },
    Department: { type: Schema.Types.ObjectId, ref: "Department" },
    Group: { type: Schema.Types.ObjectId, ref: "Church" },
    user: { type: Schema.Types.ObjectId, ref: "Church" },
    isPastor: { type: Boolean, default: false },
    isHeadPastor: { type: Boolean, default: false },
    isDepartmentHead: { type: Boolean, default: false },
    isGroupHead: { type: Boolean, default: false },
},{
  collection: 'workers',
  versionKey: false
});

transactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Profile", transactionSchema);
