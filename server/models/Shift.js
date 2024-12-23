// Shift Model
const mongoose = require('mongoose');
const { Schema } = mongoose;
const timeSlotSchema = require('./TimeSlot')

const shiftSchema = new Schema({
  // Indicates which day of the week 1-7
  timeSlot: {
    type: timeSlotSchema,
    required: true,
  },
  schedule: {
    type: Schema.Types.ObjectId,
    ref: 'schedule'
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'department'
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'employee',
    required: true
  }
}, { timestamps: true });

module.exports = shiftSchema;