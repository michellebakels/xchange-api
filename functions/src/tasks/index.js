const admin = require("firebase-admin");
const serviceAccount = require("../../cred.json");

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
            res.status(200).send(tasks);
        })
        .catch((err) => res.status(500).send("get tasks failed:", err));
};

exports.postTask = (req, res) => {
    if(!req.body) {
        res.status(400).send('Invalid Post')
    }
    dbAuth()
    let now = admin.firestore.FieldValue.serverTimestamp()
    const newTask = {
        task: req.body,
        created: now
    }
    db.collection('tasks').add(newTask)
        .then(() => {
            this.getTasks(req, res)
        })
        .catch(err => res.status(500).send('post failed', err))
}