import { useNavigate } from 'react-router-dom';

function Choice() {
  const navigate = useNavigate();

  const roles = [
    { title: 'Admin',   icon: '🛡️', path: '/adminlog',   color: 'primary',  desc: 'Manage doctors, patients and staff' },
    { title: 'Doctor',  icon: '🧑‍⚕️', path: '/doctorlog',  color: 'success',  desc: 'View your patients and schedule' },
    { title: 'Staff',   icon: '👨‍💼', path: '/stafflog',   color: 'warning',  desc: 'View hospital data and records' },
    { title: 'Patient', icon: '🏥', path: '/patientlog', color: 'info',     desc: 'Browse doctors and view profiles' },
  ];

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h2>Hospital Management System</h2>
        <p className="text-muted">Select your role to continue</p>
      </div>

      <div className="row justify-content-center g-4">
        {roles.map((r) => (
          <div className="col-md-3 col-sm-6" key={r.title}>
            <div
              className="card text-center h-100 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(r.path)}
            >
              <div className={`card-header bg-${r.color} text-white`}>
                <span style={{ fontSize: '36px' }}>{r.icon}</span>
              </div>
              <div className="card-body">
                <h5 className="card-title">{r.title}</h5>
                <p className="card-text text-muted small">{r.desc}</p>
                <button className={`btn btn-outline-${r.color} btn-sm`}>
                  Login as {r.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Choice;