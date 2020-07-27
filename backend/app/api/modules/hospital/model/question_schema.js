'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuestionSchema = new mongoose.Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: [true, 'User Id is required'],
    },
    assessment_id: {
		type: Schema.Types.ObjectId,
		ref: 'assessmentlists',
		required: [false, 'Assessment Id is required'],
    },
    typeOfAssessment: {
      type: String,
      default:null
      },
    assessmentType : {type:String,enum:['text','textarea','radio','checkbox']},
    question: {type: String, default: null ,  required: [false, 'question is required']},
    options: [
        {
            optionValue : {
                            type: String,
                            default: null,
                            isDeleted: false,
                         },
            optionPoint : {
                            type: Number,
                            
                          }
        }
    ],
    isDeleted: {type: Boolean, default: false , required: false},
}, {
    timestamps: true
}) 

var questions = mongoose.model('questionlists',QuestionSchema);
module.exports = questions;