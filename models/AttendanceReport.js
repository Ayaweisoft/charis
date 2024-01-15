const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, ref: "User" },
  church: { type: Schema.Types.ObjectId, ref: "Church" },
  service: { type: Schema.Types.ObjectId, ref: "Service" },
  children: { type: Number, default: 0 },
  childrenMale: { type: Number, default: 0 },
  childrenFemale: { type: Number, default: 0 },
  adults: { type: Number, default: 0 },
  adultsMale: { type: Number, default: 0 },
  adultsFemale: { type: Number, default: 0 },
  youths: { type: Number, default: 0 },
  youthsMale: { type: Number, default: 0 },
  youthsFemale: { type: Number, default: 0 },
},{
  collection: 'attendances',
  versionKey: false
});

module.exports = mongoose.model("Attendance", attendanceSchema);
