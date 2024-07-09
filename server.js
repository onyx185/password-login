const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
require("dotenv").config();
const fs = require("fs");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// db
const db = JSON.parse(fs.readFileSync("./db.json"));
const users = db.users;
const posts = db.posts;

app.get("/", (req, res) => {
  res.status(200);
  res.send("Successfully connected to the server");
});

app.get("/users", (req, res) => {
  res.status(200);
  res.send(users);
});

app.post("/sign-up", async (req, res) => {
  try {
    /** 
     const salt = await bcrypt.genSalt();
     const hashedPassword = await bcrypt.hash(req.body.password, salt);
     console.log("salt ", salt);
     console.log("hashedPassword ", hashedPassword);
     **/
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("hashedPassword ", hashedPassword);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch (err) {
    res.status(500).send();
  }
});

app.post("/login", async (req, res) => {
  const user = users.find((user) => user.username === req.body.username);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`the app listening on port:${process.env.PORT}`);
});
