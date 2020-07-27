var mongoose = require("mongoose");

var programSchema = mongoose.Schema(
  {
    programname: {
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
    connected_user_id: {
      type: [mongoose.Types.ObjectId],
      ref: "users",
    },
    journal_assigned_ids: {
      type: [mongoose.Types.ObjectId],
      ref: "journallists",
    },
    symptoms_id: {
      type: [mongoose.Types.ObjectId],
      ref: "symptoms",
    },
    sideeffect_id: {
      type: [mongoose.Types.ObjectId],
      ref: "sideeffects",
    },
    hospital_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    }, 
    lmsprogram_id: {
      type: String,
      default:null
    },   
    lmsinstance_id: {
      type: String,
      default:null
    },   
    
    date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
var programs = (module.exports = mongoose.model("programs", programSchema));
