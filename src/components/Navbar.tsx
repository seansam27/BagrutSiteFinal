import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogIn, LogOut, Settings, User, UserPlus, Home } from 'lucide-react';
import DateTimeDisplay from './DateTimeDisplay';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50">
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white text-primary-700 shadow-md' 
            : 'bg-primary-600 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <BookOpen className={`h-8 w-8 mr-2 ${isScrolled ? 'text-primary-600' : 'text-white'}`} />
                <span className={`text-xl font-bold ${isScrolled ? 'text-primary-700' : 'text-white'}`}>בגרויות ישראל</span>
              </Link>
              <div className="mr-8">
                <DateTimeDisplay variant={isScrolled ? 'dark' : 'light'} />
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
              <Link 
                to="/" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isScrolled 
                    ? 'hover:bg-primary-100 text-primary-700' 
                    : 'hover:bg-primary-700 text-white'
                }`}
              >
                <Home className="h-5 w-5 mr-1" />
                בית
              </Link>
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isScrolled 
                          ? 'hover:bg-primary-100 text-primary-700' 
                          : 'hover:bg-primary-700 text-white'
                      }`}
                    >
                      מרכז בקרה
                    </Link>
                  )}
                  <Link 
                    to="/exams" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isScrolled 
                        ? 'hover:bg-primary-100 text-primary-700' 
                        : 'hover:bg-primary-700 text-white'
                    }`}
                  >
                    בגרויות
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isScrolled 
                        ? 'hover:bg-primary-100 text-primary-700' 
                        : 'hover:bg-primary-700 text-white'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                  <div className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isScrolled 
                      ? 'text-primary-700' 
                      : 'text-white'
                  }`}>
                    <span>{getGreeting()}, {user.first_name}</span>
                    <button
                      onClick={() => signOut()}
                      className={`flex items-center mr-4 px-3 py-1 rounded-md text-sm font-medium ${
                        isScrolled 
                          ? 'hover:bg-primary-100 text-primary-700 bg-gray-50' 
                          : 'hover:bg-primary-700 text-white bg-primary-500'
                      }`}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      התנתק
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isScrolled 
                      ? 'text-primary-700' 
                      : 'text-white'
                  }`}>
                    <span>{getGreeting()}, אורח</span>
                  </div>
                  <Link 
                    to="/login" 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isScrolled 
                        ? 'hover:bg-primary-100 text-primary-700' 
                        : 'hover:bg-primary-700 text-white'
                    }`}
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    התחבר
                  </Link>
                  <Link 
                    to="/register" 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isScrolled 
                        ? 'bg-primary-600 text-white hover:bg-primary-700' 
                        : 'bg-white text-primary-700 hover:bg-gray-100'
                    }`}
                  >
                    <UserPlus className="h-5 w-5 mr-1" />
                    הירשם
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;