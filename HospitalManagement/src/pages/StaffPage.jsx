import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://hospital-backend-xxxx.onrender.com';

function StaffPage() {
  const [user,     setUser]     = useState(null);
  const [doctors,  setDoctors]  = useState([]);
  const [patients, setPatients] = useState([]);
  const [tab,      setTab]      = useState('dashboard');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('users');
    if (!stored) { window.location.href = '/stafflog'; return; }
    setUser(JSON.parse(stored));
    axios.get(`${API}/doctors`).then(r => setDoctors(r.data)).catch(console.error);
    axios.get(`${API}/patients`).then(r => setPatients(r.data)).catch(console.error);
  }, []);

  const logout = () => { localStorage.removeItem('users'); window.location.href = '/stafflog'; };

  if (!user) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

  const today = new Date().toDateString();
  const todayCount = patients.filter(p => p.admission && new Date(p.admission).toDateString() === today).length;

  const filteredDocs = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.dept?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPats = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.doctor?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        {/* Sidebar */}
        <div className="col-2 bg-dark p-0 d-flex flex-column">
          <div className="p-3 border-bottom border-secondary">
            <span className="text-white fw-bold">Staff Panel</span>
          </div>
          <nav className="nav flex-column p-2 flex-grow-1">
            {[['dashboard','📊 Dashboard'],['doctors','🧑‍⚕️ Doctors'],['patients','🧑‍🦽 Patients']].map(([key,label]) => (
              <a key={key} className="nav-link py-2 px-2 rounded mb-1"
                 style={{ cursor:'pointer', color: tab===key ? '#fff' : '#adb5bd', background: tab===key ? 'rgba(255,255,255,0.1)' : '' }}
                 onClick={() => { setTab(key); setSearch(''); }}>
                {label}
              </a>
            ))}
          </nav>
          <div className="p-3">
            <div className="text-muted small mb-2">{user.email}</div>
            <button className="btn btn-outline-danger btn-sm w-100" onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Main */}
        <div className="col p-0">
          <div className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">
                {tab==='dashboard'&&'Dashboard'}
                {tab==='doctors'  &&'Doctors Directory'}
                {tab==='patients' &&'Patients List'}
              </h5>
              <small className="text-muted">Read-only view</small>
            </div>
            <span className="badge bg-warning text-dark">Staff</span>
          </div>

          <div className="p-4">

            {/* ── DASHBOARD ── */}
            {tab === 'dashboard' && (
              <>
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="card text-white bg-primary text-center p-3">
                      <h6>Active Doctors</h6><h2>{doctors.filter(d=>d.status==='Active').length}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-white bg-success text-center p-3">
                      <h6>Total Patients</h6><h2>{patients.length}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-white bg-warning text-center p-3">
                      <h6>Today's Admissions</h6><h2>{todayCount}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-white bg-danger text-center p-3">
                      <h6>On Leave</h6><h2>{doctors.filter(d=>d.status==='On Leave').length}</h2>
                    </div>
                  </div>
                </div>

                {/* dept count */}
                <div className="card mb-3">
                  <div className="card-header">Doctors by Department</div>
                  <div className="card-body">
                    <div className="d-flex gap-3 flex-wrap">
                      {['Cardiology','Neurology','Orthopedic','Pediatrics','General'].map(dept => (
                        <div key={dept} className="text-center border rounded p-2" style={{minWidth:'90px'}}>
                          <div className="fw-bold">{doctors.filter(d=>d.dept===dept).length}</div>
                          <small className="text-muted">{dept}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">Recent Admissions</div>
                  <div className="card-body p-0">
                    <table className="table table-sm table-hover mb-0">
                      <thead className="table-light">
                        <tr><th>Name</th><th>Disease</th><th>Doctor</th><th>Admission</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {patients.slice(0,6).map(p => (
                          <tr key={p.id}>
                            <td>{p.name}</td><td>{p.disease}</td><td>{p.doctor}</td>
                            <td>{p.admission?.slice(0,10)}</td>
                            <td><span className={`badge ${p.status==='Admitted'?'bg-success':'bg-secondary'}`}>{p.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ── DOCTORS ── */}
            {tab === 'doctors' && (
              <>
                <input type="text" className="form-control mb-3" style={{maxWidth:'360px'}}
                  placeholder="Search by name or department..." value={search} onChange={e => setSearch(e.target.value)} />
                <div className="card">
                  <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr><th>ID</th><th>Name</th><th>Specialization</th><th>Dept</th><th>Phone</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {filteredDocs.map(d => (
                          <tr key={d.id}>
                            <td>{d.id}</td><td>{d.name}</td><td>{d.specialization}</td>
                            <td>{d.dept}</td><td>{d.phone}</td>
                            <td><span className={`badge ${d.status==='Active'?'bg-success':d.status==='On Leave'?'bg-warning text-dark':'bg-secondary'}`}>{d.status}</span></td>
                          </tr>
                        ))}
                        {!filteredDocs.length && <tr><td colSpan="6" className="text-center text-muted">No doctors found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ── PATIENTS ── */}
            {tab === 'patients' && (
              <>
                <input type="text" className="form-control mb-3" style={{maxWidth:'360px'}}
                  placeholder="Search by patient or doctor name..." value={search} onChange={e => setSearch(e.target.value)} />
                <div className="card">
                  <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr><th>ID</th><th>Name</th><th>Age</th><th>Disease</th><th>Doctor</th><th>Admission</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {filteredPats.map(p => (
                          <tr key={p.id}>
                            <td>{p.id}</td><td>{p.name}</td><td>{p.age}</td>
                            <td>{p.disease}</td><td>{p.doctor}</td><td>{p.admission?.slice(0,10)}</td>
                            <td><span className={`badge ${p.status==='Admitted'?'bg-success':'bg-secondary'}`}>{p.status}</span></td>
                          </tr>
                        ))}
                        {!filteredPats.length && <tr><td colSpan="7" className="text-center text-muted">No patients found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffPage;