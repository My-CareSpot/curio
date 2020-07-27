var mongoose = require("mongoose");

var careTakerSpecializationSchema = mongoose.Schema(
  {
    islive: {
      type: Boolean,
      default: true
    },
    caretaker_id: {
      type: mongoose.Types.ObjectId,
      ref: "caretakers"
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
var caretakerspecializations = (module.exports = mongoose.model(
  "caretakerspecializations",
  careTakerSpecializationSchema
));
