var mongoose = require("mongoose");

var sideEffectSchema = mongoose.Schema(
  {
    sideeffect: {
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
var sideeffects = (module.exports = mongoose.model(
  "sideeffects",
  sideEffectSchema
));
