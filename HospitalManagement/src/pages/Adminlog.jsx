import "../style/adminlog.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Adminlog() {
    const [email, setEmail] = useState("");
    const [password, setPwd] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Login successful!");
            localStorage.setItem("users", JSON.stringify(data.user));
            navigate("/adminpage");
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <>
            <div className="adminlog-container">
                <div className="container-fluid">
                    <div className="adminlog-user bg-primary">
                        <h2>Admin Login</h2>
                    </div>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPwd(e.target.value)} />
                        <button className="btn btn-outline-success">
                            <a href="/adminpage">Login</a>
                        </button>
                        <hr />
                        <div className="end">
                            <p>New Admin?</p>
                            <span>
                                <a href="register">Register Here</a>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Adminlog;
