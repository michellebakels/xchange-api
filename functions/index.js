const functions = require('firebase-functions');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");

const { getTasks, postTask } = require("./src/tasks");
const { getUsers, postUser, updateUser } = require("./src/users");

app.use(bodyParser.json());
app.use(cors());

app.get('/tasks', getTasks)
app.post('/tasks', postTask)

app.get('/users', getUsers)
app.post('/users', postUser)
app.patch('/users/:userId', updateUser)

exports.app = functions.https.onRequest(app);
