const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const devotionalSchema = new mongoose.Schema({
    date: { type: Date},
    title: { type: String, default: null },
    author: { type: String },
    textContent: { type: String, unique: false },
    prayers: { type: String },
    keyVerses: { type: String },
    audioUrl: { type: String },
    videoUrl: { type: String },
},{
  collection: 'devotionals',
  versionKey: false
});

devotionalSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Devotional", devotionalSchema);
