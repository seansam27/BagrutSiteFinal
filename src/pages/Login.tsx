import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { LogIn, Mail, Lock, ArrowRight, AlertCircle, UserPlus, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

interface LocationState {
  message?: string;
}

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  useEffect(() => {
    // Check if there's a message in the location state (e.g., after registration)
    const state = location.state as LocationState;
    if (state?.message) {
      setSuccess(state.message);
    }
  }, [location]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setLoading(true);
      
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error('Login error:', error);
        setError('שם משתמש או סיסמה שגויים');
        return;
      }
      
      navigate('/exams');
    } catch (err) {
      console.error('Login exception:', err);
      setError('אירעה שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 py-12 sm:px-6 lg:px-8 animate-fadeIn relative overflow-hidden">
      {/* Background Icons */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <BookOpen className="absolute h-32 w-32 text-primary-600 top-[10%] left-[15%] transform -rotate-12" />
        <Calculator className="absolute h-24 w-24 text-indigo-600 top-[25%] left-[35%] transform rotate-6" />
        <GraduationCap className="absolute h-40 w-40 text-purple-600 top-[15%] right-[20%] transform rotate-12" />
        <PenTool className="absolute h-28 w-28 text-blue-600 top-[40%] left-[10%] transform -rotate-6" />
        <Brain className="absolute h-36 w-36 text-primary-700 top-[60%] left-[25%] transform rotate-12" />
        <Lightbulb className="absolute h-24 w-24 text-yellow-500 top-[20%] right-[10%] transform -rotate-12" />
        <School className="absolute h-32 w-32 text-indigo-700 top-[70%] right-[15%] transform rotate-6" />
        <Award className="absolute h-28 w-28 text-green-600 top-[50%] right-[30%] transform -rotate-6" />
        <FileText className="absolute h-24 w-24 text-primary-600 bottom-[10%] left-[20%] transform rotate-12" />
        <Compass className="absolute h-32 w-32 text-blue-500 bottom-[20%] right-[25%] transform -rotate-12" />
        <Clock className="absolute h-28 w-28 text-indigo-500 bottom-[15%] left-[40%] transform rotate-6" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-4 rounded-full shadow-lg">
            <LogIn className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">ברוכים הבאים</h2>
        <p className="mt-3 text-center text-xl font-medium text-gray-600">
          התחברו לחשבון שלכם
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          או{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            הירשמו לחשבון חדש
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white py-10 px-6 shadow-xl sm:rounded-lg sm:px-12 transform transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary-100 rounded-br-full opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-tl-full opacity-70"></div>
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-50 rounded-full opacity-50"></div>
          
          <div className="relative">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            
            <form className="space-y-8 animate-fadeIn" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700">
                  כתובת אימייל
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
                    placeholder="your@email.com"
                    {...register('email', { 
                      required: 'נדרש למלא אימייל',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'כתובת אימייל לא תקינה'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-base font-medium text-gray-700">
                  סיסמה
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
                    placeholder="••••••••"
                    {...register('password', { 
                      required: 'נדרש למלא סיסמה',
                      minLength: {
                        value: 6,
                        message: 'הסיסמה חייבת להכיל לפחות 6 תווים'
                      }
                    })}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
                >
                  <span className="absolute right-0 top-0 h-full w-12 bg-gradient-to-r from-transparent to-white/10 transform -skew-x-12 transition-transform duration-700 ease-in-out group-hover:translate-x-96"></span>
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      מתחבר...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      התחבר
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    אין לך חשבון?
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <UserPlus className="h-5 w-5 ml-2" />
                  הירשם עכשיו
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;