var mongoose = require("mongoose");

var medicationHistorySchema = mongoose.Schema(
  {
    strength: {
      type: String,
      default: null,
    },
    drug: {
      type: String,
      default: null,
    },
    dose: {
      type: String,
      default: null,
    },
    medicationroute: {
      type: String,
      default: null,
    },
    direction: {
      type: String,
      default: null,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
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
  {
    timestamps: true,
  }
);
var medicationhistories = (module.exports = mongoose.model(
  "medicationhistories",
  medicationHistorySchema
));
