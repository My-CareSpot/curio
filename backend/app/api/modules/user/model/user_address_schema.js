var mongoose = require("mongoose");

var userAddressSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    },
    address_id: {
      type: mongoose.Types.ObjectId,
      ref: "address"
    },
    addressType: {
      type: String,
      default: null
    },
    islive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
var roles = (module.exports = mongoose.model("useraddress", userAddressSchema));
