const admin = require("firebase-admin");
const {db} = require('../../index')

exports.getUsers = (req, res) => {
  db.collection("users")
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

exports.getSingleUser = (req, res) => {
  db.collection("users")
    .where("email", "==", req.params.email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          let user = doc.data()
          user.id = doc.id
        res.status(200).send({
            status: 'success',
            data: user,
            message: 'User created',
            statusCode: 200
        })
      });
    })
    .catch((err) => res.status(500).send("get user failed:", err));
};

exports.getUserById = (req, res) => {
    const usersRef = db.collection("users");
    usersRef
        .doc(req.params.userId)
        .get()
        .then((querySnapshot) => {
            let user = querySnapshot.data()
            user.id = querySnapshot.id
            res.status(200).send({
                status: 'success',
                data: user,
                message: 'User found',
                statusCode: 200
            })
        })
        .catch((err) => res.status(500).send("get user failed:", err));
};

exports.postUser = (req, res) => {
  if (!req.body) {
    res.status(400).send("Invalid Post")
  }
  const usersRef = db.collection("users")
  let now = admin.firestore.FieldValue.serverTimestamp()
  const newUser = req.body
  newUser.created = now
  newUser.tokens = 0
  usersRef.add(newUser)
      .then(docRef => {
        usersRef.doc(docRef.id).get()
            .then(snapshot => {
              let user = snapshot.data()
              user.id = snapshot.id
              res.status(200).send({
                status: 'success',
                data: user,
                message: 'User created',
                statusCode: 200
              })
            })
      })
    .catch((err) => res.status(500).send("post failed", err))
};

exports.updateUser = (req, res) => {
    if (!req.body) {
        res.status(400).send("Invalid Post");
    }

    let now = admin.firestore.FieldValue.serverTimestamp();
    const updatedUser = req.body;
    updatedUser.updated = now;

    db.collection("users")
        .doc(req.params.userId)
        .update(updatedUser)
        .then(() => res.status(200).send({
            status: 'success',
            data: {userId: req.params.userId},
            message: 'User updated',
            statusCode: 200
        }))
        .catch((err) => res.status(500).send('error'));
};
