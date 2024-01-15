const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const eventSchema = new mongoose.Schema({
    church: { type: Schema.Types.ObjectId, ref: "Church" },
    date: { type: Date, default: new Date() },
    title: { type: String, default: "" },
    alias: {type: String, default: "" },
    posterURL: [{type: String, default: "" }],
    videoURL: [{type: String, default: "" }],
},{
  collection: 'events',
  versionKey: false
});

eventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Event", eventSchema);
