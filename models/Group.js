const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const groupSchema = new mongoose.Schema({
    church: { type: Schema.Types.ObjectId, ref: "Church" },
    name: { type: String },
    head: { type: Schema.Types.ObjectId, ref: "User" },
    alias: { type: String, default: null },
},{
  collection: 'groups',
  versionKey: false
});

groupSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Group", groupSchema);
