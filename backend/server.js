const express = require("express");
const mysql   = require("mysql2");
const cors    = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host:        "mysql.railway.internal",
  user:        "root",
  password:    "dUtQZMyHXottxHmbQIuvXDjjJbsTWXFn",
  port:        3306,
  database:    "railway",
  dateStrings: true,
});

db.connect((err) => {
  if (err) console.log("DB connection failed: " + err);
  else     console.log("MySQL Connected");
});

// ── ADMIN REGISTER ──
// Saves to users table (for admin/staff login)
app.post("/add-user", (req, res) => {
  const { id, email, password } = req.body;
  db.query(
    "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
    [id, email, password],
    (err) => {
      if (err) return res.status(400).json({ success: false, message: err.sqlMessage });
      res.json({ success: true, message: "Registered successfully" });
    }
  );
});

// ── STAFF REGISTER ──
// Saves to users table (for login) AND staff table (for admin to see)
app.post("/register-staff", (req, res) => {
  const { id, name, email, password, phone } = req.body;
  if (!id || !name || !email || !password)
    return res.status(400).json({ success: false, message: "ID, name, email and password required" });

  // First insert into users table for login
  db.query(
    "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
    [id, email, password],
    (err) => {
      if (err) return res.status(400).json({ success: false, message: err.sqlMessage });

      // Then insert into staff table so admin can see them
      db.query(
        "INSERT INTO staff (id, name, role, phone, shift, status) VALUES (?, ?, ?, ?, ?, ?)",
        [id, name, "Staff", phone || "", "Morning", "Active"],
        (err2) => {
          if (err2) {
            // Rollback the users insert if staff insert fails
            db.query("DELETE FROM users WHERE id = ?", [id]);
            return res.status(400).json({ success: false, message: err2.sqlMessage });
          }
          res.json({ success: true, message: "Staff registered successfully" });
        }
      );
    }
  );
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ── ADMIN LOGIN ──
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ success: false, message: "All fields required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err)            return res.json({ success: false, message: "Database error" });
    if (!result.length) return res.json({ success: false, message: "Email not found" });

    const user = result[0];
    if (password !== user.password)
      return res.json({ success: false, message: "Invalid password" });

    db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);
    res.json({ success: true, user: { id: user.id, email: user.email } });
  });
});

// ── DOCTOR LOGIN ──
app.post("/doctor-login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ success: false, message: "All fields required" });

  db.query("SELECT * FROM doctors WHERE email = ?", [email], (err, result) => {
    if (err)            return res.json({ success: false, message: "Database error" });
    if (!result.length) return res.json({ success: false, message: "Email not found" });

    const doc = result[0];
    if (password !== doc.password)
      return res.json({ success: false, message: "Invalid password" });

    db.query("UPDATE doctors SET last_login = NOW() WHERE id = ?", [doc.id]);
    res.json({
      success: true,
      doctor:  { id: doc.id, name: doc.name, email: doc.email, dept: doc.dept, specialization: doc.specialization },
    });
  });
});

// ── PATIENT REGISTER ──
app.post("/register-patient", (req, res) => {
  const { id, name, email, password, age, phone } = req.body;
  if (!id || !name || !email || !password)
    return res.status(400).json({ success: false, message: "ID, name, email and password required" });

  db.query(
    "INSERT INTO patient_users (id, name, email, password, age, phone) VALUES (?, ?, ?, ?, ?, ?)",
    [id, name, email, password, age || null, phone || null],
    (err) => {
      if (err) return res.status(400).json({ success: false, message: err.sqlMessage });
      res.json({ success: true, message: "Registered successfully" });
    }
  );
});

// ── PATIENT LOGIN ──
app.post("/patient-login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ success: false, message: "All fields required" });

  db.query("SELECT * FROM patient_users WHERE email = ?", [email], (err, result) => {
    if (err)            return res.json({ success: false, message: "Database error" });
    if (!result.length) return res.json({ success: false, message: "Email not found" });

    const p = result[0];
    if (password !== p.password)
      return res.json({ success: false, message: "Invalid password" });

    db.query("UPDATE patient_users SET last_login = NOW() WHERE id = ?", [p.id]);
    res.json({
      success: true,
      patient: { id: p.id, name: p.name, email: p.email, age: p.age, phone: p.phone },
    });
  });
});

// ── PATIENT USERS (admin view) ──
app.get("/patient-users", (req, res) => {
  db.query(
    "SELECT id, name, email, age, phone, last_login FROM patient_users ORDER BY last_login DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.delete("/patient-users/:id", (req, res) => {
  db.query("DELETE FROM patient_users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});

// ── DOCTORS ──
app.get("/doctors", (req, res) => {
  db.query(
    "SELECT id, name, specialization, dept, phone, email, status, last_login FROM doctors",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.post("/add-doctor", (req, res) => {
  const { id, name, specialization, dept, phone, email, status, password } = req.body;
  db.query(
    "INSERT INTO doctors (id, name, specialization, dept, phone, email, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, name, specialization, dept, phone, email, status, password || ""],
    (err) => {
      if (err) return res.status(400).json({ success: false, message: err.sqlMessage });
      res.json({ success: true, message: "Doctor added" });
    }
  );
});

// PUT never touches password column
app.put("/update-doctor/:id", (req, res) => {
  const { name, specialization, dept, phone, email, status } = req.body;
  db.query(
    "UPDATE doctors SET name=?, specialization=?, dept=?, phone=?, email=?, status=? WHERE id=?",
    [name, specialization, dept, phone, email, status, req.params.id],
    (err) => {
      if (err) return res.status(400).json({ success: false, message: err.sqlMessage });
      res.json({ success: true, message: "Doctor updated" });
    }
  );
});

app.delete("/delete-doctor/:id", (req, res) => {
  db.query("DELETE FROM doctors WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});

app.get("/doctor-patients/:name", (req, res) => {
  const name = decodeURIComponent(req.params.name);
  db.query(
    "SELECT *, DATE_FORMAT(admission,'%Y-%m-%d') AS admission FROM patients WHERE doctor=?",
    [name],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// ── PATIENTS ──
app.get("/patients", (req, res) => {
  db.query(
    "SELECT *, DATE_FORMAT(admission,'%Y-%m-%d') AS admission FROM patients",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.post("/add-patient", (req, res) => {
  const { id, name, age, disease, doctor, admission, status } = req.body;
  if (!id) return res.status(400).json({ error: "ID required" });
  db.query(
    "INSERT INTO patients (id, name, age, disease, doctor, admission, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, name, age, disease, doctor, admission, status],
    (err) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json("Patient added");
    }
  );
});

app.put("/update-patient/:id", (req, res) => {
  const { name, age, disease, doctor, admission, status } = req.body;
  db.query(
    "UPDATE patients SET name=?, age=?, disease=?, doctor=?, admission=?, status=? WHERE id=?",
    [name, age, disease, doctor, admission, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Patient updated");
    }
  );
});

app.delete("/delete-patient/:id", (req, res) => {
  db.query("DELETE FROM patients WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Deleted");
  });
});

// ── STAFF ──
app.get("/staff", (req, res) => {
  db.query("SELECT * FROM staff", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/add-staff", (req, res) => {
  const { id, name, role, phone, shift, status } = req.body;
  db.query(
    "INSERT INTO staff (id, name, role, phone, shift, status) VALUES (?, ?, ?, ?, ?, ?)",
    [id, name, role, phone, shift, status],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Staff added");
    }
  );
});

app.put("/update-staff/:id", (req, res) => {
  const { name, role, phone, shift, status } = req.body;
  db.query(
    "UPDATE staff SET name=?, role=?, phone=?, shift=?, status=? WHERE id=?",
    [name, role, phone, shift, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Staff updated");
    }
  );
});

app.delete("/delete-staff/:id", (req, res) => {
  db.query("DELETE FROM staff WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Deleted");
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));