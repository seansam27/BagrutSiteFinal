import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart2, BookOpen, FileText, Home, Settings, Users, LogOut, Mail, Tag } from 'lucide-react';
import DateTimeDisplay from './DateTimeDisplay';

const AdminLayout: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }
  
  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      return 'בוקר טוב';
    } else if (hours >= 12 && hours < 18) {
      return 'צהריים טובים';
    } else {
      return 'ערב טוב';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary-800 text-white">
        <div className="p-4">
          <Link to="/" className="flex items-center">
            <BookOpen className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">בגרויות ישראל</span>
          </Link>
          <p className="mt-2 text-sm text-primary-200">מרכז בקרה</p>
          
          {/* Greeting */}
          <p className="mt-4 text-lg text-white/90">
            {getGreeting()}, {user.first_name}
          </p>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                to="/admin"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/admin'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <BarChart2 className="h-5 w-5 mr-3" />
                <span>לוח בקרה</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/admin/users'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <Users className="h-5 w-5 mr-3" />
                <span>משתמשים</span>
              </Link>
            </li>
            <li>
              <Link
                to="/exams"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/exams'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>בגרויות</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/exams"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/admin/exams'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>ניהול בגרויות</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/exams/add"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/admin/exams/add'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>הוספת בגרות</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/subjects"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/admin/subjects'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <BookOpen className="h-5 w-5 mr-3" />
                <span>ניהול מקצועות</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/exam-forms"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/admin/exam-forms'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <Tag className="h-5 w-5 mr-3" />
                <span>ניהול שאלונים</span>
              </Link>
            </li>
            <li className="border-t border-primary-700 mt-4 pt-4">
              <Link
                to="/inbox"
                className={`flex items-center px-4 py-3 ${
                  location.pathname.startsWith('/inbox')
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <Mail className="h-5 w-5 mr-3" />
                <span>הודעות</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/settings'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>הגדרות</span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-primary-100 hover:bg-primary-700 transition-colors duration-200"
              >
                <Home className="h-5 w-5 mr-3" />
                <span>חזרה לאתר</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center px-4 py-3 text-primary-100 hover:bg-primary-700 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>התנתק</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-2">
          <div className="container mx-auto px-4">
            <DateTimeDisplay variant="light" />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;