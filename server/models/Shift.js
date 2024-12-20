// Shift Model
const mongoose = require('mongoose');
const { Schema } = mongoose;
const timeSlotSchema = require('./TimeSlot')
const StoreHours = require('./StoreHours')

const shiftSchema = new Schema({
  // Indicates which day of the week 1-7
  timeSlot: {
    type: timeSlotSchema,
    required: true,
    validate: {
        validator: async function(timeSlot) {
          // Fetch store hours for the given manager and day
          const storeHours = await StoreHours.findOne({ manager: this.manager });
          // If no store hours for that day, then closed
          if (!storeHours) return false;
  
          const hours = storeHours.dayHours.find(dayHour => dayHour.day === timeSlot.day);
          if (!hours) return false;
  
          return timeSlot.startTime >= hours.openTime && timeSlot.endTime <= hours.closeTime;
        },
        message: 'Shift time must be within store hours.'
      }
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
  }
//   validate: {
//     validator: async function(timeSlot) {
//         // Fetch store hours for the given day
//         const storeHours = await StoreHours.findOne({ 'dayHours.day': timeSlot.day });
//         // If no hours for that day, then closed
//         if (!storeHours) return false;

//         const hours = storeHours.dayHours.find(dayHour => dayHour.day === timeSlot.day);
//         if (!hours) return false;

//         return timeSlot.startTime >= hours.openTime && timeSlot.endTime <= hours.closeTime;
//       },
//       message: 'Shift time must be within store hours.'
//     }
});

const Shift = mongoose.model('shift', shiftSchema);

module.exports = shiftSchema;