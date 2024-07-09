const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const fs = require("fs");
const utils = require("./utils");
const { authenticateToken } = require("./middlewares/auth.middleware");
require("dotenv").config();

const app = express();

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
  const result = users.map((user) => {
    return { id: user.id, username: user.username };
  });
  res.status(200);
  res.send(result);
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
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch (err) {
    res.status(500).send();
  }
});

app.get("/posts", authenticateToken, (req, res) => {
  const userPosts = posts.filter((item) => item.ownerId === req.user.id);
  res.send(userPosts)
});

app.post("/login", async (req, res) => {
  let user = users.find((user) => user.username === req.body.username);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user = {
        id: user.id,
        username: user.username,
      };
      const accessToken = utils.getAuthToken(user);
      res.status(200).json({ accessToken });
    } else {
      res.status(401).send("the password did not match.");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`the app listening on port:${process.env.PORT}`);
});
