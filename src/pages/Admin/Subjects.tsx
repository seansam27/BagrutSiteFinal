import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Subjects: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new exam management page
    navigate('/admin/exam-management');
  }, [navigate]);

  return null;
};

export default Subjects;