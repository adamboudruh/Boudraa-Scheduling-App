// Shift Model
const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeSlotSchema = new Schema({
    day: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v >= 1 && v <= 7,
        message: (props) => `${props.value} is not a valid day! Day must be between 1 and 7.`
      }
    },
    //HH:MM Format
    startTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format']
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format']
    }
  });

  const TimeSlot = mongoose.model('timeslot', timeSlotSchema);
  
  module.exports = TimeSlot;