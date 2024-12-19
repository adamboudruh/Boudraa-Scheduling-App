// Import models and tokens (authenticate)
const { Department, Employee, Schedule, StoreHours, User, Role, TimeSlot } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const { GraphQLScalarType, Kind } = require('graphql');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom Date scalar type',
  // Converts outgoing Date to inte
  serialize(value) {
    return value instanceof Date ? value.toISOString() : null;
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
    departments: async (parent, { userId }) => {
      try {
        return await Department.find({ manager: userId });
      } catch (error) {
        throw new Error('Error fetching departments');
      }
    },
    department: async (parent, { id }) => {
      try {
        return await Department.findById(id).populate('manager');
      } catch (error) {
        throw new Error('Error fetching department');
      }
    },
    employees: async (parent, { userId }) => {
      try {
        return await Employee.find({ manager: userId }).populate('role');
      } catch (error) {
        throw new Error('Error fetching employees');
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
        throw new Error('Error fetching schedules');
      }
    },
    schedule: async (parent, { id }) => {
      try {
        return await Schedule.findById(id).populate('shifts').populate('manager');
      } catch (error) {
        throw new Error('Error fetching schedule');
      }
    },
    shifts: async (parent, { userId }) => {
      try {
        return await Shift.find({ manager: userId }).populate('slot').populate('employee').populate('department').populate('manager');
      } catch (error) {
        throw new Error('Error fetching shifts');
      }
    },
    shift: async (parent, { id }) => {
      try {
        return await Shift.findById(id).populate('slot').populate('employee').populate('department').populate('manager');
      } catch (error) {
        throw new Error('Error fetching shift');
      }
    },
    storeHours: async (parent, { userId }) => {
      try {
        return await StoreHours.find({ manager: userId }).populate('hours').populate('manager');
      } catch (error) {
        throw new Error('Error fetching store hours');
      }
    }
  },

  Mutation: {
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

    addDepartment: async (parent, { name, manager }) => {
      try {
        return await Department.create({ name, manager });
      }
      catch (error) {
        throw new Error('Error adding department');
      }
    },

    deleteDepartment: async (parent, { id }) => {
      try {
        return await Department.findOneAndDelete({ id });
      }
      catch (error) {
        throw new Error('Error adding department');
      }
    },

    addEmployee: async (parent, { firstName, lastName, wage, desiredHours, role, availability, manager }) => {
      try {
        return await Employee.create({  });
      }
      catch (error) {
        throw new Error('Error adding department');
      }
    },

    updateEmployee: async (parent, { id, firstName, lastName, wage, desiredHours, role, availability, manager }) => {
      try {
        return await Employee.findByIdAndUpdate({ id, firstName, lastName, wage, desiredHours, role, availability, manager });
      }
      catch (error) {
        throw new Error('Error adding department');
      }
    },

    deleteEmployee: async (parent, { id }) => {
      try {
        return await Employee.findOneAndDelete({ id });
      }
      catch (error) {
        throw new Error('Error adding department');
      }
    },

    addRole: async (parent, { name, description, manager }) => {
      try {
        return await Employee.create({ name, description, manager });
      }
      catch (error) {
        throw new Error('Error adding department');
      }
    },

    deleteRole: async (parent, { _id }) => {
      try {
        return await Employee.create({ _id });
      }
      catch (error) {
        throw new Error('Error adding department');
      }
    },

    updateEmployee: async (parent, { id, firstName, lastName, wage, desiredHours, role, availability, manager }) => {
      try {
        return await Employee.findByIdAndUpdate({  });
      }
      catch (error) {
        throw new Error('Error adding department');
      }
    },

    // Add and remove thoughts to courses //
    addThoughtToCourse: async (parent, { courseId, thoughtText, thoughtAuthor }) => {
      return Course.findOneAndUpdate(
        { _id: courseId },
        { $addToSet: { thoughts: { thoughtText, thoughtAuthor } }, },
        { new: true, }
      );
    },

    removeThoughtFromCourse: async (parent, { courseId, thoughtId }) => {
      return Course.findOneAndUpdate(
        { _id: courseId },
        { $pull: { thoughts: { _id: thoughtId } } },
        { new: true }
      );
    },

    updateThoughtInCourse: async (parent, { courseId, thoughtId, updatedThought }) => {
      const updatedCourse = await Course.findOneAndUpdate(
        { _id: courseId, "thoughts._id": thoughtId },
        {
          $set: {
            "thoughts.$.thoughtText": updatedThought,
          },
        },
        { new: true }
      );
      return updatedCourse;
    },
  }
};

module.exports = resolvers;
