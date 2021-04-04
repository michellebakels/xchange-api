const functions = require('firebase-functions');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");

const { getTasks } = require("./src/tasks");

app.use(bodyParser.json());
app.use(cors());

app.get('/tasks', getTasks)

exports.app = functions.https.onRequest(app);
