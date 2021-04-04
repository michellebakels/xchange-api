const admin = require("firebase-admin");
const serviceAccount = require("../../../credentials.json");

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