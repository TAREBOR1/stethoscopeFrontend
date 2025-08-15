import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { checkAuth } from './redux/authSlice';
import CheckAuthentication from '../src/components/Auth/CheckAuth';

// Dashboards
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';

// Election & Voting
import ActiveElections from './pages/Election/ActiveElections';
import PastElections from './pages/Election/PastElections';
import PositionDetail from './pages/Election/PositionDetail';
import ElectionDetail from './pages/Election/ElectionDetail';
import VoteConfirmation from './pages/Voting/VoteConfirmation';

// Admin
import UserManagement from './pages/Admin/UserManagement';
import CreateElection from './pages/Admin/CreateElection';
import AdminElectionView from './pages/Admin/AdminElectionView';
import AdminElectionResults from './pages/Admin/AdminElectionResult';
import CandidateRegistration from './pages/Admin/AddCandidate';


// Auth Pages
import EmailLogin from './pages/Auth/EmailLogin';
import OtpVerification from './pages/Auth/OtpVerification';
import NotFound from './pages/NotFound';

// ✅ Wrapper for student-only routes
const StudentRoutesWrapper = ({ isAuthenticated, user }) => (
  <CheckAuthentication isAuthenticated={isAuthenticated} user={user}>
    <Outlet />
  </CheckAuthentication>
);

// ✅ Wrapper for admin-only routes
const AdminRoutesWrapper = ({ isAuthenticated, user }) => (
  <CheckAuthentication isAuthenticated={isAuthenticated} user={user}>
    <Outlet />
  </CheckAuthentication>
);

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenString = sessionStorage.getItem('token');
    if (tokenString) {
      try {
        const token = JSON.parse(tokenString);
        dispatch(checkAuth(token));
      } catch (err) {
        console.error('Invalid token JSON', err);
      }
    }
  }, [dispatch]);

  return (
    <div className="relative z-10 min-h-[70vh]">
      <Toaster />
      <Routes>
        {/* === AUTH === */}
        <Route path="/" element={<CheckAuthentication isAuthenticated={isAuthenticated} user={user}><EmailLogin /></CheckAuthentication>} />
        <Route path="/otp" element={<CheckAuthentication isAuthenticated={isAuthenticated} user={user}><OtpVerification /></CheckAuthentication>} />

        {/* === STUDENT ROUTES === */}
        <Route path="/student" element={<StudentRoutesWrapper isAuthenticated={isAuthenticated} user={user} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="vote" element={<VoteConfirmation />} />
          <Route path="positions/:id" element={<PositionDetail />} />
        </Route>
        {/* === ADMIN ROUTES === */}
        <Route path="/admin" element={<AdminRoutesWrapper isAuthenticated={isAuthenticated} user={user} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="create-election" element={<CreateElection />} />
          <Route path="view/:positionId" element={<AdminElectionView />} />
          <Route path="result/:positionId" element={<AdminElectionResults />} />
          <Route path="register-candidate" element={<CandidateRegistration />} />
        </Route>

        {/* === PUBLIC ELECTION ROUTES === */}
        <Route path="/elections/active" element={<ActiveElections />} />
        <Route path="/elections/past" element={<PastElections />} />
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  );
};

export default App;
