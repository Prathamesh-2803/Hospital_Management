import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://hospital-backend-xxxx.onrender.com/api';

function DoctorPage() {
  const [doctor,     setDoctor]     = useState(null);
  const [myPatients, setMyPatients] = useState([]);
  const [tab,        setTab]        = useState('dashboard');

  useEffect(() => {
    const stored = localStorage.getItem('doctor');
    if (!stored) { window.location.href = '/doctorlog'; return; }
    const doc = JSON.parse(stored);
    setDoctor(doc);
    axios.get(`${API}/doctor-patients/${encodeURIComponent(doc.name)}`)
      .then(r => setMyPatients(r.data))
      .catch(console.error);
  }, []);

  const logout = () => { localStorage.removeItem('doctor'); window.location.href = '/doctorlog'; };

  if (!doctor) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

  const admitted   = myPatients.filter(p => p.status === 'Admitted').length;
  const discharged = myPatients.filter(p => p.status === 'Discharged').length;

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        {/* Sidebar */}
        <div className="col-2 bg-dark p-0 d-flex flex-column">
          <div className="p-3 border-bottom border-secondary">
            <span className="text-white fw-bold">Doctor Panel</span>
          </div>
          <nav className="nav flex-column p-2 flex-grow-1">
            {[['dashboard','📊 Dashboard'],['patients','🧑‍🦽 My Patients'],['profile','👤 Profile']].map(([key,label]) => (
              <a key={key} className="nav-link py-2 px-2 rounded mb-1"
                 style={{ cursor:'pointer', color: tab===key ? '#fff' : '#adb5bd', background: tab===key ? 'rgba(255,255,255,0.1)' : '' }}
                 onClick={() => setTab(key)}>
                {label}
              </a>
            ))}
          </nav>
          <div className="p-3">
            <div className="text-muted small mb-2">Dr. {doctor.name}</div>
            <button className="btn btn-outline-danger btn-sm w-100" onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Main */}
        <div className="col p-0">
          <div className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">
                {tab==='dashboard'&&'Dashboard'}
                {tab==='patients' &&'My Patients'}
                {tab==='profile'  &&'My Profile'}
              </h5>
              <small className="text-muted">Welcome, Dr. {doctor.name}!</small>
            </div>
            <span className="badge bg-success">{doctor.dept}</span>
          </div>

          <div className="p-4">

            {/* ── DASHBOARD ── */}
            {tab === 'dashboard' && (
              <>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="card text-white bg-primary text-center p-3">
                      <h6>Total My Patients</h6><h2>{myPatients.length}</h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-white bg-success text-center p-3">
                      <h6>Currently Admitted</h6><h2>{admitted}</h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-white bg-secondary text-center p-3">
                      <h6>Discharged</h6><h2>{discharged}</h2>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">My Recent Patients</div>
                  <div className="card-body p-0">
                    <PatientTable rows={myPatients.slice(0,6)} />
                  </div>
                </div>
              </>
            )}

            {/* ── MY PATIENTS ── */}
            {tab === 'patients' && (
              <div className="card">
                <div className="card-header">All My Patients ({myPatients.length})</div>
                <div className="card-body p-0">
                  <PatientTable rows={myPatients} />
                </div>
              </div>
            )}

            {/* ── PROFILE ── */}
            {tab === 'profile' && (
              <div className="row justify-content-center">
                <div className="col-md-5">
                  <div className="card">
                    <div className="card-header bg-success text-white text-center">
                      <h5 className="mb-0">Dr. {doctor.name}</h5>
                      <small>{doctor.specialization}</small>
                    </div>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Doctor ID</span><span>{doctor.id}</span></li>
                      <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Department</span><span>{doctor.dept}</span></li>
                      <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Email</span><span>{doctor.email}</span></li>
                      <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Total Patients</span><span>{myPatients.length}</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientTable({ rows }) {
  if (!rows.length) return <p className="text-muted text-center py-3">No patients assigned yet.</p>;
  return (
    <table className="table table-hover table-sm mb-0">
      <thead className="table-light">
        <tr><th>ID</th><th>Name</th><th>Age</th><th>Disease</th><th>Admission</th><th>Status</th></tr>
      </thead>
      <tbody>
        {rows.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td><td>{p.name}</td><td>{p.age}</td><td>{p.disease}</td>
            <td>{p.admission?.slice(0,10)}</td>
            <td><span className={`badge ${p.status==='Admitted'?'bg-success':'bg-secondary'}`}>{p.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DoctorPage;