// server/resolvers.js
let users = [
  { id: "1", username: "john_doe", email: "john@example.com" },
  { id: "2", username: "jane_smith", email: "jane@example.com" },
];

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, { id }) => users.find((user) => user.id === id),
  },
  Mutation: {
    createUser: (parent, { username, email }) => {
      const user = { id: String(users.length + 1), username, email };
      users.push(user);
      return user;
    },
    deleteUser: (parent, { id }) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) throw new Error("User not found");
      const deletedUser = users.splice(userIndex, 1)[0];
      return deletedUser;
    },
  },
};

module.exports = resolvers;
