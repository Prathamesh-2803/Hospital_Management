import '../style/register.css'
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Register(){
    const [id, setID] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const handleRegister = async (e) =>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/add-user",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id, email, password}),
        });

        const data =await response.json();
        console.log(data);
        
        if(data.success == true){
            alert("Registration successful! Please login.");
        }
        else{
            alert(data.message);
        }
    };

    return(
        <>
            <div className="register">
                <div className="container-fluid">
                    <div className="register-heading bg-primary">
                        <h2>Register</h2>
                    </div>
                    <form onSubmit={handleRegister}>
                        <input type="text" placeholder='ID' value={id} onChange={(e)=>setID(e.target.value)} required/>
                        <input type="text" placeholder='Email'value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                        <input type="password" placeholder='Password'value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                        <button type="submit" className="btn btn-outline-success mt-4">Register</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register;




