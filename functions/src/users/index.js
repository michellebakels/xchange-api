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

exports.getUsers = (req, res) => {
    dbAuth()
    db.collection('users')
        .get()
        .then((collection) => {
            const users = collection.docs.map((doc) => {
                let user = doc.data();
                user.id = doc.id;
                return user;
            });
            res.status(200).send(users);
        })
        .catch((err) => res.status(500).send("get users failed:", err));
};

exports.postUser = (req, res) => {
    if(!req.body) {
        res.status(400).send('Invalid Post')
    }
    dbAuth()
    let now = admin.firestore.FieldValue.serverTimestamp()
    const newUser = {
        user: req.body,
        created: now
    }
    db.collection('users').add(newUser)
        .then(() => {
            this.getUsers(req, res)
        })
        .catch(err => res.status(500).send('post failed', err))
}