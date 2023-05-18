# Competency Tree PoC Backend

The backend uses Apollo GraphQL and Node JS to interact with a local Neo4j database.

## Database Setup

Install Neo4j Desktop and create a new DBMS. When prompted, set the database password to 1234. Once the database has been created, install the APOC plugin. Finally, use the [apoc.import.json](https://neo4j.com/docs/apoc/current/import/load-json/#load-json-examples-import-json) procedure to import the data from the data.json file.
```
CALL apoc.import.json("file:///data.json")
```

## Running the Backend

Copy .env.template and rename it to .env. Then, install the dependencies and start the server
```
> npm install
> npm start
```