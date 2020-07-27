var mongoose = require("mongoose");

var medicalHistorySchema = mongoose.Schema(
  {
    diagnosis: {
      type: String,
      default: null,
    },
    ageofdiagnose: {
      type: String,
      default: null,
    },
    allergies: {
      type: String,
      default: null,
    },
    note: {
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
var medicalhistories = (module.exports = mongoose.model(
  "medicalhistories",
  medicalHistorySchema
));
