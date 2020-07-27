var mongoose = require("mongoose");

var videonotificationSchema = mongoose.Schema(
  {
    patient_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    hospital_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    caretaker_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    patient_name: {
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
var videonotifications = (module.exports = mongoose.model(
  "videonotifications",
  videonotificationSchema
));
