// Shift Model
const mongoose = require('mongoose');
const { Schema } = mongoose;
const timeSlotSchema = require('./TimeSlot')
const StoreHours = require('./StoreHours');
const Employee = require('./Employee');

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
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'employee',
    required: true
  }
});

// Checks if shift is within employee's availability
shiftSchema.pre('save', async function(next) {
  const shiftDay = this.timeSlot.day;
   
  const employee = await Employee.findById(this.employee._id) 
  if (!employee) return next(new Error('Employee not found'));

  // Retrieves all the availability timeslots for that specific employee and puts in the array
  const availabilitySlots = employee.availability.filter(slot => slot.day == shiftDay);
  
  if (availabilitySlots.length > 0) { // If there is a timeslot for that day
    available = availabilitySlots.some(slot => slot.startTime <= this.timeSlot.startTime && slot.endTime >= this.timeSlot.endTime)
    if (!available) {
      return next(new Error('Not within employee\'s availability'))
    }
    next();
  } else return next(new Error('Not within employee\'s availability'))
});

const Shift = mongoose.model('shift', shiftSchema);

module.exports = shiftSchema;