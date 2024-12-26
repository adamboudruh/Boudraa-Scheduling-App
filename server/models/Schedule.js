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

const Schedule = mongoose.model('schedule', scheduleSchema);

module.exports = Schedule;