const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const database = client.db(process.env.MONGODB_DBNAME || process.env.MONGODB_DBNAME_TEST || "gp-development");

module.exports = { client, database };
