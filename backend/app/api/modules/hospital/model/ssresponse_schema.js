var mongoose = require("mongoose");

var responseSchema = mongoose.Schema(
  {
    responses_id: {
      type: [mongoose.Types.ObjectId],
      default: null
    },
    date: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    program_id: {
      type: mongoose.Types.ObjectId,
      ref: "programs"
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    },
    mood: {
      type:Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);
var responses = (module.exports = mongoose.model("responses", responseSchema));
