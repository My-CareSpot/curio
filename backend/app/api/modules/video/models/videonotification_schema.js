var mongoose = require("mongoose");

var videoNotificationCallSchema = mongoose.Schema(
  {
    patient_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      default: null,
    },
    hospital_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      default: null,
    },
    caretaker_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      default: null,
    },
    patient_name: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    caretaker_name: {
      type: String,
      default: null,
    },
    appointment_time: {
      type: Date,
      default: null,
    },
    appointment_date: {
      type: Date,
      default: null,
    },
    appointment_request_id: {
      type: mongoose.Types.ObjectId,
      ref: "bookings",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
var videorelatednotifications = (module.exports = mongoose.model(
  "videorelatednotifications",
  videoNotificationCallSchema
));
