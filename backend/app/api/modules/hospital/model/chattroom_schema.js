var mongoose = require("mongoose");

var chatroomschema = mongoose.Schema(
    {
        user1_id: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        },
        user2_id: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        },
        user1_name: {
            type: String,
            required: false,
            default: null
        },
        user2_name: {
            type: String,
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
var chatrooms = (module.exports = mongoose.model("chatrooms", chatroomschema));
