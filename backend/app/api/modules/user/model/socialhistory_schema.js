var mongoose = require("mongoose");

var medicalHistorySchema = mongoose.Schema(
  {
    smoking: {
      type: String,
      enum: ["Daily", "Ocassionally", "Never"],
      default: "Never",
    },
    drugs: {
      type: String,
      enum: ["Daily", "Ocassionally", "Never"],
      default: "Never",
    },
    travel: {
      type: String,
      enum: ["Daily", "Ocassionally", "Never"],
      default: "Never",
    },
    alcohol: {
      type: String,
      enum: ["Daily", "Ocassionally", "Never"],
      default: "Never",
    },
    tobaco: {
      type: String,
      enum: ["Daily", "Ocassionally", "Never"],
      default: "Never",
    },
    occupation: {
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
var socialhistories = (module.exports = mongoose.model(
  "socialhistories",
  medicalHistorySchema
));
