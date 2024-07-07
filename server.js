const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// const users = [
//   { id: 1, name: "User 1" },
//   { id: 2, name: "User 2" },
// ];

const users = [];

app.get("/", (req, res) => {
  res.status(200);
  res.send("Successfully connected to the server");
});

app.get("/users", (req, res) => {
  res.status(200);
  res.send(users);
});

app.post("/users", async (req, res) => {
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

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
      } else {
        res.send('Not Allowed')
      }
    } catch {
      res.status(500).send()
    }
  })

app.listen(port, () => {
  console.log(`the app listening on port:${port}`);
});
