'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AssessmentListSchema = new mongoose.Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: [true, 'User Id is required'],
    },
    fromDate: {
        type: Date,
        default: new Date(),
        required: [true, 'fromDate is required']
    },
    toDate: {
        type: Date,
        default: new Date(),
        required: [true, 'toDate is required']
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: null,
        
    },
    assessment_type:{
        type:String,
        default:null
    }

}, {
    timestamps: true
}) 

var AssessmentListModel = mongoose.model('assessmentlists',AssessmentListSchema);
module.exports = AssessmentListModel;