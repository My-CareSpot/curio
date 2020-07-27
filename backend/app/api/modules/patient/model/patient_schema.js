var mongoose = require("mongoose");

var patientSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    },
    program_id: {
      type: String,
      default: null
    },
    caretaker_id: {
      type: [mongoose.Types.ObjectId],
      ref: "caretakers"
    },
    dosage_id: {
      type: [mongoose.Types.ObjectId],
      ref: "dosages"
    },
    assessment_id: {
      type: [mongoose.Types.ObjectId],
      ref: "assessmentlists",
      default: null
    },
    journal_id: {
      type: [mongoose.Types.ObjectId],
      ref: "journallists",
      default: null
    },
    insurance_id: {
      type: String,
      default: null
    },
    pharmacy_id: {
      type: String,
      default: null
    },
    lab_id: {
      type: String,
      default: null
    },
    islive: {
      type: Boolean,
      default: true
    },
    hospital_id: {
      type: mongoose.Types.ObjectId,
      ref: "hospitals"
    },
    hobby_id: {
      type: mongoose.Types.ObjectId,
      ref: "hobbies"
    },
    notes: {
      type: String,
      default: null
    },
    lmsprogram_enrollment_id:{
      type:String,
      default:null
    }
  },
  {
    timestamps: true
  }
);
var patients = (module.exports = mongoose.model("patients", patientSchema));
