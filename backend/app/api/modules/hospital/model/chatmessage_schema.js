var mongoose = require("mongoose");

var chatmessageschema = mongoose.Schema(
    {
        room_id: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        },
        message: {            
            type: [{
                data:{type:String}
                // _id: { type: mongoose.Types.ObjectId },
                // createdAt: { type: Date, default: Date.now },
                // text: { type: String },
                // image:{ type: String },
                // imageType:{type: String}, //1-image 2-pdf 3-rest
                // imageName:{type: String},
                // user:{
                //     _id:{type:Number},
                //     name:{type:String},
                //     avatar:{type:String}
                // }
            }],
            required: false,
            default: null
        },
        status: {
            type: Boolean,
            required: false,
            default: false
        },
    },

    {
        timestamps: true
    }
);
var chatmessages = (module.exports = mongoose.model("chatmessages", chatmessageschema));
