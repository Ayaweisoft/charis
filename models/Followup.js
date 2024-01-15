const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const followupSchema = new mongoose.Schema({
    date: { type: String},
    church: { type: Schema.Types.ObjectId, ref: "Church" },
    teamLead: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, default: "" },
    count: { type: Number, default: 0 },
    comments: { type: String, default: 0 },
},{
  collection: 'followup_evangelism',
  versionKey: false
});

followupSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Followup", followupSchema);
