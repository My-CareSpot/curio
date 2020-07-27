var mongoose = require("mongoose");

var playlistpointSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    },
    program_id: {
      type: String,
      default: null
    },
    module_id: {
      type: Number,
      default: null
    },
    module_sequence: {
      type: Number,
      default: null
    },
    point_earned: {
      type: Number,
      default: null
    },    
    total_point: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);
var lmspoints = (module.exports = mongoose.model("lmspoints", playlistpointSchema));
