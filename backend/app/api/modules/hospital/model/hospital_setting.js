var mongoose = require("mongoose");

var hospitalTimeSettingSchema = mongoose.Schema(
  {
    range: {
      type: String,
      default: null,
    },
    isMorning: {
      type: Boolean,
      default: false,
    },
    morningstarttime: {
      type: Date,
      default: null,
    },
    morningendtime: { type: Date, default: null },
    isAfternoon: {
      type: Boolean,
      default: false,
    },
    afternoonstarttime: {
      type: Date,
      default: null,
    },
    afternoonendtime: { type: Date, default: null },
    isEvening: {
      type: Boolean,
      default: false,
    },
    eveningstarttime: {
      type: Date,
      default: null,
    },
    eveningendtime: { type: Date, default: null },

    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);
var hospitalsettings = (module.exports = mongoose.model(
  "hospitalsettings",
  hospitalTimeSettingSchema
));
