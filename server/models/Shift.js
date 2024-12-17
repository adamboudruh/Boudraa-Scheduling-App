// Shift Model
const mongoose = require('mongoose');
const { Schema } = mongoose;
const timeSlotSchema = require('./TimeSlot')

const shiftSchema = new Schema({
  // Indicates which day of the week 1-7
  timeSlot: {
    type: timeSlotSchema,
    required: true
  },
  schedule: {
    type: Schema.Types.ObjectId,
    ref: 'schedule'
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'employee',
    required: true
  }
});

const Shift = mongoose.model('shift', shiftSchema);

module.exports = Shift;