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
