var mongoose = require("mongoose");

var symptomsSchema = mongoose.Schema(
  {
    symptom: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    priority: {
      type: String,
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

    program_id: {
      type: mongoose.Types.ObjectId,
      ref: "programs",
    },
  },
  {
    timestamps: true,
  }
);
var symptoms = (module.exports = mongoose.model("symptoms", symptomsSchema));
