import '../style/register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StaffRegister() {
  const [id,       setID]       = useState('');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [phone,    setPhone]    = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res  = await fetch('https://hospital-backend-xxxx.onrender.com/register-staff', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id, name, email, password, phone }),
    });
    const data = await res.json();
    if (data.success) {
      alert('Registration successful! Please login.');
      navigate('/stafflog');
    } else {
      alert(data.message || 'Registration failed');
    }
  };

  return (
    <div className="register">
      <div className="container-fluid">
        <div className="register-heading bg-warning">
          <h2>Staff Register</h2>
        </div>
        <form onSubmit={handleRegister}>
          <input type="text"     placeholder="Staff ID"  value={id}       onChange={e => setID(e.target.value)}       required />
          <input type="text"     placeholder="Full Name" value={name}     onChange={e => setName(e.target.value)}     required />
          <input type="text"     placeholder="Email"     value={email}    onChange={e => setEmail(e.target.value)}    required />
          <input type="password" placeholder="Password"  value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="text"     placeholder="Phone"     value={phone}    onChange={e => setPhone(e.target.value)} />
          <button type="submit" className="btn btn-outline-success mt-4">Register</button>
          <hr />
          <div className="end">
            <p>Already registered?</p>
            <span><a href="/stafflog">Login Here</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffRegister;