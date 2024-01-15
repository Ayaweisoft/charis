const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const serviceSchema = new mongoose.Schema({
    church: { type: Schema.Types.ObjectId, ref: "Church" },
    dayOfWeek: { type: String, required: true },
    title: { type: String, default: "" },
    alias: {type: String, default: "" },
    posterURL: [{type: String, default: "" }],
    videoURL: [{type: String, default: "" }],
},{
  collection: 'services',
  versionKey: false
});

serviceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Service", serviceSchema);
