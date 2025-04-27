import { Routes, Route, Navigate } from 'react-router-dom';
import Dashbord from '../pages/Dashbord';
import CompanyManagement from '../pages/Entreprises';
import EmployeeManagement from '../pages/Employee/EmployeeList';
import InvitationManagement from '../pages/Invitation/InvitationManagement';
import AdminManagement from '../pages/Administrateur/AdminManagement';
import HistoryTimeline from '../pages/Historique/HistoryTimeline';
import ProfileAdmin from '../pages/Profile/AdminProfile';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashbord />} />
      <Route path="/Company/list" element={<CompanyManagement />} />
      <Route path="/Employee/list" element={<EmployeeManagement />} />
      <Route path="/invitation/list" element={<InvitationManagement />} />
      <Route path="/Admin/list" element={<AdminManagement />} />
      <Route path="/Admin/History" element={<HistoryTimeline />} />
      <Route path="/Admin/MyAcount" element={<ProfileAdmin />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default AdminRoutes;
