import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { format } from 'date-fns';
import { Search, UserX, UserPlus, X, Check, AlertCircle, Edit, Save, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';
import { getUsersData, deleteUser, addUser, updateProfile } from '../../lib/db';
import { useForm } from 'react-hook-form';
import DeleteConfirmation from '../../components/DeleteConfirmation';

interface AddUserFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  role: 'user' | 'admin';
}

interface EditUserFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  role: 'user' | 'admin';
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const { 
    register: registerAdd, 
    handleSubmit: handleSubmitAdd, 
    formState: { errors: errorsAdd }, 
    reset: resetAdd 
  } = useForm<AddUserFormData>({
    defaultValues: {
      role: 'user'
    }
  });
  
  const { 
    register: registerEdit, 
    handleSubmit: handleSubmitEdit, 
    formState: { errors: errorsEdit }, 
    reset: resetEdit,
    setValue: setEditValue
  } = useForm<EditUserFormData>();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(lowercasedSearch) ||
      user.first_name.toLowerCase().includes(lowercasedSearch) ||
      user.last_name.toLowerCase().includes(lowercasedSearch)
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = getUsersData();
          
      if (error) throw error;
      
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('אירעה שגיאה בטעינת המשתמשים');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const { success, error } = deleteUser(userToDelete);
        
      if (error) throw error;
      
      // Update the local state
      setUsers(users.filter(user => user.id !== userToDelete));
      setFilteredUsers(filteredUsers.filter(user => user.id !== userToDelete));
      setSuccess('המשתמש נמחק בהצלחה');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('אירעה שגיאה במחיקת המשתמש');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setShowDeleteConfirmation(false);
      setUserToDelete(null);
    }
  };

  const onSubmitAddUser = async (data: AddUserFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Check if user with this email already exists
      if (users.some(user => user.email === data.email)) {
        setError('משתמש עם כתובת אימייל זו כבר קיים במערכת');
        setLoading(false);
        return;
      }
      
      // Add user to database
      const { data: newUser, error } = addUser(
        data.email,
        data.password,
        {
          first_name: data.firstName,
          last_name: data.lastName,
          birth_date: data.birthDate,
          role: data.role
        }
      );
      
      if (error) throw error;
      
      if (newUser) {
        // Update the local state
        setUsers([...users, newUser]);
        setFilteredUsers([...filteredUsers, newUser]);
        setSuccess('המשתמש נוסף בהצלחה');
        resetAdd();
        setShowAddUserForm(false);
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError('אירעה שגיאה בהוספת המשתמש');
    } finally {
      setLoading(false);
    }
  };

  const startEditingUser = (user: User) => {
    setEditingUser(user);
    setEditValue('firstName', user.first_name);
    setEditValue('lastName', user.last_name);
    setEditValue('birthDate', user.birth_date);
    setEditValue('role', user.role);
  };

  const cancelEditing = () => {
    setEditingUser(null);
    resetEdit();
  };

  const onSubmitEditUser = async (data: EditUserFormData) => {
    if (!editingUser) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Update user in database
      const { success, error } = updateProfile(editingUser.id, {
        first_name: data.firstName,
        last_name: data.lastName,
        birth_date: data.birthDate,
        role: data.role
      });
      
      if (error) throw error;
      
      if (success) {
        // Update the local state
        const updatedUser = {
          ...editingUser,
          first_name: data.firstName,
          last_name: data.lastName,
          birth_date: data.birthDate,
          role: data.role
        };
        
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        setFilteredUsers(filteredUsers.map(u => u.id === editingUser.id ? updatedUser : u));
        setSuccess('המשתמש עודכן בהצלחה');
        setEditingUser(null);
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('אירעה שגיאה בעדכון המשתמש');
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 flex justify-center items-center relative overflow-hidden">
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
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען משתמשים...</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ניהול משתמשים</h1>
          <button
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            {showAddUserForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                ביטול
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                הוסף משתמש
              </>
            )}
          </button>
        </div>
        
        {/* Add User Form */}
        {showAddUserForm && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 animate-slideUp">
            <div className="px-4 py-5 sm:px-6 bg-primary-50">
              <h2 className="text-lg font-medium text-primary-900">הוספת משתמש חדש</h2>
              <p className="mt-1 text-sm text-primary-700">מלא את הפרטים כדי להוסיף משתמש חדש למערכת</p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmitAdd(onSubmitAddUser)}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      שם פרטי
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        {...registerAdd('firstName', { required: 'נדרש למלא שם פרטי' })}
                      />
                      {errorsAdd.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errorsAdd.firstName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      שם משפחה
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        {...registerAdd('lastName', { required: 'נדרש למלא שם משפחה' })}
                      />
                      {errorsAdd.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errorsAdd.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      כתובת אימייל
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        type="email"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        {...registerAdd('email', { 
                          required: 'נדרש למלא כתובת אימייל',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'כתובת אימייל לא תקינה'
                          }
                        })}
                      />
                      {errorsAdd.email && (
                        <p className="mt-1 text-sm text-red-600">{errorsAdd.email.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      סיסמה
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        type="password"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        {...registerAdd('password', { 
                          required: 'נדרש למלא סיסמה',
                          minLength: {
                            value: 6,
                            message: 'הסיסמה חייבת להכיל לפחות 6 תווים'
                          }
                        })}
                      />
                      {errorsAdd.password && (
                        <p className="mt-1 text-sm text-red-600">{errorsAdd.password.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                      תאריך לידה
                    </label>
                    <div className="mt-1">
                      <input
                        id="birthDate"
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        {...registerAdd('birthDate', { required: 'נדרש למלא תאריך לידה' })}
                      />
                      {errorsAdd.birthDate && (
                        <p className="mt-1 text-sm text-red-600">{errorsAdd.birthDate.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      תפקיד
                    </label>
                    <div className="mt-1">
                      <select
                        id="role"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        {...registerAdd('role', { required: 'נדרש לבחור תפקיד' })}
                      >
                        <option value="user">משתמש רגיל</option>
                        <option value="admin">מנהל מערכת</option>
                      </select>
                      {errorsAdd.role && (
                        <p className="mt-1 text-sm text-red-600">{errorsAdd.role.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">
                          <UserPlus className="h-4 w-4" />
                        </span>
                        מוסיף משתמש...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        הוסף משתמש
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Edit User Form */}
        {editingUser && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 animate-slideUp">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50">
              <h2 className="text-lg font-medium text-indigo-900">עריכת משתמש</h2>
              <p className="mt-1 text-sm text-indigo-700">עדכן את פרטי המשתמש</p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmitEdit(onSubmitEditUser)}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edit-firstName" className="block text-sm font-medium text-gray-700">
                      שם פרטי
                    </label>
                    <div className="mt-1">
                      <input
                        id="edit-firstName"
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        {...registerEdit('firstName', { required: 'נדרש למלא שם פרטי' })}
                      />
                      {errorsEdit.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errorsEdit.firstName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-lastName" className="block text-sm font-medium text-gray-700">
                      שם משפחה
                    </label>
                    <div className="mt-1">
                      <input
                        id="edit-lastName"
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        {...registerEdit('lastName', { required: 'נדרש למלא שם משפחה' })}
                      />
                      {errorsEdit.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errorsEdit.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-birthDate" className="block text-sm font-medium text-gray-700">
                      תאריך לידה
                    </label>
                    <div className="mt-1">
                      <input
                        id="edit-birthDate"
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        {...registerEdit('birthDate', { required: 'נדרש למלא תאריך לידה' })}
                      />
                      {errorsEdit.birthDate && (
                        <p className="mt-1 text-sm text-red-600">{errorsEdit.birthDate.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">
                      תפקיד
                    </label>
                    <div className="mt-1">
                      <select
                        id="edit-role"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        {...registerEdit('role', { required: 'נדרש לבחור תפקיד' })}
                      >
                        <option value="user">משתמש רגיל</option>
                        <option value="admin">מנהל מערכת</option>
                      </select>
                      {errorsEdit.role && (
                        <p className="mt-1 text-sm text-red-600">{errorsEdit.role.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3 rtl:space-x-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">
                          <Save className="h-4 w-4" />
                        </span>
                        מעדכן...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        שמור שינויים
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <X className="h-4 w-4 mr-2" />
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Status Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center animate-fadeIn">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center animate-fadeIn">
            <Check className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="חפש לפי שם או אימייל..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    שם
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    אימייל
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    תאריך לידה
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    תפקיד
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    תאריך הרשמה
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      לא נמצאו משתמשים
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray ```tsx
-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(user.birth_date), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'admin' ? 'מנהל' : 'משתמש'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(user.created_at), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => startEditingUser(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="ערוך משתמש"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="מחק משתמש"
                          >
                            <UserX className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          title="מחיקת משתמש"
          message="האם אתה בטוח שברצונך למחוק את המשתמש? פעולה זו אינה ניתנת לביטול."
          confirmText="מחק"
          cancelText="ביטול"
          onConfirm={handleDeleteUser}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;