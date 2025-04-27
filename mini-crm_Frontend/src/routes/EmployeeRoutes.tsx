import { Routes, Route, Navigate } from 'react-router-dom';
import EmployerDashboard from '../pages/Employee/EmployerDashboard';
import CompanyProfile from '../pages/Employee/CompanyProfile';
import ColleagueTable from '../pages/Employee/ColleagueTable';
import EmployerProfile from '../pages/Employee/EmployerProfile';

function EmployeeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Employee/dashboard" />} />
      <Route path="/Employee/dashboard" element={<EmployerDashboard />} />
      <Route path="/CompanyTable" element={<CompanyProfile />} />
      <Route path="/ColleagueTable" element={<ColleagueTable />} />
      <Route path="/MonProfile" element={<EmployerProfile />} />
      <Route path="*" element={<Navigate to="/Employee/dashboard" />} />
    </Routes>
  );
}

export default EmployeeRoutes;
