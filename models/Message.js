const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const messageSchema = new mongoose.Schema({
    date: { type: Date},
    title: { type: String, default: null },
    author: { type: String },
    textContent: { type: String, unique: false },
    prayers: { type: String },
    keyVerses: { type: String },
    audioUrl: { type: String },
    videoUrl: { type: String },
},{
  collection: 'messages',
  versionKey: false
});

messageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Message", messageSchema);
