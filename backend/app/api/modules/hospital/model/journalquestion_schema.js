'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SurveyQuestionSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'User Id is required'],
  },
  journal_id: {
    type: Schema.Types.ObjectId,
    ref: 'journallists',
    required: [false, 'Journal Id is required'],
  },
  typeOfjournal: {
    type: String,
    default: null
  },
  convertedUrl: {
    type: String,
    default: null
  },
  imgName: {
    type: String,
    default: null
  },
  journalType: { type: String, enum: ['text', 'textarea', 'radio', 'checkbox'] },
  question: { type: String, default: null, required: [false, 'question is required'] },
  options: [
    {
      optionValue: {
        type: String,
        default: null,
        isDeleted: false,
      },
      optionPoint: {
        type: Number,

      }
    }
  ],
  isDeleted: { type: Boolean, default: false, required: false },
}, {
  timestamps: true
})

var surveyQuestions = mongoose.model('journalquestionlists', SurveyQuestionSchema);
module.exports = surveyQuestions;