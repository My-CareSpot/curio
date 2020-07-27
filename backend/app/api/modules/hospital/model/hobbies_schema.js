var mongoose = require("mongoose");

var hobbiesSchema = mongoose.Schema(
  {
    category: {
      type: String,
      default: null
    },
    hobby: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      default: null
    },
    islive: {
      type: Boolean,
      default: true
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    }
  },
  {
    timestamps: true
  }
);
var hobbies = (module.exports = mongoose.model("hobbies", hobbiesSchema));
