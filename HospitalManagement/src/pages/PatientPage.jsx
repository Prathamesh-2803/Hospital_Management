import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://hospital-backend-xxxx.onrender.com';

function PatientPage() {
  const [patient,  setPatient]  = useState(null);
  const [doctors,  setDoctors]  = useState([]);
  const [tab,      setTab]      = useState('doctors');
  const [search,   setSearch]   = useState('');
  const [deptFlt,  setDeptFlt]  = useState('All');
  const [ratings,  setRatings]  = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('patient');
    if (!stored) { window.location.href = '/patientlog'; return; }
    setPatient(JSON.parse(stored));
    axios.get(`${API}/doctors`).then(r => setDoctors(r.data)).catch(console.error);
    const saved = localStorage.getItem('patRatings');
    if (saved) setRatings(JSON.parse(saved));
  }, []);

  const logout = () => { localStorage.removeItem('patient'); window.location.href = '/patientlog'; };

  const rate = (id, stars) => {
    const next = { ...ratings, [id]: stars };
    setRatings(next);
    localStorage.setItem('patRatings', JSON.stringify(next));
  };

  if (!patient) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

  const depts = ['All', ...new Set(doctors.map(d => d.dept))];

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    return (d.name?.toLowerCase().includes(q) || d.specialization?.toLowerCase().includes(q))
      && (deptFlt === 'All' || d.dept === deptFlt);
  });

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        {/* Sidebar */}
        <div className="col-2 bg-dark p-0 d-flex flex-column">
          <div className="p-3 border-bottom border-secondary">
            <span className="text-white fw-bold">Patient Portal</span>
          </div>
          <nav className="nav flex-column p-2 flex-grow-1">
            {[['doctors','🧑‍⚕️ Find Doctors'],['profile','👤 My Profile']].map(([key,label]) => (
              <a key={key} className="nav-link py-2 px-2 rounded mb-1"
                 style={{ cursor:'pointer', color: tab===key ? '#fff' : '#adb5bd', background: tab===key ? 'rgba(255,255,255,0.1)' : '' }}
                 onClick={() => { setTab(key); setSelected(null); }}>
                {label}
              </a>
            ))}
          </nav>
          <div className="p-3">
            <div className="text-muted small mb-2">{patient.name}</div>
            <button className="btn btn-outline-danger btn-sm w-100" onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Main */}
        <div className="col p-0">
          <div className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">
                {tab==='doctors' && (selected ? `Dr. ${selected.name}` : 'Find a Doctor')}
                {tab==='profile' && 'My Profile'}
              </h5>
              <small className="text-muted">
                {tab==='doctors' && !selected && `${filtered.length} doctors available`}
                {tab==='profile' && `Welcome, ${patient.name}!`}
              </small>
            </div>
            <span className="badge bg-info text-dark">Patient</span>
          </div>

          <div className="p-4">

            {/* ── FIND DOCTORS ── */}
            {tab === 'doctors' && !selected && (
              <>
                {/* filters */}
                <div className="row g-2 mb-3">
                  <div className="col-md-5">
                    <input type="text" className="form-control" placeholder="Search by name or specialization..."
                      value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <select className="form-select" value={deptFlt} onChange={e => setDeptFlt(e.target.value)}>
                      {depts.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* doctor cards */}
                {!filtered.length
                  ? <p className="text-muted">No doctors found.</p>
                  : (
                    <div className="row g-3">
                      {filtered.map(doc => (
                        <div className="col-md-4" key={doc.id}>
                          <div className="card h-100">
                            <div className={`card-header ${doc.status==='Active'?'bg-success':'bg-secondary'} text-white`}>
                              {doc.name} — {doc.dept}
                            </div>
                            <div className="card-body">
                              <p className="mb-1"><strong>Specialization:</strong> {doc.specialization}</p>
                              <p className="mb-1"><strong>Phone:</strong> {doc.phone}</p>
                              <p className="mb-2">
                                <span className={`badge ${doc.status==='Active'?'bg-success':doc.status==='On Leave'?'bg-warning text-dark':'bg-secondary'}`}>
                                  {doc.status}
                                </span>
                              </p>
                              {/* Star rating */}
                              <div className="mb-2">
                                <small className="text-muted">Rate: </small>
                                {[1,2,3,4,5].map(n => (
                                  <span key={n} onClick={() => rate(doc.id, n)}
                                    style={{ cursor:'pointer', fontSize:'18px', color: n<=(ratings[doc.id]||0) ? '#ffc107' : '#dee2e6' }}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <button className="btn btn-outline-primary btn-sm w-100" onClick={() => setSelected(doc)}>
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </>
            )}

            {/* ── DOCTOR DETAIL ── */}
            {tab === 'doctors' && selected && (
              <>
                <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => setSelected(null)}>
                  ← Back to all doctors
                </button>
                <div className="row justify-content-center">
                  <div className="col-md-5">
                    <div className="card">
                      <div className={`card-header ${selected.status==='Active'?'bg-success':'bg-secondary'} text-white`}>
                        <h5 className="mb-0">Dr. {selected.name}</h5>
                        <small>{selected.specialization}</small>
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Department</span><span>{selected.dept}</span></li>
                        <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Phone</span><span>{selected.phone}</span></li>
                        <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Email</span><span>{selected.email}</span></li>
                        <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Status</span>
                          <span className={`badge ${selected.status==='Active'?'bg-success':selected.status==='On Leave'?'bg-warning text-dark':'bg-secondary'}`}>{selected.status}</span>
                        </li>
                      </ul>
                      <div className="card-body">
                        <p className="mb-1"><small className="text-muted">Your rating:</small></p>
                        {[1,2,3,4,5].map(n => (
                          <span key={n} onClick={() => rate(selected.id, n)}
                            style={{ cursor:'pointer', fontSize:'22px', color: n<=(ratings[selected.id]||0) ? '#ffc107' : '#dee2e6' }}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── PROFILE ── */}
            {tab === 'profile' && (
              <div className="row justify-content-center">
                <div className="col-md-5">
                  <div className="card">
                    <div className="card-header bg-info text-white text-center">
                      <h5 className="mb-0">{patient.name}</h5>
                      <small>Patient Account</small>
                    </div>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Patient ID</span><span>{patient.id}</span></li>
                      <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Email</span><span>{patient.email}</span></li>
                      <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Age</span><span>{patient.age || '—'}</span></li>
                      <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Phone</span><span>{patient.phone || '—'}</span></li>
                      <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Doctors Rated</span><span>{Object.keys(ratings).length}</span></li>
                    </ul>
                    {Object.keys(ratings).length > 0 && (
                      <div className="card-body">
                        <h6>Your Ratings</h6>
                        {Object.entries(ratings).map(([id, stars]) => {
                          const doc = doctors.find(d => d.id === id);
                          if (!doc) return null;
                          return (
                            <div key={id} className="d-flex justify-content-between align-items-center mb-1">
                              <small>Dr. {doc.name}</small>
                              <span style={{ color:'#ffc107' }}>{'★'.repeat(stars)}{'☆'.repeat(5-stars)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
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

export default PatientPage;