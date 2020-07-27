var mongoose = require("mongoose");
var SALT_WORK_FACTOR = 10;
var bcrypt = require("bcryptjs");

var userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      default: null,
    },
    hashToken: {
      type: String,
      default: null,
    },
    middleName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    shouldSend: {
      type: Boolean,
      default: true,
    },
    frequency: {
      type: String,
      default: null,
    },
    userType: {     //superadmin,subadmin,hospital,doctor,nurse,therapist,patient
      type: String,
      default: null,
    },
    relatedId:{
      type: mongoose.Types.ObjectId,
      ref: "users",
      default: null,
    },
    deviceToken: {
      type: String,
      default: null,
    },
    address_id: {
      type: String,
      default: null,
    },
    profession: {
      type: String,
      default: null,
    },
    islive: {
      type: Boolean,
      default: true,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    phoneCountry: {
      type: String,
      default: null,
    },
    countryCode: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    previouspassword: {
      type: String,
      default: null,
    },
    image_path: {
      type: String,
      default: null,
    },
    isHobbies: {
      type: Boolean,
      default: false,
    },
    isMedicationNotification: {
      type: Boolean,
      default: true,
    },
    isAssessmentNotification: {
      type: Boolean,
      default: true,
    },
    isAppointmentNotification: {
      type: Boolean,
      default: true,
    },
    isNotificationAble: {
      type: Boolean,
      default: true,
    },
    hospital_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      default: null,
    },
    userLMS_id: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  var users = this;
  if (!users.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(users.password, salt, function (err, hash) {
      if (err) return next(err);
      hashKey = hash;
      users.password = hash;
      next();
    });
  });
});
userSchema.pre("update", function (next) {
  var users = this;
  if (!users.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(users.password, salt, function (err, hash) {
      if (err) return next(err);
      hashKey = hash;
      users.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var users = (module.exports = mongoose.model("users", userSchema));
