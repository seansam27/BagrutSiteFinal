import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Settings, Users, Home, Mail, LogOut, FileText, Folder, Calendar } from 'lucide-react';
import DateTimeDisplay from '../components/DateTimeDisplay';

const MainLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

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

  const handleHomeClick = () => {
    document.body.classList.add('animate-slideIn');
    setTimeout(() => {
      document.body.classList.remove('animate-slideIn');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-primary-800 text-white fixed h-full z-50">
        <div className="p-4">
          <Link to="/" className="flex items-center">
            <BookOpen className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">בגרויות ישראל</span>
          </Link>
          <p className="mt-2 text-sm text-primary-200">פורטל בגרויות</p>
          
          {/* Greeting */}
          <p className="mt-4 text-lg text-white/90">
            {getGreeting()}, {user?.first_name}
          </p>
        </div>
        
        <nav className="mt-6">
          <ul>
            {user?.role === 'admin' && (
              <>
                <li>
                  <Link
                    to="/admin"
                    className={`flex items-center px-4 py-3 ${
                      location.pathname === '/admin'
                        ? 'bg-primary-900 text-white'
                        : 'text-primary-100 hover:bg-primary-700'
                    } transition-colors duration-200`}
                  >
                    <Users className="h-5 w-5 mr-3" />
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
              </>
            )}
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
                to="/files"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/files'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <Folder className="h-5 w-5 mr-3" />
                <span>הקבצים שלי</span>
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/calendar'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } transition-colors duration-200`}
              >
                <Calendar className="h-5 w-5 mr-3" />
                <span>לוח שנה</span>
              </Link>
            </li>
            <li>
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
                onClick={handleHomeClick}
                className="flex items-center px-4 py-3 text-primary-100 hover:bg-primary-700 transition-colors duration-200"
              >
                <Home className="h-5 w-5 mr-3" />
                <span>חזרה למסך הבית</span>
              </Link>
            </li>
            <li>
              <button
                onClick={signOut}
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
      <div className="flex-1 mr-64">
        {/* Fixed Header */}
        <div className="fixed top-0 right-64 left-0 z-40">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-2">
            <div className="px-8">
              <DateTimeDisplay variant="light" />
            </div>
          </div>
        </div>
        
        {/* Content with proper padding for fixed header */}
        <div className="pt-12 px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;