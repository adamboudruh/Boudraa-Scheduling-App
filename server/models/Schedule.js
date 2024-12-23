// Schedule Model
const mongoose = require('mongoose');
const { Schema } = mongoose;
const shiftSchema = require('./Shift');

const scheduleSchema = new Schema({
  weekOf: {
    type: Date,
    required: true
  },
  shifts: [shiftSchema],
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

scheduleSchema.pre('save', async function(next) {
  // To run before the shifts array is modified. Before a shift is added, needs to be validated in 2 ways:
  // access incoming timeslot somehow


    // Is within the employee's availability
  const storeHours = await StoreHours.findOne({ manager: this.manager });
  if (!storeHours) return false;
  const hours = storeHours.dayHours.find(dayHour => dayHour.day === timeSlot.day);
    // That the employee does not already have a shift on that day
});

shiftSchema.pre('save', async function(next) {
  const shiftDay = this.timeSlot.day;
   
  const employee = await Employee.findById(this.employee._id);
  console.log("Adding shift for: "+employee.firstName);
  if (!employee) return next(new Error('Employee not found'));

  // Retrieves all the availability timeslots for that specific employee and puts in the array
  const availabilitySlots = employee.availability.filter(slot => slot.day == shiftDay);
  console.log(employee.firstName+"'s availability on this day is: "+availabilitySlots);
  
  if (availabilitySlots.length > 0) { // If there is a timeslot for that day
    available = availabilitySlots.some(slot => slot.startTime <= this.timeSlot.startTime && slot.endTime >= this.timeSlot.endTime);

    if (!available) {
      return next(new Error('Not within employee\'s availability'))
    }
    next();
  } else return next(new Error('Not within employee\'s availability'))
});

const Schedule = mongoose.model('schedule', scheduleSchema);

module.exports = Schedule;