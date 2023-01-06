const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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

// models
const User = new mongoose.model("User", userSchema);

// routes
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

app.listen(port, () => {
    console.log('Server is now started');
})