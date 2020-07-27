var mongoose = require("mongoose");

var careTakerSchema = mongoose.Schema(
  {
    category: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    qualification: {
      type: String,
      default: null
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    },
    registrationNumber: {
      type: String,
      default: null
    },
    rating: {
      type: String,
      default: null
    },
    specialization_id: {
      type: mongoose.Types.ObjectId,
      ref: "specializations"
    }
  },
  {
    timestamps: true
  }
);
var caretakers = (module.exports = mongoose.model(
  "caretakers",
  careTakerSchema
));
