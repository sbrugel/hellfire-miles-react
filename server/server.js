const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require('fs')
require("dotenv").config({ path: "./config.env" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

console.log('Connected to DB');

// schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const moveSchema = new mongoose.Schema({
    user: String,
    loco1: String,
    loco2: String,
    loco3: String,
    loco4: String,
    start: String,
    end: String,
    service: String,
    mileage: Number
});

// models
const User = new mongoose.model("User", userSchema);
const Move = new mongoose.model("Move", moveSchema);

// routes
// add a user to the database
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "This user already exists." });
        } else {
            const user = new User({ name, email, password });
            user.save(err => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ message: "User has been registered" });
                }
            });
        }
    });
});

// check for an existing user
app.post("/login", (req, res) => {
    const { name, password } = req.body;
    User.findOne({ name: name }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login successful!", user: user });
            } else {
                res.send({ message: "Login failed: Incorrect credentials." });
            }
        } else {
            res.send({ message: "This user does not exist." });
        }
    })
});

// add a move to the database
app.post("/moves", (req, res) => {
    const { user, loco1, loco2, loco3, loco4, start, end, service, mileage } = req.body;
    const move = new Move({ user, loco1, loco2, loco3, loco4, start, end, service, mileage})
    move.save(err => {
        if (err) {
            res.send(err);
        } else {
            res.send({ message: `Move for ${user} added` });
        }
    });
});

// get all moves from a specific user
app.get("/moves/:u", (req, res) => {
    Move.find({ user: req.params.u }, (err, moves) => {
        res.json(moves);
    })
});

// get the list of every class
app.get("/allclasses", (req, res) => {
    fs.readFile('./classes.txt', 'utf-8', (err, classes) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json(classes.split('\r\n'));
    })
});

// get the list of every loco
app.get("/alllocos", (req, res) => {
    fs.readFile('./baseneeds.txt', 'utf-8', (err, locos) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json(locos.split('\r\n'));
    })
});

// get the list of every loco of a certain class
app.get("/alllocos/:c", (req, res) => {
    fs.readFile('./baseneeds.txt', 'utf-8', (err, locos) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json(locos.split('\r\n').filter((l) => l.startsWith(req.params.c)));
    })
});

app.listen(port, () => {
    console.log('Server is now started');
})