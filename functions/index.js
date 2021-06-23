const functions = require('firebase-functions');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fbConfig = require('./credentials.json')
const admin = require('firebase-admin')
admin.initializeApp(fbConfig)
exports.db = admin.firestore()

const { getTasks, postTask, getUserTasks, getTaskById, updateTask, getCompletedTasks } = require("./src/tasks");
const { getUsers, postUser, updateUser, getSingleUser, getUserById } = require("./src/users");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', getTasks)
app.get('/tasks/:userId', getUserTasks)
app.get('/tasks/id/:taskId', getTaskById)
app.get('/tasks/status/completed', getCompletedTasks)
app.patch('/tasks/:taskId', updateTask)
app.post('/tasks', postTask)

app.get('/users', getUsers)
app.get('/users/:email', getSingleUser)
app.get('/users/id/:userId', getUserById)
app.post('/users', postUser)
app.patch('/users/:userId', updateUser)

exports.app = functions.https.onRequest(app);
