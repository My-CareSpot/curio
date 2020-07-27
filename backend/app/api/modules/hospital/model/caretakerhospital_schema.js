var mongoose = require("mongoose");

var careTakerHospitalSchema = mongoose.Schema(
  {
    caretaker_id: {
      type: mongoose.Types.ObjectId,
      ref: "caretakers",
    },
    available: {
      type: Boolean,
      default: true,
    },
    islive: {
      type: Boolean,
      default: true,
    },
    hospital_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);
var caretakerhospitals = (module.exports = mongoose.model(
  "caretakerhospitals",
  careTakerHospitalSchema
));
