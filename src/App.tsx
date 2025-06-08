import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Exams from './pages/Exams';
import Settings from './pages/Settings';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminExams from './pages/Admin/Exams';
import AdminEditExam from './pages/Admin/EditExam';
import AdminExamManagement from './pages/Admin/ExamManagement';
import FileExplorer from './pages/FileExplorer';
import ProtectedRoute from './components/ProtectedRoute';
import InboxPage from './pages/Inbox';
import ComposeMessage from './pages/ComposeMessage';
import ViewMessage from './pages/ViewMessage';
import Calendar from './pages/Calendar';
import Navbar from './components/Navbar';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes with Original Navbar */}
      <Route element={<Navbar />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/exams" element={<Exams />} />
        <Route path="/files" element={<FileExplorer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/inbox/compose" element={<ComposeMessage />} />
        <Route path="/inbox/view/:id" element={<ViewMessage />} />
        <Route path="/calendar" element={<Calendar />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute adminOnly><MainLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/exams" element={<AdminExams />} />
        <Route path="/admin/exams/edit/:id" element={<AdminEditExam />} />
        <Route path="/admin/exam-management" element={<AdminExamManagement />} />
      </Route>

      {/* Catch all - redirect to appropriate dashboard */}
      <Route path="*" element={
        <Navigate to={user ? (user.role === 'admin' ? '/admin' : '/exams') : '/'} replace />
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;