import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home            from './pages/Home';
import Choice          from './pages/Choice';
import Register        from './pages/Register';
import Adminlog        from './pages/Adminlog';
import AdminPage       from './pages/AdminPage';
import Doctorlog       from './pages/Doctorlog';
import DoctorPage      from './pages/DoctorPage';
import Stafflog        from './pages/Stafflog';
import StaffRegister   from './pages/Staffregister';
import StaffPage       from './pages/StaffPage';
import PatientLog      from './pages/PatientLog';
import PatientRegister from './pages/PatientRegister';
import PatientPage     from './pages/PatientPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/choice"           element={<Choice />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/adminlog"         element={<Adminlog />} />
        <Route path="/adminpage"        element={<AdminPage />} />
        <Route path="/doctorlog"        element={<Doctorlog />} />
        <Route path="/doctorpage"       element={<DoctorPage />} />
        <Route path="/stafflog"         element={<Stafflog />} />
        <Route path="/staff-register"   element={<StaffRegister />} />
        <Route path="/staffpage"        element={<StaffPage />} />
        <Route path="/patientlog"       element={<PatientLog />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/patientpage"      element={<PatientPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;