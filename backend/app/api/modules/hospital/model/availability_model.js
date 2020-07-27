'use strict';

var mongoose = require('mongoose');
var availabilitySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },//specialist id
    //location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'location' },//specialist location id
    fromDateTime: { type: Date },
    toDateTime: { type: Date },
    //specialOfferDate: {type:Date ,default:''},
    //specialOfferDescription: {type:String, default:''},
    available_days: [
        {
            id: 0,
            name: { type: String, default: "Sunday" },
            isChecked: Boolean, default: false,
            arrayOfTimings:[]
        },
        {
            id: 1,
            name: { type: String, default: "Monday" },
            isChecked: Boolean, default: false,
            arrayOfTimings:[]
        },
        {
            id: 2,
            name: { type: String, default: "Tuesday" },
            isChecked: Boolean, default: false,
            arrayOfTimings:[]
        },
        {
            id: 3,
            name: { type: String, default: "Wednesday" },
            isChecked: Boolean, default: false,
            arrayOfTimings:[]
        },
        {
            id: 4,
            name: { type: String, default: "Thursday" },
            isChecked: Boolean, default: false,
            arrayOfTimings:[]
        },
        {
            id: 5,
            name: { type: String, default: "Friday" },
            isChecked: Boolean, default: false,
            arrayOfTimings:[]
        },
        {
            id: 6,
            name: { type: String, default: "Saturday" },
            isChecked: Boolean, default: false,
            arrayOfTimings:[]
        }

    ],
    //availTimeZone: { type: String, default: '' },
    duration: { type: Number, default: 0 }
}, {
        timestamps: true
    });
   var availability = mongoose.model('availability', availabilitySchema);
module.exports = availability//mongoose.model('Availability', availabilitySchema);


