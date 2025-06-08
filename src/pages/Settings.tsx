import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Settings as SettingsIcon, User, Mail, Lock, Save, AlertCircle, CheckCircle, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';

interface ProfileFormData {
  firstName: string;
  lastName: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    formState: { errors: profileErrors } 
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
    }
  });
  
  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    watch,
    formState: { errors: passwordErrors } 
  } = useForm<PasswordFormData>();
  
  const newPassword = watch('newPassword');

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      setProfileSuccess(null);
      setProfileError(null);
      
      const { error } = await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
      });
      
      if (error) {
        setProfileError('אירעה שגיאה בעדכון הפרופיל');
        return;
      }
      
      setProfileSuccess('הפרופיל עודכן בהצלחה');
    } catch (err) {
      setProfileError('אירעה שגיאה בעדכון הפרופיל');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      setLoading(true);
      setPasswordSuccess(null);
      setPasswordError(null);
      
      const { error } = await updatePassword(data.newPassword);
      
      if (error) {
        setPasswordError('אירעה שגיאה בעדכון הסיסמה');
        return;
      }
      
      setPasswordSuccess('הסיסמה עודכנה בהצלחה');
    } catch (err) {
      setPasswordError('אירעה שגיאה בעדכון הסיסמה');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 py-8 animate-fadeIn relative overflow-hidden">
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-4 rounded-full shadow-lg">
            <SettingsIcon className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 mb-8">הגדרות חשבון</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary-100 rounded-br-full opacity-70"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-tl-full opacity-70"></div>
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-50 rounded-full opacity-50"></div>
            
            <div className="px-6 py-5 bg-primary-50 border-b border-primary-100 relative">
              <h2 className="text-xl font-semibold text-primary-900">פרטים אישיים</h2>
              <p className="mt-1 text-sm text-primary-700">עדכון פרטי המשתמש שלך</p>
            </div>
            
            <div className="px-6 py-6 relative">
              {profileSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}
              
              {profileError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
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
                      {...registerProfile('firstName', { required: 'נדרש למלא שם פרטי' })}
                    />
                    {profileErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
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
                      {...registerProfile('lastName', { required: 'נדרש למלא שם משפחה' })}
                    />
                    {profileErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
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
                      value={user.email}
                      disabled
                      className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 text-base"
                    />
                    <p className="mt-1 text-xs text-gray-500">לא ניתן לשנות את כתובת האימייל</p>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        מעדכן...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Save className="h-5 w-5 mr-2" />
                        שמור שינויים
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Password Settings */}
          <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-100 rounded-br-full opacity-70"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-100 rounded-tl-full opacity-70"></div>
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-50 rounded-full opacity-50"></div>
            
            <div className="px-6 py-5 bg-indigo-50 border-b border-indigo-100 relative">
              <h2 className="text-xl font-semibold text-indigo-900">שינוי סיסמה</h2>
              <p className="mt-1 text-sm text-indigo-700">עדכון הסיסמה שלך</p>
            </div>
            
            <div className="px-6 py-6 relative">
              {passwordSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
              
              {passwordError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-base font-medium text-gray-700">
                    סיסמה נוכחית
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="currentPassword"
                      type="password"
                      className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                      placeholder="••••••••"
                      {...registerPassword('currentPassword', { 
                        required: 'נדרש למלא סיסמה נוכחית'
                      })}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-base font-medium text-gray-700">
                    סיסמה חדשה
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                      placeholder="••••••••"
                      {...registerPassword('newPassword', { 
                        required: 'נדרש למלא סיסמה חדשה',
                        minLength: {
                          value: 6,
                          message: 'הסיסמה חייבת להכיל לפחות 6 תווים'
                        }
                      })}
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">
                    אימות סיסמה חדשה
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="block w-full pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                      placeholder="••••••••"
                      {...registerPassword('confirmPassword', { 
                        required: 'נדרש לאמת סיסמה חדשה',
                        validate: value => value === newPassword || 'הסיסמאות אינן תואמות'
                      })}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        מעדכן...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Lock className="h-5 w-5 mr-2" />
                        עדכן סיסמה
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Account Info Card */}
        <div className="mt-8 bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-100 rounded-br-full opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-100 rounded-tl-full opacity-70"></div>
          
          <div className="px-6 py-5 bg-gradient-to-r from-primary-50 to-indigo-50 border-b border-primary-100 relative">
            <h2 className="text-xl font-semibold text-gray-900">פרטי חשבון</h2>
            <p className="mt-1 text-sm text-gray-700">מידע על החשבון שלך</p>
          </div>
          
          <div className="px-6 py-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">שם מלא</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{user.first_name} {user.last_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">כתובת אימייל</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{user.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">תאריך לידה</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {new Date(user.birth_date).toLocaleDateString('he-IL')}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">סוג חשבון</h3>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? 'מנהל מערכת' : 'משתמש רגיל'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;