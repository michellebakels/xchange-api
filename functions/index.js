const functions = require('firebase-functions');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");

const { getTasks, postTask, getUserTasks, getTaskById, updateTask } = require("./src/tasks");
const { getUsers, postUser, updateUser, getSingleUser, getUserById } = require("./src/users");

app.use(bodyParser.json());
app.use(cors());

app.get('/tasks', getTasks)
app.get('/tasks/:userId', getUserTasks)
app.get('/tasks/id/:taskId', getTaskById)
app.patch('/tasks/:taskId', updateTask)
app.post('/tasks', postTask)

app.get('/users', getUsers)
app.get('/users/:email', getSingleUser)
app.get('/users/id/:userId', getUserById)
app.post('/users', postUser)
app.patch('/users/:userId', updateUser)

exports.app = functions.https.onRequest(app);
