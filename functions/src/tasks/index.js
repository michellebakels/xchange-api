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
    db.collection('tasks').where('userId', '==', req.params.userId)
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