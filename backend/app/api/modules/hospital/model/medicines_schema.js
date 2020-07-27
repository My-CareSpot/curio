var mongoose = require("mongoose");

var medicinesSchema = mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: false
    },
    code: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: false
    },
    company: {
      type: String,
      required: false
    },
    islive: {
      type: Boolean,
      default: true
    },
    specialNote: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);
var medicines = (module.exports = mongoose.model("medicines", medicinesSchema));
