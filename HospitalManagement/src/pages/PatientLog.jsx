import '../style/adminlog.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PatientLog() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res  = await fetch('https://hospital-backend-xxxx.onrender.com/patient-login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('patient', JSON.stringify(data.patient));
      navigate('/patientpage');
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className="adminlog-container">
      <div className="container-fluid">
        <div className="adminlog-user bg-info">
          <h2>Patient Login</h2>
        </div>
        <form onSubmit={handleLogin}>
          <input type="email"    placeholder="Email"    value={email}    onChange={e => setEmail(e.target.value)}    required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-outline-success">Login</button>
          <hr />
          <div className="end">
            <p>New Patient?</p>
            <span><a href="/patient-register">Register Here</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientLog;