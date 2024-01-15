const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const learningSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: false },
    program: {type: String, default: "" },
    church: { type: String, default: "" },
    phone: { type: String, default: "" },
    occupation: { type: String, default: "" },
    gender: { type: String, default: ""  },
},{
  collection: 'learning',
  versionKey: false
});

learningSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Learning", learningSchema);
