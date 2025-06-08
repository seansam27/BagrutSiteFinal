import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoCall } from '../../context/VideoCallContext';
import { ActiveRoom } from '../../types';
import { Video, Users, Phone, Copy, ArrowLeft, MessageSquare, AlertCircle, RefreshCw, Lock, Unlock, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock, X } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import DeleteConfirmation from '../../components/DeleteConfirmation';

const AdminOnlineMeetings: React.FC = () => {
  const { fetchActiveRooms, joinRoom } = useVideoCall();
  const navigate = useNavigate();
  const [activeRooms, setActiveRooms] = useState<ActiveRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [roomToClose, setRoomToClose] = useState<ActiveRoom | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<ActiveRoom | null>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [roomStats, setRoomStats] = useState<{
    duration: string;
    startTime: string;
    connectedUsers: string[];
  } | null>(null);

  useEffect(() => {
    loadActiveRooms();
    
    // Set up interval to refresh rooms every 30 seconds
    const interval = setInterval(() => {
      loadActiveRooms(false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadActiveRooms = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      setError(null);
      
      const rooms = await fetchActiveRooms();
      setActiveRooms(rooms);
    } catch (err) {
      console.error('Error fetching active rooms:', err);
      setError('אירעה שגיאה בטעינת החדרים הפעילים');
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const rooms = await fetchActiveRooms();
      setActiveRooms(rooms);
    } catch (err) {
      console.error('Error refreshing active rooms:', err);
      setError('אירעה שגיאה בטעינת החדרים הפעילים');
    } finally {
      setRefreshing(false);
    }
  };

  const handleJoinRoom = (room: ActiveRoom) => {
    joinRoom(room.id);
    navigate(`/video-call/room/${room.id}`);
  };

  const confirmCloseRoom = (room: ActiveRoom) => {
    setRoomToClose(room);
    setShowDeleteConfirmation(true);
  };

  const handleCloseRoom = async () => {
    if (!roomToClose) return;
    
    try {
      setLoading(true);
      
      // In a real implementation, this would call an API to close the room
      // For now, we'll just simulate it by removing the room from the list
      setActiveRooms(prevRooms => prevRooms.filter(room => room.id !== roomToClose.id));
      
      // Show success message
      setError(null);
    } catch (err) {
      console.error('Error closing room:', err);
      setError('אירעה שגיאה בסגירת החדר');
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
      setRoomToClose(null);
    }
  };

  const viewRoomDetails = (room: ActiveRoom) => {
    setSelectedRoom(room);
    
    // Generate mock stats for the room
    const startTime = new Date(room.created_at);
    const now = new Date();
    const durationMs = now.getTime() - startTime.getTime();
    const durationMinutes = Math.floor(durationMs / 60000);
    const durationHours = Math.floor(durationMinutes / 60);
    const remainingMinutes = durationMinutes % 60;
    
    const duration = durationHours > 0 
      ? `${durationHours} שעות ו-${remainingMinutes} דקות` 
      : `${durationMinutes} דקות`;
    
    // Generate mock connected users
    const connectedUsers = [
      'משה כהן',
      'יעל לוי',
      'דוד אברהם',
      room.hostName
    ].slice(0, room.participants);
    
    setRoomStats({
      duration,
      startTime: format(startTime, 'dd/MM/yyyy HH:mm:ss'),
      connectedUsers
    });
    
    setShowRoomDetails(true);
  };

  const formatRoomTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: he });
    } catch (err) {
      return 'זמן לא ידוע';
    }
  };

  if (loading && !activeRooms.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 py-8 relative overflow-hidden">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">ניהול פגישות אונליין</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 py-8 relative overflow-hidden">
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Video className="h-8 w-8 mr-3 text-primary-600" />
            ניהול פגישות אונליין
          </h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            רענן רשימה
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">פגישות פעילות</h2>
            <div className="text-sm text-gray-500">
              סה"כ פגישות פעילות: {activeRooms.length}
            </div>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {activeRooms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Video className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600">אין פגישות פעילות כרגע</p>
              <p className="text-gray-500 text-sm mt-2">כאשר משתמשים יצרו פגישות, הן יופיעו כאן</p>
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900">כותרת</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">מארח</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">משתתפים</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">זמן פעיל</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">סוג</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4">
                      <span className="sr-only">פעולות</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {activeRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {room.title || 'פגישה ללא כותרת'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{room.hostName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{room.participants}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatRoomTime(room.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {room.isPrivate ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Lock className="h-3 w-3 mr-1" />
                            פרטי
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Unlock className="h-3 w-3 mr-1" />
                            ציבורי
                          </span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <div className="flex space-x-2 rtl:space-x-reverse justify-end">
                          <button
                            onClick={() => viewRoomDetails(room)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="צפה בפרטים"
                          >
                            <Copy className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleJoinRoom(room)}
                            className="text-green-600 hover:text-green-900"
                            title="הצטרף לפגישה"
                          >
                            <Phone className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => confirmCloseRoom(room)}
                            className="text-red-600 hover:text-red-900"
                            title="סגור פגישה"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">סטטיסטיקות פגישות</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-2">סה"כ פגישות פעילות</h3>
              <p className="text-3xl font-bold text-blue-600">{activeRooms.length}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="text-lg font-medium text-green-800 mb-2">סה"כ משתתפים</h3>
              <p className="text-3xl font-bold text-green-600">
                {activeRooms.reduce((total, room) => total + room.participants, 0)}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h3 className="text-lg font-medium text-purple-800 mb-2">פגישות פרטיות</h3>
              <p className="text-3xl font-bold text-purple-600">
                {activeRooms.filter(room => room.isPrivate).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && roomToClose && (
        <DeleteConfirmation
          title="סגירת פגישה"
          message={`האם אתה בטוח שברצונך לסגור את הפגישה "${roomToClose.title || 'פגישה ללא כותרת'}"? כל המשתתפים ינותקו מהפגישה.`}
          confirmText="סגור פגישה"
          cancelText="ביטול"
          onConfirm={handleCloseRoom}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setRoomToClose(null);
          }}
        />
      )}
      
      {/* Room Details Modal */}
      {showRoomDetails && selectedRoom && roomStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-zoomIn">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-primary-50">
              <div className="flex items-center">
                <Video className="h-6 w-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">פרטי פגישה: {selectedRoom.title || 'פגישה ללא כותרת'}</h2>
              </div>
              <button 
                onClick={() => setShowRoomDetails(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">פרטי הפגישה</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">קוד פגישה:</dt>
                      <dd className="text-sm text-gray-900">{selectedRoom.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">מארח:</dt>
                      <dd className="text-sm text-gray-900">{selectedRoom.hostName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">סוג פגישה:</dt>
                      <dd className="text-sm text-gray-900">{selectedRoom.isPrivate ? 'פרטית' : 'ציבורית'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">זמן התחלה:</dt>
                      <dd className="text-sm text-gray-900">{roomStats.startTime}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">משך פגישה:</dt>
                      <dd className="text-sm text-gray-900">{roomStats.duration}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">מספר משתתפים:</dt>
                      <dd className="text-sm text-gray-900">{selectedRoom.participants}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">משתתפים מחוברים</h3>
                  {roomStats.connectedUsers.length > 0 ? (
                    <ul className="space-y-2">
                      {roomStats.connectedUsers.map((user, index) => (
                        <li key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <span className="text-primary-700 font-medium">{user.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user}</p>
                            <p className="text-xs text-gray-500">
                              {index === 0 ? 'מארח' : 'משתתף'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">אין משתתפים מחוברים</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                  <button
                    onClick={() => setShowRoomDetails(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    סגור
                  </button>
                  <button
                    onClick={() => {
                      setShowRoomDetails(false);
                      handleJoinRoom(selectedRoom);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <Phone className="h-4 w-4 mr-2 inline-block" />
                    הצטרף לפגישה
                  </button>
                  <button
                    onClick={() => {
                      setShowRoomDetails(false);
                      confirmCloseRoom(selectedRoom);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 inline-block" />
                    סגור פגישה
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOnlineMeetings;