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
    }
  },
  {
    timestamps: true
  }
);
var roles = (module.exports = mongoose.model("roles", rolesSchema));
