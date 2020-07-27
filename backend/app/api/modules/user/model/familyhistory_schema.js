var mongoose = require("mongoose");

var familyHistorySchema = mongoose.Schema(
  {
    diagnosis: {
      type: String,
      default: null,
    },
    ageofdiagnose: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    relationship: {
      type: String,
      default: null,
    },
    dateofbirth: {
      type: Date,
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
var familyhistories = (module.exports = mongoose.model(
  "familyhistories",
  familyHistorySchema
));
