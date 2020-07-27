var mongoose = require("mongoose");

var dosageSchema = mongoose.Schema(
  {
    medicine_id: {
      type: mongoose.Types.ObjectId,
      ref: "medicines"
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    },
    medicineName: {
      type: String,
      default: null
    },
    frequency: {
      type: String,
      default: null
    },
    details: {
      type: String,
      default: null
    },
    side_effect_detail: {
      type: String,
      default: null
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    consultCareTaker: {
      type: Boolean,
      default: false
    },
    medicineTaken: {
      type: Boolean,
      default: false
    },
    escalated: {
      type: Boolean,
      default: false
    },
    islive: {
      type: Boolean,
      default: false
    },
    escalationLevel: {
      type: String,
      default: null
    },
    bufferTime: {
      type: String,
      default: null
    },
    reminderTime: {
      type: String,
      default: null
    },
    numberOfTimeMissng: {
      type: String,
      default: null
    },
    datetime: {
      type: Date,
      default: null
    },
    morningtime: {
      type: Date,
      default: null
    },
    afternoontime: {
      type: Date,
      default: null
    },
    eveningtime: {
      type: Date,
      default: null
    },
    deviceToken: {
      type: String,
      default: null
    },
    medType: {
      type: String,
      default: null
    },
    startdate: {
      type: Date,
      default: null
    },
    enddate: {
      type: Date,
      default: null
    },
    isMorning: {
      type: Boolean,
      default: null
    },
    isEvening: {
      type: Boolean,
      default: null
    },
    isAfternoon: {
      type: Boolean,
      default: null
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
var dosages = (module.exports = mongoose.model("dosages", dosageSchema));

// DosageId
// FK MedicineID
// DateTime
// Frequency
// Details
// ReminderSent?
// MedicineTaken?
// No.Of Times Missing
// Reason for Missing
// Side Effect details
// Consult caretaker?
// Escalated?
// EscalationLevel
// BufferTime
// Reminder Time
// Validfrom
// Validto
// Islive
