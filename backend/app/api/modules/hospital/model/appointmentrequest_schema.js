var mongoose = require("mongoose");

var appointmentRequestSchema = mongoose.Schema(
  {
    patient_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    caretaker_id: {
      type: mongoose.Types.ObjectId,
      ref: "caretakers",
    },
    appointment_time: {
      type: Date,
      default: null,
    },
    appointment_end_time: {
      type: Date,
      default: null,
    },
    appointment_date: {
      type: Date,
      default: null,
    },
    islive: {
      type: Boolean,
      default: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      default: null,
    },
    isNote: {
      type: Boolean,
      default: false,
    },
    sessionType: {
      type: String,
      enum: ["onetoone", "groupsession", "normal"],
      default: "normal",
    },
    isMorning: {
      type: Boolean,
      default: false,
    },
    isEvening: {
      type: Boolean,
      default: false,
    },
    isAfternoon: {
      type: Boolean,
      default: false,
    },
    morningstarttime: {
      type: Date,
      default: null,
    },
    morningendtime: {
      type: Date,
      default: null,
    },
    afternoonstarttime: {
      type: Date,
      default: null,
    },
    afternoonendtime: {
      type: Date,
      default: null,
    },
    eveningstarttime: {
      type: Date,
      default: null,
    },
    eveningendtime: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
var appointmentrequests = (module.exports = mongoose.model(
  "appointmentrequests",
  appointmentRequestSchema
));
