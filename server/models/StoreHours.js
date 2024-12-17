// StoreHours Model
const mongoose = require('mongoose');
const { Schema } = mongoose;
const timeSlotSchema = require('./TimeSlot')

const storeHoursSchema = new Schema({
    dayHours: [timeSlotSchema],
    // Check if there are exactly 7 hours slots and no repeats
    validate: {
      validator: (dayHours) => {
        if (dayHours.length !== 7) return false;
        const days = dayHours.map(d => d.day);
        return new Set(days).size === days.length;
      },
      message: 'dayHours must contain exactly 7 unique days.'
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  });

const StoreHours = mongoose.model('storehours', storeHoursSchema);

module.exports = StoreHours;