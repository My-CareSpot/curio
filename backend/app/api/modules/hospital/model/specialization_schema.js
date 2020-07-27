var mongoose = require("mongoose");

var specializationSchema = mongoose.Schema(
  {
    specialization: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    islive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);
var hobbies = (module.exports = mongoose.model(
  "specializations",
  specializationSchema
));
