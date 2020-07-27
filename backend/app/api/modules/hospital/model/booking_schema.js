var mongoose = require("mongoose");

var bookingSchema = mongoose.Schema(
  {
    appointment_date: {
      type: Date,
      default: null,
    },
    appointment_request_id: {
      type: mongoose.Types.ObjectId,
      ref: "appointmentrequests",
    },
    appointment_time: {
      type: Date,
      default: null,
    },
    caretaker_id: {
      type: mongoose.Types.ObjectId,
      ref: "caretakers",
    },
    hospital_id: {
      type: mongoose.Types.ObjectId,
      ref: "hospitals",
    },
    caretaker_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    hospital_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    patient_user_id: {
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
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    cancelled_reason: {
      type: String,
      default: null,
    },
    appointment_end_time: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
var bookings = (module.exports = mongoose.model("bookings", bookingSchema));
