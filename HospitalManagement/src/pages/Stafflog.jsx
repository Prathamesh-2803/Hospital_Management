import '../style/adminlog.css'
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Stafflog(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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
            navigate("/staffpage");
        } else {
            alert("Invalid email or password");
        }
    };


    return(
        <>
            <div className="adminlog-container">
                <div className="container-fluid">
                    <div className="adminlog-user bg-primary">
                        <h2>Staff Login</h2>
                    </div>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" className="btn btn-outline-success">Login</button>
                        <hr />
                        <div className="end">
                            <p>New Staff?</p>
                            <span><a href="register">Register Here</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Stafflog;