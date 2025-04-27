import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import InvitationValidation from '../pages/Invitation/InvitationValidation';
import CompleteProfile from '../pages/Employee/CompleteProfile';

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/invitation/validate/:token" element={<InvitationValidation />} />
      <Route path="/complete-profile/:token" element={<CompleteProfile />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default PublicRoutes;
