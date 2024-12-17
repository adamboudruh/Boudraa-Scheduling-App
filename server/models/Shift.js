// Shift Model
const mongoose = require('mongoose');
const { Schema } = mongoose;

const shiftSchema = new Schema({
  // Indicates which day of the week 1-7
  day: {
    type: Number,
    required: true,
    validate: {
        validator: (d) => d >= 1 && d <= 7,
        message: (props) => `${props.value} is not a valid day! Day must be between 1 and 7.`
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