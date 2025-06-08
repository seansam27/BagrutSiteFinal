import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import DatePicker, { registerLocale } from 'react-datepicker';
import { format, parse, startOfWeek, getDay, addMonths, subMonths, isSameMonth, isToday } from 'date-fns';
import { he } from 'date-fns/locale';
import { Plus, Search, Bell, Calendar as CalendarIcon, Clock, AlertCircle, ChevronLeft, ChevronRight, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';

// Register Hebrew locale for DatePicker
registerLocale('he', he);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  type: 'task' | 'reminder' | 'exam';
  priority: 'low' | 'medium' | 'high';
}

interface EventModalProps {
  type: 'task' | 'reminder' | 'exam';
  onClose: () => void;
  onSubmit: (event: Omit<Event, 'id'>) => void;
}

const EventModal: React.FC<EventModalProps> = ({ type, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'נדרש למלא כותרת';
    if (!date) newErrors.date = 'נדרש לבחור תאריך';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onSubmit({
      title,
      start: date,
      end: date,
      description,
      type,
      priority: 'medium'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 animate-zoomIn">
        <div className={`px-6 py-4 border-b border-gray-200 flex justify-between items-center ${
          type === 'task' ? 'bg-blue-50' : type === 'exam' ? 'bg-red-50' : 'bg-green-50'
        }`}>
          <h2 className={`text-xl font-semibold ${
            type === 'task' ? 'text-blue-800' : type === 'exam' ? 'text-red-800' : 'text-green-800'
          }`}>
            {type === 'task' ? 'משימה חדשה' : type === 'exam' ? 'בחינה חדשה' : 'תזכורת חדשה'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date || new Date())}
                locale="he"
                dateFormat="dd/MM/yyyy"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-md ${
                  type === 'task' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : type === 'exam' 
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                שמור
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const locales = {
  'he': he,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [modalType, setModalType] = useState<'task' | 'reminder' | 'exam' | null>(null);
  const [view, setView] = useState<View>('month');

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'בגרות במתמטיקה',
        start: addMonths(new Date(), 1),
        end: addMonths(new Date(), 1),
        type: 'exam',
        priority: 'high',
        description: 'בגרות במתמטיקה 5 יחידות'
      },
      {
        id: '2',
        title: 'להגיש עבודה בהיסטוריה',
        start: subMonths(new Date(), 1),
        end: subMonths(new Date(), 1),
        type: 'task',
        priority: 'medium',
        description: 'עבודה על מלחמת העולם השנייה'
      },
      {
        id: '3',
        title: 'מבחן באנגלית',
        start: new Date(),
        end: new Date(),
        type: 'exam',
        priority: 'high',
        description: 'מבחן באנגלית 5 יחידות'
      }
    ];
    setEvents(mockEvents);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, events]);

  useEffect(() => {
    if (searchDate) {
      const targetDate = format(searchDate, 'yyyy-MM-dd');
      const event = events.find(event => format(event.start, 'yyyy-MM-dd') === targetDate);
      if (event) {
        setSelectedDate(searchDate);
        navigate(`/calendar/date/${targetDate}`);
      }
    }
  }, [searchDate, events, navigate]);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    navigate(`/calendar/date/${format(start, 'yyyy-MM-dd')}`);
  };

  const handleSelectEvent = (event: Event) => {
    navigate(`/calendar/event/${event.id}`);
  };

  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}`
    };
    setEvents([...events, newEvent]);
  };

  const upcomingEvents = events
    .filter(event => event.start >= new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !searchDate || format(event.start, 'yyyy-MM-dd') === format(searchDate, 'yyyy-MM-dd');
    return matchesSearch && matchesDate;
  });

  const handleQuickAction = (type: 'task' | 'reminder' | 'exam') => {
    setModalType(type);
  };

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
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <BigCalendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            view={view}
            onView={setView}
            culture="he"
            messages={{
              next: 'החודש הבא',
              previous: 'החודש הקודם',
              month: 'חודש',
              week: 'שבוע',
              day: 'יום',
              agenda: 'סדר יום',
              date: 'תאריך',
              time: 'שעה',
              event: 'אירוע',
              noEventsInRange: 'אין אירועים בטווח זה',
              showMore: (total) => `עוד ${total} אירועים`,
            }}
            eventPropGetter={(event) => ({
              className: `bg-opacity-90 hover:bg-opacity-100 transition-all duration-200 ${
                event.type === 'exam' 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : event.type === 'task'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`,
            })}
            dayPropGetter={(date) => ({
              className: `
                ${!isSameMonth(date, selectedDate || new Date()) ? 'text-gray-400 bg-gray-50' : ''}
                ${isToday(date) ? 'border-2 border-primary-500' : ''}
                hover:bg-gray-50 transition-colors duration-200
              `,
            })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-primary-700">
              <Plus className="h-5 w-5 mr-2" />
              פעולות מהירות
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleQuickAction('task')}
                className="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                משימה חדשה
              </button>
              <button
                onClick={() => handleQuickAction('exam')}
                className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                בחינה חדשה
              </button>
              <button
                onClick={() => handleQuickAction('reminder')}
                className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center justify-center font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                תזכורת חדשה
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-primary-700">
              <Bell className="h-5 w-5 mr-2" />
              אירועים קרובים
            </h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => handleSelectEvent(event)}
                    className={`w-full p-4 rounded-lg border text-right transition-all duration-200 transform hover:scale-102 hover:shadow-md ${
                      event.type === 'exam'
                        ? 'border-red-200 bg-red-50 hover:bg-red-100'
                        : event.type === 'task'
                        ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                        : 'border-green-200 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-sm text-gray-500">
                        {format(event.start, 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {event.type === 'exam' ? 'בחינה' : event.type === 'task' ? 'משימה' : 'תזכורת'}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>אין אירועים קרובים</p>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-primary-700">
              <Search className="h-5 w-5 mr-2" />
              חיפוש וסינון
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="חפש אירועים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        className="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setSearchQuery('');
                          handleSelectEvent(result);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{result.title}</span>
                          <span className="text-sm text-gray-500">
                            {format(result.start, 'dd/MM/yyyy')}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {result.description}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סינון לפי תאריך
                </label>
                <DatePicker
                  selected={searchDate}
                  onChange={(date) => setSearchDate(date)}
                  locale="he"
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable
                  placeholderText="בחר תאריך..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  calendarClassName="bg-white shadow-lg border border-gray-200 rounded-lg"
                  popperClassName="z-50"
                  popperPlacement="bottom-end"
                  customInput={
                    <div className="relative">
                      <input
                        type="image"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        readOnly
                        value={searchDate ? format(searchDate, 'dd/MM/yyyy') : ''}
                        placeholder="בחר תאריך..."
                      />
                      <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Creation Modal */}
      {modalType && (
        <EventModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSubmit={handleAddEvent}
        />
      )}
    </div>
  );
};

export default Calendar;