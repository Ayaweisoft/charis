const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    username: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dob: {type: Date, default: new Date() },
    status: { type: String, default: "active" },
    country: { type: String, default: "Nigeria" },
    countryCode: { type: String, default: "NG" },
    phone: { type: String, default: "" },
    occupation: { type: String, default: "" },
    gender: { type: String, default: ""  },
    city: {type: String, default: ""},
    state: {type: String, default: ""},
    lga: {type: String, default: ""},
    zip: {type: String, default: ""},
    address: { type: String, default: ""  },
    accountNumber: { type: String, default: ""  },
    balance: { type: String, default: ""  },
    bank: { type: String, default: ""  },
    joinDate: { type: Date, default: new Date()  },
},{
  collection: 'profile',
  versionKey: false
});

profileSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Profile", profileSchema);
