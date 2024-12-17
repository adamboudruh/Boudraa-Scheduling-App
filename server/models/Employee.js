// Shift Model
const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
  // Indicates which day of the week 1-7
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  // Desired weekly hours, 8-40
  weeklyHours: {
    type: Number,
    required: true,
    validate: {
        validator: (h) => h >= 1 && h <= 7,
        message: (props) => `Please ensure hours are between 4 and 40 hours.`
    }
  },
  schedule: {
    type: Schema.Types.ObjectId,
    ref: 'schedule'
  },
  // HH:MM format
  startTime: {
    type: String,
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format']
  },
  endTime: {
    type: Date,
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format']
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'employee',
    required: true
  }
});

const Shift = mongoose.model('shift', shiftSchema);

module.exports = Shift;