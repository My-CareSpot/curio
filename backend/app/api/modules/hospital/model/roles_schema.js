var mongoose = require("mongoose");

var rolesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false
    },
    status: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    hospital_id: {
      type: mongoose.Types.ObjectId,
      ref: "hospitals"
    }
  },
  {
    timestamps: true
  }
);
var roles = (module.exports = mongoose.model("roles", rolesSchema));
