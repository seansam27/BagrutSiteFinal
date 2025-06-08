import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { UserPlus, Mail, Lock, User, Calendar, ArrowRight, AlertCircle, LogIn, BookOpen, CheckCircle, MessageSquare, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

const Register: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      setLoading(true);
      
      const { error } = await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
        birth_date: data.birthDate,
      });
      
      if (error) {
        console.error('Registration error:', error);
        setError(error.message || 'אירעה שגיאה בהרשמה');
        return;
      }
      
      navigate('/login', { state: { message: 'ההרשמה הושלמה בהצלחה! אנא התחבר כעת.' } });
    } catch (err) {
      console.error('Registration exception:', err);
      setError('אירעה שגיאה בהרשמה');
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

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-12 px-4 relative z-10">
        {/* Registration Form */}
        <div className="md:w-3/5 order-2 md:order-1">
          <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-4 rounded-full shadow-lg">
                <UserPlus className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">הצטרפו אלינו</h2>
            <p className="mt-3 text-center text-xl font-medium text-gray-600">
              צרו חשבון חדש בקלות ובמהירות
            </p>
            <p className="mt-2 text-center text-sm text-gray-600">
              או{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                התחברו לחשבון קיים
              </Link>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
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
                
                <form className="space-y-6 animate-fadeIn" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-base font-medium text-gray-700">
                        שם פרטי
                      </label>
                      <div className="mt-2 relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="firstName"
                          type="text"
                          className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
                          placeholder="ישראל"
                          {...register('firstName', { required: 'נדרש למלא שם פרטי' })}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-base font-medium text-gray-700">
                        שם משפחה
                      </label>
                      <div className="mt-2 relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="lastName"
                          type="text"
                          className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
                          placeholder="ישראלי"
                          {...register('lastName', { required: 'נדרש למלא שם משפחה' })}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="block text-base font-medium text-gray-700">
                      תאריך לידה
                    </label>
                    <div className="mt-2 relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="birthDate"
                        type="date"
                        className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
                        {...register('birthDate', { required: 'נדרש למלא תאריך לידה' })}
                      />
                      {errors.birthDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
                      )}
                    </div>
                  </div>

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
                    <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">
                      אימות סיסמה
                    </label>
                    <div className="mt-2 relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base"
                        placeholder="••••••••"
                        {...register('confirmPassword', { 
                          required: 'נדרש לאמת סיסמה',
                          validate: value => value === password || 'הסיסמאות אינן תואמות'
                        })}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                          מבצע הרשמה...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          הירשם
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
                        כבר יש לך חשבון?
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      to="/login"
                      className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                    >
                      <LogIn className="h-5 w-5 ml-2" />
                      התחבר לחשבון קיים
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="md:w-2/5 order-1 md:order-2 flex flex-col justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <BookOpen className="h-10 w-10 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">בגרויות ישראל</h2>
            </div>
            
            <h3 className="text-xl font-semibold mb-4 text-gray-800">המקום המושלם להתכונן לבחינות הבגרות</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary-600" />
                </div>
                <p className="mr-3 text-gray-600">גישה למאגר עצום של בחינות בגרות מכל השנים</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary-600" />
                </div>
                <p className="mr-3 text-gray-600">פתרונות מפורטים לכל שאלה עם הסברים מקיפים</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary-600" />
                </div>
                <p className="mr-3 text-gray-600">סרטוני הסבר צעד אחר צעד לפתרון הבחינות</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary-600" />
                </div>
                <p className="mr-3 text-gray-600">פורום דיון לשאלות ותשובות עם תלמידים אחרים</p>
              </div>
            </div>
            
            {/* "Why choose Bagruyot Israel" section moved here as requested */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">למה לבחור בבגרויות ישראל?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="mr-3">
                    <h4 className="font-medium text-gray-900">מאגר בחינות עשיר</h4>
                    <p className="text-sm text-gray-600">גישה למאגר עצום של בחינות בגרות מכל השנים והמקצועות</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="mr-3">
                    <h4 className="font-medium text-gray-900">פתרונות מפורטים</h4>
                    <p className="text-sm text-gray-600">פתרונות מלאים ומפורטים לכל שאלה בבחינות</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="mr-3">
                    <h4 className="font-medium text-gray-900">קהילה תומכת</h4>
                    <p className="text-sm text-gray-600">הצטרף לקהילה של תלמידים ומורים, שאל שאלות וקבל עזרה</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;