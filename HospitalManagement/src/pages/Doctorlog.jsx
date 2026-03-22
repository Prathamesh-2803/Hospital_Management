import '../style/adminlog.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Doctorlog() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res  = await fetch('https://hospital-backend-xxxx.onrender.com/doctor-login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('doctor', JSON.stringify(data.doctor));
      navigate('/doctorpage');
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className="adminlog-container">
      <div className="container-fluid">
        <div className="adminlog-user bg-success">
          <h2>Doctor Login</h2>
        </div>
        <form onSubmit={handleLogin}>
          <input type="email"    placeholder="Email"    value={email}    onChange={e => setEmail(e.target.value)}    required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-outline-success">Login</button>
          <hr />
          <div className="end">
            <p>Credentials are set by Admin.</p>
            <span><a href="/choice">← Back</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Doctorlog;