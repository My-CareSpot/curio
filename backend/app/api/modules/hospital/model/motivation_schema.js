var mongoose = require("mongoose");

var motivationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      default: null,
    },
    motivation: {
      type: String,
      default: null,
    },
    patient_ids: {
      type: [mongoose.Types.ObjectId],
      ref: "users",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    caretaker_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
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
var sideeffects = (module.exports = mongoose.model(
  "motivations",
  motivationSchema
));
