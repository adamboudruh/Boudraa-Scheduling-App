// Create the typeDefs
// Type for User/Course/Instructor/Thought and Auth
// Query for Users/Courses/Instructors and CourseByID/InstructorByID
// Mutations for AddUser/Login and Add/Remove/Update thought from course

const typeDefs = `

scalar Date

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
  roles: [Role]
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
  wage: Float!
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
  timeSlot: TimeSlot!
  schedule: Schedule!
  employee: Employee!
  department: Department
  manager: User!
}

type StoreHours {
  _id: ID!
  dayHours: [TimeSlot]
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
  userById(userId: ID!): User
  departments(userId: ID!): [Department]
  department(id: ID!): Department
  employees(userId: ID!): [Employee]
  employee(id: ID!): Employee
  roles(userId: ID!): [Role]
  role(id: ID!): Role
  schedules(userId: ID!): [Schedule]
  schedule(id: ID!): Schedule
  storeHours(userId: ID!): StoreHours
}

type Mutation {

   addUser(
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  ): Auth

   login(
    email: String!, 
    password: String!
  ):Auth

  addDepartment(
    name: String!, 
    manager: ID!
  ): Department
  
  deleteDepartment(
    _id: ID!
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
    _id: ID!, 
    firstName: String, 
    lastName: String, 
    wage: Float, 
    desiredHours: Int, 
    manager: ID, 
    role: ID, 
    availability: [TimeSlotInput]
  ): Employee

  deleteEmployee(
    _id: ID!
  ): Employee

  addRole(
    name: String!, 
    description: String,
    manager: ID!
  ): Role

  deleteRole(
    _id: ID!
  ): Role

  addSchedule(
    weekISO: String!,
    manager: ID!
  ): Schedule

  deleteSchedule(
    _id: ID!
  ): Schedule

  addShift(
    timeSlot: TimeSlotInput!,
    schedule: ID!,
    employee: ID!, 
    department: ID!
  ): Shift

  updateShift(
    _id: ID!, 
    slot: TimeSlotInput, 
    schedule: ID, 
    employee: ID, 
    department: ID
  ): Shift

  deleteShift(
    schedule: ID!
    _id: ID!
  ): Schedule

  addStoreHours(
    dayHours: [TimeSlotInput]!, 
    manager: ID!
  ): StoreHours

  updateStoreHours(
    _id: ID!, 
    dayHours: [TimeSlotInput]
  ): StoreHours

  deleteStoreHours(
    _id: ID!
  ): StoreHours
}

input TimeSlotInput {
  day: Int!
  startTime: String!
  endTime: String!
}
`;

module.exports = typeDefs;
