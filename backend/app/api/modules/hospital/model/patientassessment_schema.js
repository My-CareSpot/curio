'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PatientAssessmentSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  assessment_id: {
    type: Schema.Types.ObjectId,
    ref: 'assessmentlists',
    required: false,
  },
  question_id: {
    type: Schema.Types.ObjectId,
    ref: 'questionlists',
    required: false,
  },
  textAns: {
    type: String,
    required: false,
    default: null
  },
  totalPointEarned: {
    type: Number,
    default: null,    
    required: false,
  },
  options: [
    {
      optionValue: {
        type: String,
        default: null,
        isDeleted: false,
      },
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'questionlists.options',
        required: false,
        default: null
      },
      optionPoint: {
        type: Number,
        default: null,
        isDeleted: false,
      }
    }
  ],
}, {
  timestamps: true
})

var patientassessment = mongoose.model('patientassessments', PatientAssessmentSchema);
module.exports = patientassessment;