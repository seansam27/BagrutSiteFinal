import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, ArrowLeft, CheckCircle, Star, Calculator, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 relative overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fadeIn">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">ברוכים הבאים לבגרויות ישראל</h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">המקום המושלם להתכונן לבחינות הבגרות שלך עם מאגר עצום של בחינות, פתרונות וסרטוני הסבר</p>
              {!user && (
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 hover-lift"
                  >
                    הירשם עכשיו
                  </Link>
                  <Link
                    to="/login"
                    className="bg-primary-700 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-800 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 hover-lift"
                  >
                    התחבר
                  </Link>
                </div>
              )}
              {user && (
                <Link
                  to="/exams"
                  className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 hover-lift"
                >
                  צפה בבגרויות
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient-purple">למה בגרויות ישראל?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 card-hover">
              <div className="flex justify-center mb-6">
                <div className="bg-primary-100 p-4 rounded-full">
                  <BookOpen className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">מבחני בגרות מכל השנים</h3>
              <p className="text-gray-600">
                גישה למאגר עצום של מבחני בגרות מכל השנים והמקצועות, מסודרים בצורה נוחה לחיפוש ושימוש
              </p>
              <ul className="mt-4 text-right">
                <li className="flex items-center justify-end mb-2">
                  <span className="ml-2">בגרויות מעודכנות</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
                <li className="flex items-center justify-end mb-2">
                  <span className="ml-2">כל המקצועות</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
                <li className="flex items-center justify-end">
                  <span className="ml-2">חיפוש מתקדם</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 card-hover">
              <div className="flex justify-center mb-6">
                <div className="bg-primary-100 p-4 rounded-full">
                  <GraduationCap className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">פתרונות מלאים</h3>
              <p className="text-gray-600">
                פתרונות מפורטים לכל שאלה, כתובים על ידי מורים מנוסים, עם הסברים מקיפים לכל שלב בפתרון
              </p>
              <ul className="mt-4 text-right">
                <li className="flex items-center justify-end mb-2">
                  <span className="ml-2">פתרונות מפורטים</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
                <li className="flex items-center justify-end mb-2">
                  <span className="ml-2">הסברים מקיפים</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
                <li className="flex items-center justify-end">
                  <span className="ml-2">כתובים ע"י מורים מנוסים</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 card-hover">
              <div className="flex justify-center mb-6">
                <div className="bg-primary-100 p-4 rounded-full">
                  <FileText className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">סרטוני הסבר</h3>
              <p className="text-gray-600">
                סרטוני הסבר מפורטים לפתרון הבחינות, צעד אחר צעד, המאפשרים הבנה מעמיקה של החומר
              </p>
              <ul className="mt-4 text-right">
                <li className="flex items-center justify-end mb-2">
                  <span className="ml-2">הסברים צעד אחר צעד</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
                <li className="flex items-center justify-end mb-2">
                  <span className="ml-2">איכות גבוהה</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
                <li className="flex items-center justify-end">
                  <span className="ml-2">מרצים מקצועיים</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient-purple">מה אומרים עלינו?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex text-primary-500 mb-2">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-600 mb-4">
                  "בזכות בגרויות ישראל הצלחתי להתכונן בצורה יעילה לבגרות במתמטיקה 5 יח'. הפתרונות המפורטים והסרטונים עזרו לי להבין את החומר בצורה מעמיקה."
                </p>
                <div className="font-medium">רון כהן, תלמיד י"ב</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex text-primary-500 mb-2">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-600 mb-4">
                  "כמורה לפיזיקה, אני ממליץ לכל התלמידים שלי להשתמש באתר. המאגר העשיר של בגרויות ופתרונות מאפשר לתלמידים להתאמן על מגוון רחב של שאלות."
                </p>
                <div className="font-medium">ד"ר יעל לוי, מורה לפיזיקה</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex text-primary-500 mb-2">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-600 mb-4">
                  "האתר מאורגן בצורה נהדרת ונוח לשימוש. הצלחתי למצוא בקלות את כל הבגרויות באנגלית שחיפשתי, והסרטונים עזרו לי להבין את הטעויות שלי."
                </p>
                <div className="font-medium">מיכל אברהם, תלמידת י"ב</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">מוכנים להצליח בבגרויות?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              הירשמו עכשיו וקבלו גישה מלאה לכל המשאבים שלנו - בגרויות, פתרונות וסרטוני הסבר
            </p>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 hover-lift"
              >
                הירשם בחינם
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            )}
            {user && (
              <Link
                to="/exams"
                className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 hover-lift"
              >
                צפה בבגרויות
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;