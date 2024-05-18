if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const router = require("./routes");
const errorHandler = require("./helpers/errorHandler");
const cors = require("cors");
const app = express();
const port = process.env.PORT||3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(router)

app.use(errorHandler)

module.exports = {app, port};


