import * as fs from "fs";
import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { ApolloServer } from "apollo-server";
import * as dotenv from "dotenv";
dotenv.config();

const typeDefs = fs.readFileSync("./schema.graphql", "utf8").toString();

const driver = neo4j.driver(
  `${process.env.DB_URL}`,
  neo4j.auth.basic(`${process.env.DB_USER}`, `${process.env.DB_PASSWORD}`)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
neoSchema.getSchema().then((schema) => {
  const server = new ApolloServer({ schema });
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
});
