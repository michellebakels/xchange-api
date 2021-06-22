const admin = require("firebase-admin");
const serviceAccount = require("../../credentials.json");

let db;

function dbAuth() {
    if (!db) {
        admin.initializeApp({
            credentials: admin.credential.cert(serviceAccount),
        });
        db = admin.firestore();
    }
}

exports.getTaskById = (req, res) => {
    dbAuth()
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
    if(!req.params || !req.params.taskId) {
        res.send({ message: "No task specified"})
        return
    }
    db.collection('tasks').doc(req.params.taskId).get()
        .then(snapshot => {
            let task = snapshot.data()
            task.id = snapshot.id
            res.send({data: task})
        })
        .catch(error => res.send({ error }))
}

exports.getTasks = (req, res) => {
    dbAuth()
    db.collection('tasks')
        .get()
        .then((collection) => {
            const tasks = collection.docs.map((doc) => {
                let task = doc.data();
                task.id = doc.id;
                return task;
            });
            res.status(200).send({
                status: 'success',
                data: tasks,
                message: 'Tasks found',
                statusCode: 200
            })
        })
        .catch((err) => res.status(500).send("get tasks failed:", err));
};

exports.getUserTasks = (req, res) => {
    if(!req.params.userId) {
        res.status(400).send('Invalid Post')
    }
    dbAuth()
    db.collection('tasks').where('user.userId', '==', req.params.userId)
        .get()
        .then((collection) => {
            const tasks = collection.docs.map((doc) => {
                let task = doc.data();
                task.id = doc.id;
                return task;
            });
            res.status(200).send({
                status: 'success',
                data: tasks,
                message: 'User tasks found',
                statusCode: 200
            });
        })
        .catch((err) => res.status(500).send("get tasks failed:", err));
};

exports.postTask = (req, res) => {
    if(!req.body) {
        res.status(400).send('Invalid Post')
    }
    dbAuth()
    let now = admin.firestore.FieldValue.serverTimestamp()
    const newTask = req.body
    newTask.created = now
    db.collection('tasks').add(newTask)
        .then((docRef) => {
            db.collection('tasks').doc(docRef.id).get()
                .then(snapshot => {
                    let task = snapshot.data()
                    task.id = snapshot.id
                    res.status(200).send({
                        status: 'success',
                        data: task,
                        message: 'Task created',
                        statusCode: 200
                    })
                })
        })
        .catch(err => res.status(500).send('post failed', err))
}

exports.updateTask = (req, res) => {
    if (!req.params.taskId) {
        res.status(400).send("Invalid Update");
    }
    dbAuth();

    let now = admin.firestore.FieldValue.serverTimestamp();
    const updatedTask = req.body;
    updatedTask.updated = now;

    db.collection("tasks")
        .doc(req.params.taskId)
        .update(updatedTask)
        .then(() => res.status(200).send({
            status: 'success',
            data: {taskId: req.params.taskId},
            message: 'Task updated',
            statusCode: 200
        }))
        .catch((err) => res.status(500).send('error'));
};