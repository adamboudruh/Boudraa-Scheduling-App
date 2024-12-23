// StoreHours Model
const mongoose = require('mongoose');
const { Schema } = mongoose;
const timeSlotSchema = require('./TimeSlot')

const storeHoursSchema = new Schema({
    dayHours: {
      type: [timeSlotSchema],
      validate: {
        validator: (dayHours) => {
          if (dayHours.length > 7 || dayHours.length < 0) return false;
          const days = dayHours.map(d => d.day);
          return new Set(days).size === days.length;
        },
        message: 'dayHours must contain exactly 7 unique days.'
    }
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
  });

  // Each user can only have one StoreHours object
storeHoursSchema.pre('save', async function(next) {
    const err = new Error('error saving store hours');
    const storeHours = this;
    const existingStoreHours = await StoreHours.findOne({ manager: storeHours.manager });
    if (existingStoreHours && existingStoreHours._id.toString() !== storeHours._id.toString()) {
      // Replace the existing document
      await StoreHours.deleteOne({ _id: existingStoreHours._id });
    }
    next();
  });

const StoreHours = mongoose.model('storehours', storeHoursSchema);

module.exports = StoreHours;