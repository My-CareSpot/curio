var mongoose = require("mongoose");

var videoTokenSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    username: {
      type: String,
      default: null,
    },
    appointment_id: {
      type: mongoose.Types.ObjectId,
      ref: "bookings",
    },
    token: {
      type: String,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
var videotokens = (module.exports = mongoose.model(
  "videotokens",
  videoTokenSchema
));
