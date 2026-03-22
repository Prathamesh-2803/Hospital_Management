import "../style/register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientRegister() {
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("https://hospital-backend-xxxx.onrender.com/register-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        email,
        password,
        age: Number(age) || null,
        phone,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Registration successful! Please login.");
      navigate("/patientlog");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="register">
      <div className="container-fluid">
        <div className="register-heading bg-info">
          <h2>Patient Register</h2>
        </div>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Patient ID"
            value={id}
            onChange={(e) => setID(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-success mt-4">
            Register
          </button>
          <hr />
          <div className="end">
            <p>Already registered?</p>
            <span>
              <a href="/patientlog">Login Here</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientRegister;
