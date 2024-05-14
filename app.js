const express = require("express");
const router = require("./routes");
const errorHandler = require("./helpers/errorHandler");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router)

app.use(errorHandler)

module.exports = {app, port};


