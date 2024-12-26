const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

const Role = mongoose.model('role', roleSchema);

module.exports = Role;