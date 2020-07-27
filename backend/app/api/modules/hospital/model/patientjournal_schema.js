'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PatientJournalSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  journal_id: {
    type: Schema.Types.ObjectId,
    ref: 'journallists',
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

var patientjournal = mongoose.model('patientjournals', PatientJournalSchema);
module.exports = patientjournal;