// Schedule Model
const mongoose = require('mongoose');
const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

const Department = mongoose.model('department', departmentSchema);

module.exports = Department;