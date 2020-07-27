var mongoose = require("mongoose");

var notificationSchema = mongoose.Schema(
  {
    message: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    },
    isRead: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);
var notifications = (module.exports = mongoose.model(
  "notifications",
  notificationSchema
));
