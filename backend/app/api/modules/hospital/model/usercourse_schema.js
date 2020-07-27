var mongoose = require("mongoose");

var usercourseSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref:"users"
        },
        program_id:{
            type: String,
            required: false,
            default: null
        },      
        
        course_id:{
            type: Number,
            required: false,
            default: null
        },
        module_id: {
            type: Number,
            required: false,
            default: null
        },
        module_sequence: {
            type: Number,
            required: false,
            default: null
        },
        module_start:{
            type:Date,
            required:false,
            default:Date.now
        },
        course_status:{
            type:Boolean,
            required:false,
            default:false
        },
        course_title:{
            type:String,
            required:false,
            default:false
        }

    },

    {
        timestamps: true
    }
);
var usercourses = (module.exports = mongoose.model("usercourses", usercourseSchema));
