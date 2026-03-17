import { useState } from "react";
import '../style/adminpage.css'

function AdminPage() {
    const [activePage, setActivePage] = useState("dashboard");

    const [doctors] = useState([
        { id: "D001", name: "Dr. Anjali" },
        { id: "D002", name: "Dr. Rahul" }
    ]);

    const [patients] = useState([
        { id: "P001", name: "Ramesh" },
        { id: "P002", name: "Sunita" }
    ]);

    const [staff] = useState([
        { id: "S001", name: "Meena" },
        { id: "S002", name: "Rohit" }
    ]);

    const [appointments] = useState([
        { id: "A001" },
        { id: "A002" }
    ]);

    return (
        <>
            <div className="container-fluid admin-dashboard">
                <div className="row min-vh-100">

                    {/* Sidebar */}
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
                                <span className='logout text-danger'>Logout →</span>
                            </button>
                        </div>

                    </div>


                    {/* Main Content */}
                    <div className="col-10 col-sm-9 col-xl-10 p-0">

                        {/* Top Navbar */}
                        <nav className="navbar navbar-expand-lg admin-nav px-4 py-3">
                            <div className="container-fluid">

                                <div>
                                    <h3 className="m-0">Dashboard</h3>
                                    <small>Welcome back, Admin!</small>
                                </div>

                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a href="#" className="nav-link text-white">Home</a>
                                    </li>
                                </ul>

                            </div>
                        </nav>

                        {activePage === "dashboard" && (
                        <div className="container-fluid px-4 mt-4">
                            <div className="row g-4">

                                {/* Doctors */}
                                <div className="col-md-3">
                                    <div className="card text-center shadow-sm p-3">
                                        <h5>Total Doctors</h5>
                                        <h2>{doctors.length}</h2>
                                    </div>
                                </div>

                                {/* Patients */}
                                <div className="col-md-3">
                                    <div className="card text-center shadow-sm p-3">
                                        <h5>Total Patients</h5>
                                        <h2>{patients.length}</h2>
                                    </div>
                                </div>

                                {/* Staff */}
                                <div className="col-md-3">
                                    <div className="card text-center shadow-sm p-3">
                                        <h5>Total Staff</h5>
                                        <h2>{staff.length}</h2>
                                    </div>
                                </div>

                                {/* Appointments */}
                                <div className="col-md-3">
                                    <div className="card text-center shadow-sm p-3">
                                        <h5>Total Appointments</h5>
                                        <h2>{appointments.length}</h2>
                                    </div>
                                </div>

                            </div>
                        </div>

                        
                        )}                    
                        
                        {/* DOCTOR PAGE */}
                        {activePage === "doctor" && (

                            <div className="card shadow-sm p-3">

                                <div className="d-flex justify-content-between mb-3">
                                    <h4>Doctor List</h4>
                                    <button className="btn btn-primary">Add Doctor</button>
                                </div>

                                <table className="table table-striped">

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {doctors.map((doc) => (
                                            <tr key={doc.id}>
                                                <td>{doc.id}</td>
                                                <td>{doc.name}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-warning me-2">Edit</button>
                                                    <button className="btn btn-sm btn-danger">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>

                </div>
            </div>
        </>
    )
}

export default AdminPage;