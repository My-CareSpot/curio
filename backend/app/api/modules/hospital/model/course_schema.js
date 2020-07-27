var mongoose = require("mongoose");

var courseSchema = mongoose.Schema(
        {   program_id : {
            type: String,
            required: false,
            default: null
        },
        course_id: {
            type: Number,
            required: false,
            default: null
        },
        course_title: {
            type: String,
            required: false,
            default: null
        },
        course_description: {
            type: String,
            required: false,
            default: null
        },
        course_type: {
            type: String,
            required: false,
            default: null
        },
        module_id: {
            type: Number,
            required: false,
            default: null
        },

        module_type: {
            type: String,
            required: false,
            default: null
        },
        module_sequence: {
            type: Number,
            required: false,
            default: null
        }

    },

    {
        timestamps: true
    }
);
var courses = (module.exports = mongoose.model("courses", courseSchema));
