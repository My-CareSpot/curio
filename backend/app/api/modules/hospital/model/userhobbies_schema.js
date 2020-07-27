var mongoose = require("mongoose");

var userHobbieSchema = mongoose.Schema(
  {
    hobbyname: {
      type: String,
      default: null
    },
    hobby_id: {
      type: mongoose.Types.ObjectId,
      ref: "hobbies"
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
var userhobbies = (module.exports = mongoose.model(
  "userhobbies",
  userHobbieSchema
));
