var mongoose = require("mongoose");

var immunizationSchema = mongoose.Schema(
  {
    vaccine: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
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
var immunizationhistories = (module.exports = mongoose.model(
  "immunizationhistories",
  immunizationSchema
));
