// Shift Model
const mongoose = require('mongoose');
const { Schema } = mongoose;
const timeSlotSchema = require('./TimeSlot')

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
  wage: {
    type: Number,
    required: true,
    set: (v) => parseFloat(v).toFixed(2) // Ensures 2 decimal places
  },
  // Desired weekly hours, 4-40
  weeklyHours: {
    type: Number,
    required: true,
    validate: {
        validator: (h) => h >= 4 && h <= 40,
        message: (props) => `Please ensure hours are between 4 and 40 hours.`
    }
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'department',
    required: true
  },
  availability: {
    type: [timeSlotSchema],
    // Check that slots do not overlap
    validate: {
        validator: (slots) => {
            const slotsByDay = groupSlotsByDay(slots);
            return checkOverlap(slotsByDay)
        }
    }
  }
});

// Groups slots into respective days
const groupSlotsByDay = (slots) => {
    return slots.reduce((acc, slot) => {
      acc[slot.day] = acc[slot.day] || [];
      acc[slot.day].push(slot);
      return acc;
    }, {});
  };
  
  // Function to check for overlapping slots within each day
  const checkOverlap = (slotsByDay) => {
    for (const day in slotsByDay) {
      const daySlots = slotsByDay[day];
      for (let i = 0; i < daySlots.length; i++) {
        for (let j = i + 1; j < daySlots.length; j++) {
          const slot1 = daySlots[i];
          const slot2 = daySlots[j];
          if (
            (slot1.start_time < slot2.end_time && slot1.end_time > slot2.start_time) ||
            (slot2.start_time < slot1.end_time && slot2.end_time > slot1.start_time)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

const Employee = mongoose.model('employee', employeeSchema);

module.exports = Employee;