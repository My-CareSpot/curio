var mongoose = require("mongoose");

var adobeSchema = mongoose.Schema(
  {
    refresh_token: {
      type: String,
      required: false,
      default: null
    },
    access_token: {
      type: String,
      required: false,
      default: null
    },
    created: {
      type: Date,
      required: true,
      default: Date.now
    },
    user_role: {
      type: String,
      required: false,
      default: null
    },
    account_id: {
      type: Number,
      required: false,
      default: null
    },
    user_id: {
      type: Number,
      required: false,
      default: null
    },
    expiresIn:{
      type: Number,
      required: false,
      default: null
    }
  },

  {
    timestamps: true
  }
);
var adobes = (module.exports = mongoose.model("adobes", adobeSchema));
