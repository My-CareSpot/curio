var mongoose = require("mongoose");

var hospitalSchema = mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: false
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "users"
    },
    address_id: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "address"
    },
    registerationNumber: {
      type: String,
      default: null
    },
    rating: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    islive: {
      type: Boolean,
      default: true
    },
    hospitalValidFrom: {
      type: String,
      default: null
    },
    hospitalValidTo: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);
var hospitals = (module.exports = mongoose.model("hospitals", hospitalSchema));
