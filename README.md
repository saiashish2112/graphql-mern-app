# MERN + GraphQL

- Creating a full-stack example with Node.js (Express.js) for the backend, React.js for the frontend, and GraphQL for API integration involves setting up both the server and client to communicate using GraphQL queries and mutations.

### Backend (Node.js with Express.js and GraphQL)

### 1. Initialize Node.js Project

```bash
mkdir graphql-example
cd graphql-example
npm init -y
npm install express express-graphql graphql mongoose cors
```

- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `express-graphql`: Express middleware for serving GraphQL requests.
- `graphql`: GraphQL library for creating a GraphQL schema.
- `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environment.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS).

### 2. Set Up MongoDB

Ensure you have MongoDB installed and running locally or configure your MongoDB URI in a `.env` file:

```
DB_URI=mongodb://127.0.0.1:27017/graphql-react-app
```

### 3. Create a GraphQL Schema

Create a `schema.graphql` file to define your GraphQL schema using the GraphQL Schema Definition Language (SDL):

```graphql
# schema.graphql
type User {
  id: ID!
  username: String!
  email: String!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(username: String!, email: String!): User!
  deleteUser(id: ID!): User
}
```

### 4. Implement Resolvers

Create resolvers to handle GraphQL queries and mutations. For simplicity, we'll use an in-memory array as a data source:

```jsx
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

```

### 5. Create GraphQL Server with Express

Set up an Express server to handle GraphQL requests using `express-graphql` middleware:

```jsx
// server/index.js
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("fs");
const uri = "mongodb://127.0.0.1:27017/graphql-react-app";
const path = require("path");

// const typeDefs = require("./schema.graphql"); 
const resolvers = require("./resolvers");

const app = express();

// Read the schema file
const schemaPath = path.join(__dirname, 'schema.graphql');
const typeDefs = fs.readFileSync(schemaPath, 'utf8');

// Allow cross-origin requests
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true, // Enable GraphiQL for easy testing
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
```

### Frontend (React.js with Apollo Client)

### 1. Set Up React Project

Initialize a new React project and install necessary packages:

```bash
npx create-react-app client
cd client
npm install @apollo/client graphql
```

- `@apollo/client`: Apollo Client for GraphQL data management in React applications.

### 2. Set Up Apollo Client

Configure Apollo Client to connect to your GraphQL server:

```jsx
// client/src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // GraphQL server endpoint
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

### 3. Create Components and Queries

Create React components to interact with GraphQL using Apollo Client:

```jsx
// client/src/App.js
import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_USERS = gql`
  query {
    users {
      id
      username
      email
    }
  }
`;

const ADD_USER = gql`
  mutation CreateUser($username: String!, $email: String!) {
    createUser(username: $username, email: $email) {
      id
      username
      email
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [createUser] = useMutation(ADD_USER);

  const handleAddUser = async () => {
    try {
      const response = await createUser({
        variables: { username: "new_user", email: "new_user@example.com" },
        refetchQueries: [{ query: GET_USERS }],
      });
      console.log("User added:", response.data.createUser);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>GraphQL ReactJS App</h1>
      <button onClick={handleAddUser}>Add User</button>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            <strong>{user.username}</strong>: {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

### Running the Example

1. Start the backend server:
    
    ```bash
    node server/index.js
    ```
    
2. Start the frontend React development server:
    
    ```bash
    cd client
    npm start
    ```
    
3. Open your browser and navigate to `http://localhost:3000`. You should see the React application displaying a list of users fetched from the GraphQL server. Clicking the `"Add User"` button will add a new user to the list using a GraphQL mutation.

### Summary

> This example demonstrates the integration of `GraphQL` with `Node.js (Express.js)` for the backend and React.js for the frontend using `Apollo Client.`
> 

> `GraphQL's` schema-driven approach allows clients to request exactly the data they need, providing a flexible and efficient API interaction compared to traditional REST APIs.
> 

> Adjust the example according to your specific requirements and explore more advanced GraphQL features as needed.
>