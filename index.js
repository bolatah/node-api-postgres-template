require("dotenv").config();

const express = require("express");
const app = express();

const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./queries");

app.get("/", (req, res) => {
  res.json({
    info: "Node.js, Express, and Postgres API",
  });
});
app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);
app.delete("/users/:id", db.deleteUser);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
