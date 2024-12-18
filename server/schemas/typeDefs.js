// Create the typeDefs
// Type for User/Course/Instructor/Thought and Auth
// Query for Users/Courses/Instructors and CourseByID/InstructorByID
// Mutations for AddUser/Login and Add/Remove/Update thought from course

const typeDefs = `

type User {
  _id: ID!
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  storeHours: StoreHours
  schedules: [Schedule]
  employees: [Employee]
  departments: [Department]
}

type Department {
  _id: ID!
  name: String!
  manager: User!
}

type Employee {
  _id: ID!
  firstName: String!
  lastName: String!
  wage: Number!
  desiredHours: Int!
  role: Role!
  availability: [TimeSlot]
  manager: User!
}

type Role {
  _id: ID!
  name: String!
  description: String
  manager: User!
}

type Schedule {
  _id: ID!
  weekOf: Date!
  shifts: [Shift]
  manager: User!
}

type Shift {
  _id: ID!
  slot: TimeSlot!
  schedule: Schedule!
  employee: Employee!
  department: Department!
  manager: User!
  shiftLength: Float
}

type StoreHours {
  _id: ID!
  hours: [TimeSlot]
  manager: User!
}

type TimeSlot {
  day: Int!
  startTime: String!
  endTime: String!
  duration: Float
}

type Auth {
    token: ID
    user: User
  }

type Query {
  users: [User]
  user(id: ID!): User
  departments(userId: ID!): [Department]
  department(id: ID!): Department
  employees(userId: ID!): [Employee]
  employee(id: ID!): Employee
  roles(userId: ID!): [Role]
  role(id: ID!): Role
  schedules(userId: ID!): [Schedule]
  schedule(id: ID!): Schedule
  shifts(userId: ID!): [Shift]
  shift(id: ID!): Shift
  storeHours(userId: ID!): StoreHours
}

type Mutation {

   addUser(
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    instructors: [ID]
    courses: [ID]  
  ): Auth

   login(
    email: String!, 
    password: String!
  ):Auth

  deleteUser(
    id: ID!
  ): User

  addDepartment(
      name: String!, 
      manager: ID!
    ): Department

  updateDepartment(
    id: ID!, 
    name: String, 
    manager: ID
  ): Department

  deleteDepartment(
    id: ID!
  ): Department

  addEmployee(
    firstName: String!, 
    lastName: String!, 
    wage: Float!, 
    desiredHours: Int!, 
    manager: ID!, 
    role: ID!, 
    availability: [TimeSlotInput]!
  ): Employee

  updateEmployee(
    id: ID!, 
    firstName: String, 
    lastName: String, 
    wage: Float, 
    desiredHours: Int, 
    manager: ID, 
    role: ID, 
    availability: [TimeSlotInput]
  ): Employee

  deleteEmployee(
    id: ID!
  ): Employee

  addRole(
    name: String!, 
    description: String
  ): Role

  updateRole(
    id: ID!, 
    name: String, 
    description: String
  ): Role

  deleteRole(
    id: ID!
  ): Role

  addSchedule(
    weekOf: String!, 
    shifts: [ID]!, 
    manager: ID!
  ): Schedule

  updateSchedule(
    id: ID!, 
    weekOf: String, 
    shifts: [ID], 
    manager: ID
  ): Schedule

  deleteSchedule(
    id: ID!
  ): Schedule

  addShift(
    slot: TimeSlotInput!, 
    schedule: ID!, 
    employee: ID!, 
    department: ID!, 
    manager: ID!
  ): Shift

  updateShift(
    id: ID!, 
    slot: TimeSlotInput, 
    schedule: ID, 
    employee: ID, 
    department: ID, 
    manager: ID
  ): Shift

  deleteShift(
    id: ID!
  ): Shift

  addStoreHours(
    hours: [TimeSlotInput]!, 
    manager: ID!
  ): StoreHours

  updateStoreHours(
    id: ID!, 
    hours: [TimeSlotInput], 
    manager: ID
  ): StoreHours

  deleteStoreHours(
    id: ID!
  ): StoreHours
}

input TimeSlotInput {
  day: Int!
  startTime: String!
  endTime: String!
}
`;

module.exports = typeDefs;
