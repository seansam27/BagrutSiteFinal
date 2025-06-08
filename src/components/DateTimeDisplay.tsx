import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface DateTimeDisplayProps {
  userName?: string;
  variant?: 'light' | 'dark';
  showGreeting?: boolean;
}

const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({ 
  userName, 
  variant = 'dark',
  showGreeting = false 
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hours = time.getHours();
    if (hours >= 5 && hours < 12) {
      return 'בוקר טוב';
    } else if (hours >= 12 && hours < 18) {
      return 'צהריים טובים';
    } else {
      return 'ערב טוב';
    }
  };

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <div className="flex items-center">
        <Clock className={`h-5 w-5 ${variant === 'light' ? 'text-white/80' : 'text-primary-600'} mr-2`} />
        <span className="text-lg font-medium">
          {format(time, 'HH:mm:ss')}
        </span>
      </div>
      <div className="flex items-center">
        <Calendar className={`h-5 w-5 ${variant === 'light' ? 'text-white/80' : 'text-primary-600'} mr-2`} />
        <span className="text-lg font-medium">
          {format(time, 'EEEE, d בMMMM yyyy', { locale: he })}
        </span>
      </div>
    </div>
  );
};

export default DateTimeDisplay;