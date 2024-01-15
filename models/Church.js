const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const churchSchema = new mongoose.Schema({
    Ministry: { type: Schema.Types.ObjectId, ref: "Ministry" },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, unique: true },
    address: {type: Date, default: new Date() },
    name: { type: String, default: "user"},
    alias: { type: String, default: "active" },
    isHeadQuarter: { type: String, default: "Nigeria" },
    incorporationDate: { type: String, default: "NG" },
    worshipTable: { type: String, default: "" },
},{
  collection: 'church',
  versionKey: false
});

churchSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Church", churchSchema);
