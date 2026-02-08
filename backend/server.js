const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port:3307,
  database: "hospital_management"
});

db.connect(err => {
  if (err) {
    console.log("Database connection failed"+err);
  } else {
    console.log("MySQL Connected");
  }
});

//Register

app.post("/add-user", (req, res) => {
  const { id, email, password } = req.body;

  db.query(
    "INSERT INTO users (id , email, password) VALUES (?, ?, ?)",
    [id, email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(400).json({
          success: false,
          message: err.sqlMessage || "Registration failed"
        });
      } else {
        res.send({ success: true, message: "User added successfully" });
      }
    }
  );
});

app.get("/users", (req, res) => {
    console.log('here');
  db.query("SELECT * FROM users", (err, result) => {
    
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
