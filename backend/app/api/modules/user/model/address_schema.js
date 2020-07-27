var mongoose = require("mongoose");

var addressSchema = mongoose.Schema(
  {
    houseNo: {
      type: String,
      default: null
    },
    street: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    zip: {
      type: String,
      default: null
    },
    street2: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);
var roles = (module.exports = mongoose.model("address", addressSchema));
