const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const ministrySchema = new mongoose.Schema({
    name: { type: String, default: ""},
    alias: { type: String, default: "active" },
    incorporationDate: { type: Date, default: new Date() },
    motto: { type: String, default: ""},
    email: { type: String, default: ""},
},{
  collection: 'ministry',
  versionKey: false
});

ministrySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Ministry", ministrySchema);
