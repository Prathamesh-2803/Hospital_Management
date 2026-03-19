import { useState, useEffect } from "react";
import '../style/adminpage.css';
import axios from "axios";

// ✅ KEY FIX: defaultForm is OUTSIDE the component so it's always the same object
const defaultForm = {
    id: "",
    name: "",
    specialization: "",
    dept: "Cardiology",
    phone: "",
    email: "",
    status: "Active"
};

function AdminPage() {
    const [activePage, setActivePage] = useState("dashboard");

    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");

    const [patients] = useState([]);
    const [staff] = useState([]);
    const [appointments] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState(defaultForm);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // FETCH DOCTORS
    useEffect(() => { fetchDoctors(); }, []);

    const fetchDoctors = () => {
        axios.get("http://localhost:5000/doctors")
            .then((res) => setDoctors(res.data))
            .catch((err) => console.log(err));
    };

    // OPEN ADD MODAL
    const addDoctor = () => {
        setFormData({ ...defaultForm });
        setIsEditing(false);
        setShowModal(true);
    };

    // OPEN EDIT MODAL — load doctor data directly into formData
    const editDoctor = (doc) => {
        setEditingId(doc.id); // ✅ store ID separately so it's never lost
        setFormData({
            id: doc.id,
            name: doc.name,
            specialization: doc.specialization,
            dept: doc.dept,
            phone: doc.phone,
            email: doc.email,
            status: doc.status
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const saveDoctor = () => {
        if (isEditing) {
            console.log("Sending PUT to update-doctor, editingId =", editingId);
            axios.put(`http://localhost:5000/update-doctor/${editingId}`, {
                name: formData.name,
                specialization: formData.specialization,
                dept: formData.dept,
                phone: formData.phone,
                email: formData.email,
                status: formData.status
            })
                .then((res) => {
                    console.log("Updated:", res.data);
                    fetchDoctors();
                    setShowModal(false);
                    setIsEditing(false);
                    setEditingId(null);
                    setFormData({ ...defaultForm });
                })
                .catch((err) => {
                    console.log("Update error:", err);
                    alert("Update failed. Check console.");
                });
        } else {
            axios.post("http://localhost:5000/add-doctor", formData)
                .then((res) => {
                    console.log("Added:", res.data);
                    fetchDoctors();
                    setShowModal(false);
                    setFormData({ ...defaultForm });
                })
                .catch((err) => {
                    console.log("Add error:", err);
                    alert("Add failed. Check console.");
                });
        }
    };

    // DELETE DOCTOR
    const deleteDoctor = (id) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;
        axios.delete(`http://localhost:5000/delete-doctor/${id}`)
            .then(() => fetchDoctors())
            .catch((err) => console.log(err));
    };

    // SEARCH FILTER
    const filteredDoctors = doctors.filter((doc) =>
        doc.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="container-fluid admin-dashboard">
                <div className="row min-vh-100">

                    {/* ── Sidebar ── */}
                    <div className="col-2 col-sm-3 col-xl-2 bg-dark p-0">
                        <nav className="navbar bg-dark border-bottom border-white" data-bs-theme="dark">
                            <a className="navbar-brand ms-3 admin-panel" href="#">Admin Panel</a>
                        </nav>

                        <nav className="nav flex-column border-bottom border-white px-3">
                            <h6 className="text-light mt-3">Main Menu</h6>
                            <a className="nav-link text-white" onClick={() => setActivePage("dashboard")}>📊 Dashboard</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("doctor")}>🧑‍⚕️ Doctor</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("patient")}>🧑‍🦽 Patient</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("staff")}>👨‍💼 Staff</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("appointment")}>📅 Appointments</a>
                            <a className="nav-link text-white" onClick={() => setActivePage("department")}>🏢 Departments</a>
                            <a className="nav-link text-white" href="#">💳 Billing</a>
                            <a className="nav-link text-white" href="#">📈 Reports</a>
                            <a className="nav-link text-white" href="#">⚙️ Settings</a>
                        </nav>

                        <div className="p-3">
                            <button className="btn text-light admin-out w-100">
                                Admin <br />
                                <span className="logout text-danger">Logout →</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Main Content ── */}
                    <div className="col-10 col-sm-9 col-xl-10 p-0">

                        {/* Top Navbar */}
                        <nav className="navbar navbar-expand-lg admin-nav px-4 py-3">
                            <div className="container-fluid">
                                <div>
                                    <h3 className="m-0">
                                        {activePage === "dashboard" && "Dashboard"}
                                        {activePage === "doctor" && "Manage Doctors"}
                                    </h3>
                                    <small>Welcome back, Admin!</small>
                                </div>
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a href="#" className="nav-link text-white">Home</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        {/* ── DASHBOARD ── */}
                        {activePage === "dashboard" && (
                            <div className="container-fluid px-4 mt-4">
                                <div className="row g-4">
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Doctors</h5>
                                            <h2>{doctors.length}</h2>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Patients</h5>
                                            <h2>{patients.length}</h2>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Staff</h5>
                                            <h2>{staff.length}</h2>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card text-center shadow-sm p-3">
                                            <h5>Total Appointments</h5>
                                            <h2>{appointments.length}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── DOCTOR PAGE ── */}
                        {activePage === "doctor" && (
                            <div className="doctor-container">

                                <div className="doctor-header">
                                    <h4>👨‍⚕️ Manage Doctors</h4>
                                    <div className="doctor-actions">
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            className="doctor-search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <button className="add-btn" onClick={addDoctor}>+ Add</button>
                                    </div>
                                </div>

                                <div className="doctor-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>NAME</th>
                                                <th>SPECIALIZATION</th>
                                                <th>DEPARTMENT</th>
                                                <th>PHONE</th>
                                                <th>STATUS</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDoctors.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="no-data">No doctors found.</td>
                                                </tr>
                                            ) : (
                                                filteredDoctors.map((doc) => (
                                                    <tr key={doc.id}>
                                                        <td>{doc.id}</td>
                                                        <td>{doc.name}</td>
                                                        <td>{doc.specialization}</td>
                                                        <td>{doc.dept}</td>
                                                        <td>{doc.phone}</td>
                                                        <td>
                                                            <span className={
                                                                doc.status === "Active" ? "status active" :
                                                                doc.status === "On Leave" ? "status leave" :
                                                                "status inactive"
                                                            }>
                                                                {doc.status}
                                                            </span>
                                                        </td>
                                                        <td className="action-btns">
                                                            <button className="edit-btn" onClick={() => editDoctor(doc)}>
                                                                ✏️ Edit
                                                            </button>
                                                            <button className="delete-btn" onClick={() => deleteDoctor(doc.id)}>
                                                                🗑 Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── MODAL: Add / Edit Doctor ── */}
                        {showModal && (
                            <div className="modal-overlay">
                                <div className="modal-box">

                                    <div className="modal-header">
                                        <h4>{isEditing ? "✏️ Edit Doctor" : "➕ Add Doctor"}</h4>
                                        <button onClick={() => setShowModal(false)}>✖</button>
                                    </div>

                                    <div className="modal-body">

                                        <div className="form-group">
                                            <label>Doctor ID</label>
                                            <input
                                                name="id"
                                                placeholder="e.g. D005"
                                                value={formData.id}
                                                onChange={handleChange}
                                                disabled={isEditing}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input
                                                name="name"
                                                placeholder="Dr. Full Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Specialization</label>
                                            <input
                                                name="specialization"
                                                placeholder="e.g. Cardiologist"
                                                value={formData.specialization}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Department</label>
                                            <select name="dept" value={formData.dept} onChange={handleChange}>
                                                <option value="Cardiology">Cardiology</option>
                                                <option value="Neurology">Neurology</option>
                                                <option value="Orthopedic">Orthopedic</option>
                                                <option value="Pediatrics">Pediatrics</option>
                                                <option value="General">General</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Phone</label>
                                            <input
                                                name="phone"
                                                placeholder="9876543210"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                name="email"
                                                placeholder="doctor@hospital.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Status</label>
                                            <select name="status" value={formData.status} onChange={handleChange}>
                                                <option value="Active">Active</option>
                                                <option value="On Leave">On Leave</option>
                                                <option value="InActive">InActive</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div className="modal-footer">
                                        <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button className="save-btn" onClick={saveDoctor}>
                                            {isEditing ? "Update" : "Save"}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPage;