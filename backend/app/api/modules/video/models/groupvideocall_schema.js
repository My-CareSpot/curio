var mongoose = require("mongoose");

var groupvideocallSchema = mongoose.Schema(
  {
    patient_user_ids: {
      type: [mongoose.Types.ObjectId],
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
    caretaker_name: {
      type: String,
      default: null,
    },
    hash_token: {
      type: String,
      default: null,
    },
    videocall_token: {
      type: String,
      default: null,
    },
    session_name: {
      type: String,
      default: null,
    },
    session_time: {
      type: Date,
      default: null,
    },
    session_date: {
      type: Date,
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
var groupvideocalls = (module.exports = mongoose.model(
  "groupvideocalls",
  groupvideocallSchema
));
