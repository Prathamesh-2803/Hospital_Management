import '../style/adminpage.css'

function AdminPage() {

    return (
        <>
            <div className="container-fluid admin-dashboard">
                <div className="row" style={{ height: "100vh" }}>
                    <div className="col-2 col-sm-3 col-xl-2 bg-dark">
                        <nav class="navbar bg-dark border-bottom border-white" data-bs-theme="dark">
                            <div class="container-fluid">
                                <a class="navbar-brand" href="#">Navbar</a>
                            </div>
                        </nav>

                        <nav class="nav flex-column border-bottom border-white">
                            <h6 className="text-light ms-5 mt-3">Main Menu</h6>
                            <a class="nav-link text-white" href="#">📊 Dashboard</a>
                            <a class="nav-link text-white" href="#">🧑‍⚕️ Doctor</a>
                            <a class="nav-link text-white" href="#">🧑‍🦽 Patient</a>
                            <a class="nav-link text-white" href="#">👨‍💼 Staff</a>
                            <a class="nav-link text-white" href="#">📅 Appointments</a>
                            <a class="nav-link text-white" href="#">🏢 Departments</a>
                            <a class="nav-link text-white" href="#">💳 Billing</a>
                            <a class="nav-link text-white" href="#">📈 Reports</a>
                            <a class="nav-link text-white" href="#">⚙️ Settings</a><br />
                        </nav>

                        <button type="button" class="btn">Admin<br /><span className='logout text-danger'>Logout→</span></button>

                    </div>
                    <div className="col-10 col-sm-9 col-xl-10 p-0 m-0">
                        <nav class="navbar navbar-expand-lg admin-nav">
                            <div class="container-fluid">
                                <div class="d-flex flex-column ">
                                    <h3>Dashboard</h3>
                                    <span>Welcome back, Admin!</span>
                                </div>
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a href="" className="nav-link text-white">Home</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                    </div>
                </div>
            </div>
        </>
    )

}

export default AdminPage;