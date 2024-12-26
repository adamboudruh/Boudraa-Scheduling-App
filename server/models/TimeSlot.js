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

  // Returns the amount of hours that the slot spans
  // Good for calculating shift lengths and weekly hours
  timeSlotSchema.virtual('duration').get( function() {
    console.log(this.startTime);
    const begin = new Date(`2000-01-01T${this.startTime}:00.000Z`);
    const end = new Date(`2000-01-01T${this.endTime}:00.000Z`);
    console.log(begin);
    duration = (end - begin) / (1000*60*60);
    console.log(duration)
    return ( duration ) // Converts milliseconds to hours
  });

  

  // const TimeSlot = mongoose.model('timeslot', timeSlotSchema);
  
  module.exports = timeSlotSchema;