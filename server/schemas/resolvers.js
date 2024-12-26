// Import models and tokens (authenticate)
const { Department, Employee, Schedule, StoreHours, User, Role } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

const { signToken } = require('../utils/auth');
// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const { GraphQLScalarType, Kind } = require('graphql');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom Date scalar type',
  // Converts outgoing Date to ISOString
  serialize(value) {
    if (value instanceof Date) return value.toISOString();
    else return null;
  },
  parseValue(value) {
    // Convert incoming ISOString to Date
    return new Date(value);
  },
  parseLiteral(ast) {
    // Convert hard-coded AST string to Date
    return ast.kind === Kind.STRING ? new Date(ast.value) : null;
  },
})

const availabilityError = new Error('Employee not available in the provided timeSlot');
const invalidSlot = new Error('Invalid timeSlot');
const shiftOverlap = new Error('Employee cannot work more than one shift per day');

// Create custom resolvers for front-end display
const resolvers = {
  Date: dateScalar,
  Query: {
    users: async () => {
      try { 
        return await User.find() 
      }
      catch (error) { 
        throw new Error('Error fetching users') 
      };
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id)
        return user;
      }
      else throw new AuthenticationError('Please log in to view that info');
    },
    userById: async (parent, { userId }) => {
      try {
        console.log(userId);
        user = await User.findById(userId);
        return user;
      } catch (error) {
        throw new Error('Error fetching departments');
      }
    },
    departments: async (parent, { userId }) => {
      try {
        return await Department.find({ manager: userId });
      } catch (error) {
        throw new Error('Error fetching departments');
      }
    },
    department: async (parent, { id }) => {
      try {
        console.log()
        return await Department.findById(id).populate('manager');
      } catch (error) {
        throw new Error('Error fetching department');
      }
    },
    employees: async (parent, { userId }) => {
      try {
        employees = await Employee.find({ manager: userId });
        console.log(employees);
        return await Employee.find({ manager: userId }).populate('role');
      } catch (error) {
        throw new Error('Error fetching employees: '+error.message);
      }
    },
    employee: async (parent, { id }) => {
      try {
        return await Employee.findById(id).populate('role').populate('availability');
      } catch (error) {
        throw new Error('Error fetching employee');
      }
    },
    roles: async (parent, { userId }) => {
      try {
        return await Role.find({ manager: userId });
      } catch (error) {
        throw new Error('Error fetching roles');
      }
    },
    role: async (parent, { id }) => {
      try {
        return await Role.findById(id);
      } catch (error) {
        throw new Error('Error fetching role');
      }
    },
    schedules: async (parent, { userId }) => {
      try {
        return await Schedule.find({ manager: userId }).populate('shifts');
      } catch (error) {
        throw new Error('Error fetching schedules: '+error.message);
      }
    },
    schedule: async (parent, { id }) => {
      try {
        return await Schedule.findById(id).populate({
          path: 'shifts',
          populate: {
            path: 'employee',
            model: 'employee'
          }
        });;
      } catch (error) {
        throw new Error('Error fetching schedule: '+error.message);
      }
    },
    storeHours: async (parent, { userId }) => {
      try {
        storeHours = await StoreHours.findOne({ manager: userId }).populate('dayHours').populate('manager');
        return storeHours;
      } catch (error) {
        throw new Error('Error fetching store hours: '+error.message);
      }
    }
  },

  User: {
    schedules: async (parent) => {
      try { return await Schedule.find({ manager: parent._id }).populate({
        path: 'shifts',
        populate: {
          path: 'employee',
          model: 'employee'
        }
      }); }
      catch (error) { throw new Error('Error fetching schedules: '+error.message); }
    },
    storeHours: async (parent) => {
      try { return await StoreHours.findOne({ manager: parent._id }); }
      catch (error) { throw new Error('Error fetching stpre hours'); }
    },
    roles: async (parent) => {
      try { return await Role.find({ manager: parent._id }); }
      catch (error) { throw new Error('Error fetching roles'); }
    },
    departments: async (parent) => {
      try { return await Department.find({ manager: parent._id }); }
      catch (error) { throw new Error('Error fetching departments'); }
    },
    employees: async (parent) => {
      try { 
        employees = await Employee.find({ manager: parent._id }).populate('role');
        console.log(employees);
        return employees }
      catch (error) { throw new Error('Error fetching employees: '+error.message); }
    }
  },

  Mutation: {
    // Works
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },

    // Works
    addDepartment: async (parent, { name, manager }) => {
      try {
        return await Department.create({ name, manager });
      }
      catch (error) {
        throw new Error('Error adding department: ' , error.message);
      }
    },

    // Works
    deleteDepartment: async (parent, { _id }) => {
      try {
        return await Department.findOneAndDelete({ _id });
      }
      catch (error) {
        throw new Error('Error adding department ' + error.message);
      }
    },

    // Works
    addEmployee: async (parent, { firstName, lastName, wage, desiredHours, role, availability, manager }) => {
      try {
        console.log("Adding employee...");
        for (slot in availability) {   // Check validity of each timeSlot
          if (!timeSlotCheck(slot)) throw invalidSlot;
        }
        return await Employee.create({ firstName, lastName, wage, desiredHours, role, availability, manager }, {new: true, runValidators: true});
      }
      catch (error) {
        console.error('Error adding employee:', error.message);
        console.error(error.stack);
        throw new Error(`Error adding employee: ${error.message}`);
      }
    },

    // Works
    updateEmployee: async (parent, args) => {
      try {
        const {_id, availability, ...otherFields} = args;
        console.log(availability.length);
        if (availability) {        // Check validity of each timeSlot if included in args
          for (i = 0; i < availability.length; i++) {
            console.log(`${availability[i].startTime} vs. ${availability[i].endTime}`);
            console.log(timeSlotCheck(availability[i]));
            if (!timeSlotCheck(availability[i])) throw invalidSlot;
            else return await Employee.findOneAndUpdate({ _id }, {$set: otherFields, availability}, {new: true, runValidators: true});
          }
        }
        return await Employee.findOneAndUpdate({ _id }, {$set: otherFields});
      }
      catch (error) {
        throw new Error('Error updating employee info: ' + error.message);
      }
    },

    // Works
    deleteEmployee: async (parent, { _id }) => {
      try {
        return await Employee.findOneAndDelete({ _id });
      }
      catch (error) {
        throw new Error('Error deleting employee ' , error.message);
      }
    },

    // Works
    addRole: async (parent, { name, description, manager }) => {
      try {
        return await Role.create({ name, description, manager });
      }
      catch (error) {
        throw new Error('Error adding role ' , error.message);
      }
    },

    // Works
    deleteRole: async (parent, { _id }) => {
      try {
        return await Role.findOneAndDelete({ _id });
      }
      catch (error) {
        throw new Error('Error deleting role ' , error.message);
      }
    },

    // Works
    addSchedule: async (parent, { weekISO, manager }) => {
      try {
        shifts = []
        console.log("ISO: "+weekISO);
        weekOf = dateScalar.parseValue(weekISO);
        console.log("Date object: "+weekOf);
        return await Schedule.create({ weekOf, shifts, manager });
      }
      catch (error) {
        console.error('Error adding schedule:', error.message);
        console.error(error.stack);
        throw new Error(`Error adding schedule: ${error.message}`);
      }
    },

    // Works
    deleteSchedule: async (parent, { _id }) => {
      try {
        return await Schedule.findOneAndDelete({ _id });
      }
      catch (error) {
        throw new Error('Error deleting schedule');
      }
    },

    // Works
    addShift: async (parent, { timeSlot, schedule, employee, department }) => {
      try {
        console.log("New timeslot: "+timeSlot);
      // Check if within employee availability
        if (await availabilityCheck(employee, timeSlot)) console.log("Employee available yayyy");
        else throw availabilityError;
      // Check valid timeslot
        if (await timeSlotCheck(timeSlot)) console.log("Valid timeslot. Booyah!");
        else throw invalidSlot;
      // Check if shift overlaps
        if (await overlapCheck(employee, schedule, timeSlot)) console.log("No overlaps, nicely done");
        else throw shiftOverlap;

        const updatedSchedule = await Schedule.findOneAndUpdate(
          { _id: schedule },
          { $addToSet: { 
            shifts: { 
              timeSlot, schedule, employee, department
            } }, },
          { new: true, }
        );
        // Return shift that was just created from the shifts array within the schedule
        console.log(updatedSchedule);
        return updatedSchedule.shifts[updatedSchedule.shifts.length - 1];
      }
      catch (error) {
        throw new Error('Error adding shift: '+error.message);
      }
    },

    // Works
    updateShift: async (parent, { timeSlot, _id , schedule, employee, department }) => {
      try {
        // Check if within employee availability
          if (await availabilityCheck(employee, timeSlot)) console.log("Employee available yayyy");
          else throw availabilityError;
        // Check valid timeslot
          if (await timeSlotCheck(timeSlot)) console.log("Valid timeslot. Booyah!");
          else throw invalidSlot;

        const updatedSchedule = await Schedule.findOneAndUpdate(
          { _id: schedule, "shifts._id": _id },
          { $set: { 
              "shifts.$.timeSlot": timeSlot,
              "shifts.$.department": department,
              "shifts.$.employee": employee,
            }, },
          { new: true, }
        ).populate('shifts.employee');

        return updatedSchedule.shifts.filter(shift => shift._id == _id)[0];
      }
      catch (error) {
        throw new Error('Error updating shift: '+error.message);
      }
    },

    // Works
    deleteShift: async (parent, { schedule, _id }) => {
      try {
        return await Schedule.findOneAndUpdate(
          { _id: schedule },
          { $pull: { shifts: { _id } } },
          { new: true }
        );
      } catch (error) {
        throw new Error('Error deleting shift');
      }
    },

    // Works
    addStoreHours: async (parent, { dayHours, manager }) => {
      try {
        return await StoreHours.create({ dayHours, manager });
      }
      catch (error) {
        console.error('Error adding storehours:', error.message);
        console.error(error.stack);
        throw new Error(`Error adding storehours: ${error.message}`);
      }
    },

    // Works
    deleteStoreHours: async (parent, { _id }) => {
      try {
        return await StoreHours.findOneAndDelete({ _id });
      }
      catch (error) {
        throw new Error('Error deleting employee');
      }
    },

    
  }
};

availabilityCheck = async ( employee, timeSlot ) => {
  // Retrieve employee's data
    const shiftDay = timeSlot.day;
    const employeeObject = await Employee.findById(employee);
    if (!employeeObject) throw new Error('Employee not found');
    console.log("Adding shift for: "+employeeObject.firstName);

  // Retrieves all the availability timeslots for that specific employee on that day and puts in the array
    const availabilitySlots = employeeObject.availability.filter(slot => slot.day == shiftDay);
    console.log(employeeObject.firstName+"'s availability on this day is: "+availabilitySlots);
  
  // If array is empty, not available for that day
    if (availabilitySlots.length == 0) return false;
    available = availabilitySlots.some(slot => slot.startTime <= timeSlot.startTime && slot.endTime >= timeSlot.endTime);
    return available;
}

timeSlotCheck = ( timeSlot ) => { 
  return timeSlot.startTime < timeSlot.endTime;
}

overlapCheck = async ( employee, schedule, timeSlot ) => {
  const shiftDay = timeSlot.day;
  // Fetches shifts for the same employee on the same day
  const scheduleObject = await Schedule.findById(schedule);
  // console.log(scheduleObject);
  const sameDayShifts = await scheduleObject.shifts.filter(shift => {
    dayC = shift.timeSlot.day === shiftDay;
    console.log("day: "+dayC);
    employeeC = shift.employee == employee;
    console.log("employee: "+employeeC);
    return dayC && employeeC;
  });
  return sameDayShifts.length == 0;
}

module.exports = resolvers;
