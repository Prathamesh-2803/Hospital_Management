import { useState, useEffect } from 'react';
import '../style/adminpage.css';
import axios from 'axios';

const API = 'http://localhost:5000';

const blankDoc = { id:'', name:'', specialization:'', dept:'Cardiology', phone:'', email:'', status:'Active', password:'' };
const blankPat = { id:'', name:'', age:'', disease:'', doctor:'', admission:'', status:'Admitted' };
const blankStf = { id:'', name:'', role:'Nurse', phone:'', shift:'Morning', status:'Active' };

function AdminPage() {
  const [page, setPage] = useState('dashboard');

  const [doctors,  setDoctors]  = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff,    setStaff]    = useState([]);
  const [patUsers, setPatUsers] = useState([]);

  const [docSearch, setDocSearch] = useState('');

  // doctor modal
  const [showDoc,  setShowDoc]  = useState(false);
  const [editDoc,  setEditDoc]  = useState(false);
  const [editDocId,setEditDocId]= useState(null);
  const [docForm,  setDocForm]  = useState(blankDoc);

  // patient modal
  const [showPat,  setShowPat]  = useState(false);
  const [editPat,  setEditPat]  = useState(false);
  const [editPatId,setEditPatId]= useState(null);
  const [patForm,  setPatForm]  = useState(blankPat);

  // staff modal
  const [showStf,  setShowStf]  = useState(false);
  const [editStf,  setEditStf]  = useState(false);
  const [editStfId,setEditStfId]= useState(null);
  const [stfForm,  setStfForm]  = useState(blankStf);

  useEffect(() => { loadAll(); }, []);

  const loadAll = () => {
    axios.get(`${API}/doctors`).then(r => setDoctors(r.data));
    axios.get(`${API}/patients`).then(r => setPatients(r.data));
    axios.get(`${API}/staff`).then(r => setStaff(r.data));
    axios.get(`${API}/patient-users`).then(r => setPatUsers(r.data));
  };

  // ── Doctor ──
  const openAddDoc = () => { setDocForm({...blankDoc}); setEditDoc(false); setShowDoc(true); };
  const openEditDoc = (d) => {
    setEditDocId(d.id);
    setDocForm({ id:d.id, name:d.name, specialization:d.specialization, dept:d.dept, phone:d.phone, email:d.email, status:d.status, password:'' });
    setEditDoc(true); setShowDoc(true);
  };
  const saveDoc = () => {
    if (!editDoc && !docForm.password) { alert('Password is required!'); return; }
    const payload = editDoc
      ? { name:docForm.name, specialization:docForm.specialization, dept:docForm.dept, phone:docForm.phone, email:docForm.email, status:docForm.status }
      : docForm;
    const req = editDoc ? axios.put(`${API}/update-doctor/${editDocId}`, payload) : axios.post(`${API}/add-doctor`, payload);
    req.then(() => { axios.get(`${API}/doctors`).then(r => setDoctors(r.data)); setShowDoc(false); })
       .catch(err => alert(err.response?.data?.message || 'Failed'));
  };
  const delDoc = (id) => { if (!window.confirm('Delete?')) return; axios.delete(`${API}/delete-doctor/${id}`).then(() => setDoctors(p => p.filter(d => d.id !== id))); };

  const filteredDocs = doctors.filter(d => d.name?.toLowerCase().includes(docSearch.toLowerCase()));

  // ── Patient ──
  const openAddPat = () => { setPatForm({...blankPat}); setEditPat(false); setShowPat(true); };
  const openEditPat = (p) => { setEditPatId(p.id); setPatForm({...p, admission:p.admission?.slice(0,10)}); setEditPat(true); setShowPat(true); };
  const savePat = () => {
    if (!patForm.id || !patForm.name) { alert('ID and Name required'); return; }
    const payload = { ...patForm, id:String(patForm.id), age:Number(patForm.age)||0 };
    const req = editPat ? axios.put(`${API}/update-patient/${editPatId}`, payload) : axios.post(`${API}/add-patient`, payload);
    req.then(() => { axios.get(`${API}/patients`).then(r => setPatients(r.data)); setShowPat(false); })
       .catch(err => alert(err.response?.data?.error || 'Failed'));
  };
  const delPat = (id) => { if (!window.confirm('Delete?')) return; axios.delete(`${API}/delete-patient/${id}`).then(() => setPatients(p => p.filter(x => x.id !== id))); };

  // ── Staff ──
  const openAddStf = () => { setStfForm({...blankStf}); setEditStf(false); setShowStf(true); };
  const openEditStf = (s) => { setEditStfId(s.id); setStfForm({...s}); setEditStf(true); setShowStf(true); };
  const saveStf = () => {
    if (!stfForm.id || !stfForm.name) { alert('ID and Name required'); return; }
    const req = editStf ? axios.put(`${API}/update-staff/${editStfId}`, stfForm) : axios.post(`${API}/add-staff`, stfForm);
    req.then(() => { axios.get(`${API}/staff`).then(r => setStaff(r.data)); setShowStf(false); });
  };
  const delStf = (id) => { if (!window.confirm('Delete?')) return; axios.delete(`${API}/delete-staff/${id}`).then(() => setStaff(p => p.filter(s => s.id !== id))); };

  const delPatUser = (id) => { if (!window.confirm('Remove?')) return; axios.delete(`${API}/patient-users/${id}`).then(() => setPatUsers(p => p.filter(u => u.id !== id))); };

  const logout = () => { localStorage.removeItem('users'); window.location.href = '/adminlog'; };

  const fmtDate = (dt) => dt ? new Date(dt).toLocaleString('en-IN') : 'Never';

  const navLinks = [
    ['dashboard',        '📊 Dashboard'],
    ['doctor',          '🧑‍⚕️ Doctors'],
    ['patient',         '🧑‍🦽 Patients'],
    ['staff',           '👨‍💼 Staff'],
    ['patientAccounts', '🔑 Patient Accounts'],
  ];

  return (
    <div className="container-fluid admin-dashboard">
      <div className="row min-vh-100">

        {/* Sidebar */}
        <div className="col-2 bg-dark p-0 d-flex flex-column">
          <div className="p-3 border-bottom border-secondary">
            <span className="text-white fw-bold">⚕️ Admin Panel</span>
          </div>
          <nav className="nav flex-column p-2 flex-grow-1">
            <small className="text-secondary px-2 mt-2 text-uppercase" style={{fontSize:'10px',letterSpacing:'1px'}}>Menu</small>
            {navLinks.map(([key, label]) => (
              <a key={key} className="nav-link py-2 px-2 rounded mb-1"
                 style={{ cursor:'pointer', color: page===key ? '#fff' : '#adb5bd', background: page===key ? 'rgba(255,255,255,0.1)' : '' }}
                 onClick={() => setPage(key)}>
                {label}
              </a>
            ))}
          </nav>
          <div className="p-3">
            <button className="btn btn-outline-danger btn-sm w-100" onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Main */}
        <div className="col p-0">
          <div className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">
                {page==='dashboard'       && 'Dashboard'}
                {page==='doctor'         && 'Manage Doctors'}
                {page==='patient'        && 'Manage Patients'}
                {page==='staff'          && 'Manage Staff'}
                {page==='patientAccounts'&& 'Patient Accounts'}
              </h5>
              <small className="text-muted">Welcome back, Admin</small>
            </div>
            <span className="badge bg-primary">Admin</span>
          </div>

          <div className="p-4">

            {/* ── DASHBOARD ── */}
            {page === 'dashboard' && (
              <>
                <div className="row g-3 mb-4">
                  {[
                    { label:'Doctors',         val:doctors.length,    bg:'bg-primary' },
                    { label:'Patients',         val:patients.length,   bg:'bg-success' },
                    { label:'Staff',            val:staff.length,      bg:'bg-warning' },
                    { label:'Patient Accounts', val:patUsers.length,   bg:'bg-info'    },
                  ].map(c => (
                    <div className="col-md-3" key={c.label}>
                      <div className={`card text-white ${c.bg}`}>
                        <div className="card-body text-center">
                          <h6 className="card-title">{c.label}</h6>
                          <h2 className="mb-0">{c.val}</h2>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card mb-3">
                  <div className="card-header d-flex justify-content-between">
                    <span>Recent Patient Logins</span>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setPage('patientAccounts')}>View All</button>
                  </div>
                  <div className="card-body p-0">
                    <table className="table table-sm table-hover mb-0">
                      <thead className="table-light"><tr><th>ID</th><th>Name</th><th>Email</th><th>Last Login</th></tr></thead>
                      <tbody>
                        {patUsers.slice(0,5).map(u => (
                          <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td><small className="text-muted">{fmtDate(u.last_login)}</small></td></tr>
                        ))}
                        {!patUsers.length && <tr><td colSpan="4" className="text-center text-muted">No patient accounts yet</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">Recent Hospital Patients</div>
                  <div className="card-body p-0">
                    <table className="table table-sm table-hover mb-0">
                      <thead className="table-light"><tr><th>ID</th><th>Name</th><th>Disease</th><th>Doctor</th><th>Status</th></tr></thead>
                      <tbody>
                        {patients.slice(0,5).map(p => (
                          <tr key={p.id}>
                            <td>{p.id}</td><td>{p.name}</td><td>{p.disease}</td><td>{p.doctor}</td>
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
            {page === 'doctor' && (
              <div className="doctor-container">
                <div className="doctor-header">
                  <h4>Manage Doctors</h4>
                  <div className="doctor-actions">
                    <input type="text" className="doctor-search" placeholder="Search by name..."
                      value={docSearch} onChange={e => setDocSearch(e.target.value)} />
                    <button className="add-btn" onClick={openAddDoc}>+ Add Doctor</button>
                  </div>
                </div>
                <div className="doctor-table">
                  <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>Dept</th><th>Phone</th><th>Last Login</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {!filteredDocs.length
                        ? <tr><td colSpan="8" className="no-data">No doctors found.</td></tr>
                        : filteredDocs.map(d => (
                          <tr key={d.id}>
                            <td>{d.id}</td><td>{d.name}</td><td>{d.specialization}</td><td>{d.dept}</td><td>{d.phone}</td>
                            <td><small className="text-muted">{fmtDate(d.last_login)}</small></td>
                            <td><span className={d.status==='Active'?'status active':d.status==='On Leave'?'status leave':'status inactive'}>{d.status}</span></td>
                            <td className="action-btns">
                              <button className="edit-btn"   onClick={() => openEditDoc(d)}>✏️ Edit</button>
                              <button className="delete-btn" onClick={() => delDoc(d.id)}>🗑 Delete</button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── PATIENTS ── */}
            {page === 'patient' && (
              <div className="doctor-container">
                <div className="doctor-header">
                  <h4>Manage Patients</h4>
                  <button className="add-btn" onClick={openAddPat}>+ Add Patient</button>
                </div>
                <div className="doctor-table">
                  <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Disease</th><th>Doctor</th><th>Admission</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {!patients.length
                        ? <tr><td colSpan="8" className="no-data">No patients found.</td></tr>
                        : patients.map(p => (
                          <tr key={p.id}>
                            <td>{p.id}</td><td>{p.name}</td><td>{p.age}</td>
                            <td>{p.disease}</td><td>{p.doctor}</td><td>{p.admission?.slice(0,10)}</td>
                            <td><span className={p.status==='Admitted'?'status active':'status inactive'}>{p.status}</span></td>
                            <td className="action-btns">
                              <button className="edit-btn"   onClick={() => openEditPat(p)}>✏️ Edit</button>
                              <button className="delete-btn" onClick={() => delPat(p.id)}>🗑 Delete</button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── STAFF ── */}
            {page === 'staff' && (
              <div className="doctor-container">
                <div className="doctor-header">
                  <h4>Manage Staff</h4>
                  <button className="add-btn" onClick={openAddStf}>+ Add Staff</button>
                </div>
                <div className="doctor-table">
                  <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Phone</th><th>Shift</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {!staff.length
                        ? <tr><td colSpan="7" className="no-data">No staff found.</td></tr>
                        : staff.map(s => (
                          <tr key={s.id}>
                            <td>{s.id}</td><td>{s.name}</td><td>{s.role}</td>
                            <td>{s.phone}</td><td>{s.shift}</td>
                            <td><span className={s.status==='Active'?'status active':'status inactive'}>{s.status}</span></td>
                            <td className="action-btns">
                              <button className="edit-btn"   onClick={() => openEditStf(s)}>✏️ Edit</button>
                              <button className="delete-btn" onClick={() => delStf(s.id)}>🗑 Delete</button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── PATIENT ACCOUNTS ── */}
            {page === 'patientAccounts' && (
              <div className="doctor-container">
                <div className="doctor-header">
                  <h4>Patient Accounts</h4>
                  <small className="text-muted align-self-center">Patients registered via the patient portal</small>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-4"><div className="card text-center p-3 border-primary"><h6 className="text-muted">Total Registered</h6><h3 className="text-primary">{patUsers.length}</h3></div></div>
                  <div className="col-md-4"><div className="card text-center p-3 border-success"><h6 className="text-muted">Logged In Today</h6><h3 className="text-success">{patUsers.filter(p=>{const d=p.last_login;return d&&new Date(d).toDateString()===new Date().toDateString();}).length}</h3></div></div>
                  <div className="col-md-4"><div className="card text-center p-3 border-warning"><h6 className="text-muted">Never Logged In</h6><h3 className="text-warning">{patUsers.filter(p=>!p.last_login).length}</h3></div></div>
                </div>
                <div className="doctor-table">
                  <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Phone</th><th>Last Login</th><th>Action</th></tr></thead>
                    <tbody>
                      {!patUsers.length
                        ? <tr><td colSpan="7" className="no-data">No patient accounts yet. Patients must register via the Patient portal.</td></tr>
                        : patUsers.map(u => (
                          <tr key={u.id}>
                            <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td>
                            <td>{u.age||'—'}</td><td>{u.phone||'—'}</td>
                            <td><small className={u.last_login?'text-success':'text-muted'}>{fmtDate(u.last_login)}</small></td>
                            <td className="action-btns">
                              <button className="delete-btn" onClick={() => delPatUser(u.id)}>🗑 Remove</button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Doctor Modal ── */}
      {showDoc && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h4>{editDoc ? '✏️ Edit Doctor' : '➕ Add Doctor'}</h4>
              <button onClick={() => setShowDoc(false)}>✖</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Doctor ID</label>
                <input value={docForm.id} onChange={e => setDocForm(p=>({...p,id:e.target.value}))} placeholder="e.g. D005" disabled={editDoc} />
              </div>
              <div className="form-group"><label>Full Name</label>
                <input value={docForm.name} onChange={e => setDocForm(p=>({...p,name:e.target.value}))} placeholder="Dr. Name" />
              </div>
              <div className="form-group"><label>Specialization</label>
                <input value={docForm.specialization} onChange={e => setDocForm(p=>({...p,specialization:e.target.value}))} placeholder="e.g. Cardiologist" />
              </div>
              <div className="form-group"><label>Department</label>
                <select value={docForm.dept} onChange={e => setDocForm(p=>({...p,dept:e.target.value}))}>
                  <option>Cardiology</option><option>Neurology</option><option>Orthopedic</option><option>Pediatrics</option><option>General</option>
                </select>
              </div>
              <div className="form-group"><label>Phone</label>
                <input value={docForm.phone} onChange={e => setDocForm(p=>({...p,phone:e.target.value}))} placeholder="9876543210" />
              </div>
              <div className="form-group"><label>Email</label>
                <input value={docForm.email} onChange={e => setDocForm(p=>({...p,email:e.target.value}))} placeholder="doctor@hospital.com" />
              </div>
              {!editDoc && (
                <div className="form-group"><label>Login Password *</label>
                  <input type="password" value={docForm.password} onChange={e => setDocForm(p=>({...p,password:e.target.value}))} placeholder="Set login password" />
                </div>
              )}
              <div className="form-group full-width"><label>Status</label>
                <select value={docForm.status} onChange={e => setDocForm(p=>({...p,status:e.target.value}))}>
                  <option>Active</option><option>On Leave</option><option>InActive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowDoc(false)}>Cancel</button>
              <button className="save-btn"   onClick={saveDoc}>{editDoc ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Patient Modal ── */}
      {showPat && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h4>{editPat ? '✏️ Edit Patient' : '➕ Add Patient'}</h4>
              <button onClick={() => setShowPat(false)}>✖</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Patient ID</label>
                <input value={patForm.id} onChange={e => setPatForm(p=>({...p,id:e.target.value}))} disabled={editPat} />
              </div>
              <div className="form-group"><label>Name</label>
                <input value={patForm.name} onChange={e => setPatForm(p=>({...p,name:e.target.value}))} />
              </div>
              <div className="form-group"><label>Age</label>
                <input type="number" value={patForm.age} onChange={e => setPatForm(p=>({...p,age:e.target.value}))} />
              </div>
              <div className="form-group"><label>Disease</label>
                <input value={patForm.disease} onChange={e => setPatForm(p=>({...p,disease:e.target.value}))} />
              </div>
              <div className="form-group"><label>Doctor</label>
                <select value={patForm.doctor} onChange={e => setPatForm(p=>({...p,doctor:e.target.value}))}>
                  <option value="">— Select Doctor —</option>
                  {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Admission Date</label>
                <input type="date" value={patForm.admission} onChange={e => setPatForm(p=>({...p,admission:e.target.value}))} />
              </div>
              <div className="form-group full-width"><label>Status</label>
                <select value={patForm.status} onChange={e => setPatForm(p=>({...p,status:e.target.value}))}>
                  <option>Admitted</option><option>Discharged</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowPat(false)}>Cancel</button>
              <button className="save-btn"   onClick={savePat}>{editPat ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Staff Modal ── */}
      {showStf && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h4>{editStf ? '✏️ Edit Staff' : '➕ Add Staff'}</h4>
              <button onClick={() => setShowStf(false)}>✖</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>ID</label>
                <input value={stfForm.id} onChange={e => setStfForm(p=>({...p,id:e.target.value}))} disabled={editStf} />
              </div>
              <div className="form-group"><label>Name</label>
                <input value={stfForm.name} onChange={e => setStfForm(p=>({...p,name:e.target.value}))} />
              </div>
              <div className="form-group"><label>Role</label>
                <select value={stfForm.role} onChange={e => setStfForm(p=>({...p,role:e.target.value}))}>
                  <option>Nurse</option><option>Receptionist</option><option>Lab Staff</option><option>Technician</option>
                </select>
              </div>
              <div className="form-group"><label>Phone</label>
                <input value={stfForm.phone} onChange={e => setStfForm(p=>({...p,phone:e.target.value}))} />
              </div>
              <div className="form-group"><label>Shift</label>
                <select value={stfForm.shift} onChange={e => setStfForm(p=>({...p,shift:e.target.value}))}>
                  <option>Morning</option><option>Afternoon</option><option>Night</option>
                </select>
              </div>
              <div className="form-group full-width"><label>Status</label>
                <select value={stfForm.status} onChange={e => setStfForm(p=>({...p,status:e.target.value}))}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowStf(false)}>Cancel</button>
              <button className="save-btn"   onClick={saveStf}>{editStf ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;