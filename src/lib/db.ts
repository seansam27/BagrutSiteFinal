import { User, Subject, Exam, Comment, Message, ExamForm, QuestionSolution } from '../types';

// Use localStorage for browser-based storage
const STORAGE_KEYS = {
  USERS: 'bagrut_users',
  SUBJECTS: 'bagrut_subjects',
  EXAMS: 'bagrut_exams',
  COMMENTS: 'bagrut_comments',
  MESSAGES: 'bagrut_messages',
  EXAM_FORMS: 'bagrut_exam_forms',
  QUESTION_SOLUTIONS: 'bagrut_question_solutions'
};

// Initialize the database with sample data
const initDb = () => {
  // Initialize users if not exists
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const users: User[] = [
      {
        id: 'user-1',
        email: 'user@example.com',
        password: 'password123', // In a real app, this would be hashed
        first_name: 'משתמש',
        last_name: 'רגיל',
        birth_date: '2000-01-01',
        role: 'user',
        created_at: new Date().toISOString()
      },
      {
        id: 'admin-1',
        email: 'admin@example.com',
        password: 'password123', // In a real app, this would be hashed
        first_name: 'מנהל',
        last_name: 'מערכת',
        birth_date: '1990-01-01',
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Initialize subjects if not exists
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    const subjects: Subject[] = [
      {
        id: 'subject-1',
        name: 'מתמטיקה 5 יח\'',
      },
      {
        id: 'subject-2',
        name: 'פיזיקה 5 יח\'',
      },
      {
        id: 'subject-3',
        name: 'אנגלית 5 יח\'',
      }
    ];
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }

  // Initialize exams if not exists
  if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
    const exams: Exam[] = [
      {
        id: 'exam-1',
        subject: 'subject-1',
        year: 2023,
        exam_file_url: 'https://example.com/math_2023.pdf',
        solution_file_url: 'https://example.com/math_2023_solution.pdf',
        solution_video_url: 'https://www.youtube.com/watch?v=example1',
        created_at: new Date().toISOString()
      },
      {
        id: 'exam-2',
        subject: 'subject-1',
        year: 2022,
        exam_file_url: 'https://example.com/math_2022.pdf',
        solution_file_url: 'https://example.com/math_2022_solution.pdf',
        solution_video_url: 'https://www.youtube.com/watch?v=example2',
        created_at: new Date().toISOString()
      },
      {
        id: 'exam-3',
        subject: 'subject-2',
        year: 2023,
        exam_file_url: 'https://example.com/physics_2023.pdf',
        solution_file_url: 'https://example.com/physics_2023_solution.pdf',
        solution_video_url: 'https://www.youtube.com/watch?v=example3',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  }

  // Initialize comments if not exists
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    const comments: Comment[] = [
      {
        id: 'comment-1',
        exam_id: 'exam-1',
        user_id: 'user-1',
        user_name: 'משתמש רגיל',
        user_role: 'user',
        content: 'האם מישהו יכול להסביר את השאלה הראשונה?',
        created_at: new Date().toISOString()
      },
      {
        id: 'comment-2',
        exam_id: 'exam-1',
        user_id: 'admin-1',
        user_name: 'מנהל מערכת',
        user_role: 'admin',
        content: 'בוודאי! בשאלה הראשונה צריך להשתמש בנוסחת הכפל המקוצר.',
        created_at: new Date(Date.now() + 1000 * 60 * 60).toISOString() // 1 hour later
      }
    ];
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }

  // Initialize messages if not exists
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    const messages: Message[] = [
      {
        id: 'message-1',
        sender_id: 'admin-1',
        sender_name: 'מנהל מערכת',
        recipient_id: 'user-1',
        recipient_name: 'משתמש רגיל',
        subject: 'ברוכים הבאים לבגרויות ישראל',
        content: 'שלום משתמש רגיל,\n\nברוכים הבאים למערכת בגרויות ישראל! אנו שמחים שהצטרפת אלינו.\n\nבאתר תוכל למצוא מגוון רחב של בגרויות, פתרונות וסרטוני הסבר שיעזרו לך להתכונן לבחינות הבגרות בצורה הטובה ביותר.\n\nאם יש לך שאלות או בקשות, אל תהסס לפנות אלינו.\n\nבהצלחה!\nצוות בגרויות ישראל',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }

  // Initialize exam forms if not exists
  if (!localStorage.getItem(STORAGE_KEYS.EXAM_FORMS)) {
    const examForms: ExamForm[] = [
      {
        id: 'form-1',
        subject_id: 'subject-1',
        name: '581',
      },
      {
        id: 'form-2',
        subject_id: 'subject-1',
        name: '582',
      },
      {
        id: 'form-3',
        subject_id: 'subject-2',
        name: '917',
      }
    ];
    localStorage.setItem(STORAGE_KEYS.EXAM_FORMS, JSON.stringify(examForms));
  }

  // Initialize question solutions if not exists
  if (!localStorage.getItem(STORAGE_KEYS.QUESTION_SOLUTIONS)) {
    const questionSolutions: QuestionSolution[] = [
      {
        id: 'solution-1',
        exam_id: 'exam-1',
        question_number: 1,
        solution_video_url: 'https://www.youtube.com/watch?v=example-q1',
        created_at: new Date().toISOString()
      },
      {
        id: 'solution-2',
        exam_id: 'exam-1',
        question_number: 2,
        solution_video_url: 'https://www.youtube.com/watch?v=example-q2',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.QUESTION_SOLUTIONS, JSON.stringify(questionSolutions));
  }
};

// Initialize the database
initDb();

// Helper functions to get and save data
const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const getSubjectsData = (): Subject[] => {
  const subjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
  return subjects ? JSON.parse(subjects) : [];
};

const saveSubjects = (subjects: Subject[]) => {
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
};

const getExamsData = (): Exam[] => {
  const exams = localStorage.getItem(STORAGE_KEYS.EXAMS);
  return exams ? JSON.parse(exams) : [];
};

const saveExams = (exams: Exam[]) => {
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
};

const getCommentsData = (): Comment[] => {
  const comments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
  return comments ? JSON.parse(comments) : [];
};

const saveComments = (comments: Comment[]) => {
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
};

const getMessagesData = (): Message[] => {
  const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return messages ? JSON.parse(messages) : [];
};

const saveMessages = (messages: Message[]) => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};

const getExamFormsData = (): ExamForm[] => {
  const examForms = localStorage.getItem(STORAGE_KEYS.EXAM_FORMS);
  return examForms ? JSON.parse(examForms) : [];
};

const saveExamForms = (examForms: ExamForm[]) => {
  localStorage.setItem(STORAGE_KEYS.EXAM_FORMS, JSON.stringify(examForms));
};

const getQuestionSolutionsData = (): QuestionSolution[] => {
  const questionSolutions = localStorage.getItem(STORAGE_KEYS.QUESTION_SOLUTIONS);
  return questionSolutions ? JSON.parse(questionSolutions) : [];
};

const saveQuestionSolutions = (questionSolutions: QuestionSolution[]) => {
  localStorage.setItem(STORAGE_KEYS.QUESTION_SOLUTIONS, JSON.stringify(questionSolutions));
};

// Authentication functions
export const signIn = (email: string, password: string): { user: User | null; error: any } => {
  try {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { user: null, error: { message: 'Invalid login credentials' } };
    }
    
    // Create a copy without the password
    const { password: _, ...userWithoutPassword } = user;
    
    return { 
      user: userWithoutPassword as User, 
      error: null 
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error };
  }
};

export const signUp = (
  email: string, 
  password: string, 
  userData: Partial<User>
): { user: User | null; error: any } => {
  try {
    const users = getUsers();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return { user: null, error: { message: 'User already exists' } };
    }
    
    const userId = `user-${Date.now()}`;
    
    // Create new user
    const newUser: User = {
      id: userId,
      email,
      password, // In a real app, this would be hashed
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      birth_date: userData.birth_date || '',
      role: userData.role || 'user',
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    saveUsers([...users, newUser]);
    
    // Send welcome message from admin to new user
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        sender_id: adminUser.id,
        sender_name: `${adminUser.first_name} ${adminUser.last_name}`,
        recipient_id: userId,
        recipient_name: `${newUser.first_name} ${newUser.last_name}`,
        subject: 'ברוכים הבאים לבגרויות ישראל',
        content: `שלום ${newUser.first_name},\n\nברוכים הבאים למערכת בגרויות ישראל! אנו שמחים שהצטרפת אלינו.\n\nבאתר תוכל למצוא מגוון רחב של בגרויות, פתרונות וסרטוני הסבר שיעזרו לך להתכונן לבחינות הבגרות בצורה הטובה ביותר.\n\nאם יש לך שאלות או בקשות, אל תהסס לפנות אלינו.\n\nבהצלחה!\nצוות בגרויות ישראל`,
        is_read: false,
        created_at: new Date().toISOString()
      };
      
      // Add welcome message to messages
      const messages = getMessagesData();
      saveMessages([...messages, welcomeMessage]);
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword as User, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error };
  }
};

export const updateProfile = (userId: string, updates: Partial<User>): { success: boolean; error: any } => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, error: { message: 'User not found' } };
    }
    
    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };
    
    // Save to localStorage
    saveUsers(users);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error };
  }
};

export const updatePassword = (userId: string, newPassword: string): { success: boolean; error: any } => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, error: { message: 'User not found' } };
    }
    
    // Update password
    users[userIndex].password = newPassword;
    
    // Save to localStorage
    saveUsers(users);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error };
  }
};

export const deleteUser = (userId: string): { success: boolean; error: any } => {
  try {
    const users = getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    
    if (updatedUsers.length === users.length) {
      return { success: false, error: { message: 'User not found' } };
    }
    
    // Save to localStorage
    saveUsers(updatedUsers);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, error };
  }
};

// Add a new user (for admin use)
export const addUser = (
  email: string,
  password: string,
  userData: Partial<User>
): { data: User | null; error: any } => {
  try {
    const users = getUsers();
    
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { data: null, error: { message: 'User already exists' } };
    }
    
    const userId = `user-${Date.now()}`;
    
    // Create new user
    const newUser: User = {
      id: userId,
      email,
      password, // In a real app, this would be hashed
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      birth_date: userData.birth_date || '',
      role: userData.role || 'user',
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    saveUsers([...users, newUser]);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return { data: userWithoutPassword as User, error: null };
  } catch (error) {
    console.error('Add user error:', error);
    return { data: null, error };
  }
};

// Subject functions
export const getSubjects = (): { data: Subject[]; error: any } => {
  try {
    const subjects = getSubjectsData();
    return { data: subjects, error: null };
  } catch (error) {
    console.error('Get subjects error:', error);
    return { data: [], error };
  }
};

export const addSubject = (name: string): { data: Subject | null; error: any } => {
  try {
    const subjects = getSubjectsData();
    
    // Check if subject already exists
    if (subjects.some(s => s.name === name)) {
      return { data: null, error: { message: 'Subject already exists' } };
    }
    
    const newSubject: Subject = {
      id: `subject-${Date.now()}`,
      name,
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    saveSubjects([...subjects, newSubject]);
    
    return { data: newSubject, error: null };
  } catch (error) {
    console.error('Add subject error:', error);
    return { data: null, error };
  }
};

export const deleteSubject = (subjectId: string): { success: boolean; error: any } => {
  try {
    const subjects = getSubjectsData();
    const updatedSubjects = subjects.filter(s => s.id !== subjectId);
    
    if (updatedSubjects.length === subjects.length) {
      return { success: false, error: { message: 'Subject not found' } };
    }
    
    // Save to localStorage
    saveSubjects(updatedSubjects);
    
    // Also delete related exams
    const exams = getExamsData();
    const updatedExams = exams.filter(e => e.subject !== subjectId);
    saveExams(updatedExams);
    
    // Also delete related exam forms
    const examForms = getExamFormsData();
    const updatedExamForms = examForms.filter(f => f.subject_id !== subjectId);
    saveExamForms(updatedExamForms);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete subject error:', error);
    return { success: false, error };
  }
};

// Exam functions
export const getExams = (): { data: Exam[]; error: any } => {
  try {
    const exams = getExamsData();
    return { data: exams, error: null };
  } catch (error) {
    console.error('Get exams error:', error);
    return { data: [], error };
  }
};

export const getExam = (examId: string): { data: Exam | null; error: any } => {
  try {
    const exams = getExamsData();
    const exam = exams.find(e => e.id === examId);
    
    if (!exam) {
      return { data: null, error: { message: 'Exam not found' } };
    }
    
    return { data: exam, error: null };
  } catch (error) {
    console.error('Get exam error:', error);
    return { data: null, error };
  }
};

export const addExam = (
  subject: string,
  year: number,
  examFileUrl: string,
  solutionFileUrl: string,
  solutionVideoUrl: string,
  form?: string,
  season?: 'winter' | 'summer'
): { data: Exam | null; error: any } => {
  try {
    const exams = getExamsData();
    
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      subject,
      year,
      exam_file_url: examFileUrl,
      solution_file_url: solutionFileUrl,
      solution_video_url: solutionVideoUrl,
      form,
      season,
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    saveExams([...exams, newExam]);
    
    return { data: newExam, error: null };
  } catch (error) {
    console.error('Add exam error:', error);
    return { data: null, error };
  }
};

export const updateExam = (examId: string, updates: Partial<Exam>): { data: Exam | null; error: any } => {
  try {
    const exams = getExamsData();
    const examIndex = exams.findIndex(e => e.id === examId);
    
    if (examIndex === -1) {
      return { data: null, error: { message: 'Exam not found' } };
    }
    
    // Update exam
    exams[examIndex] = { ...exams[examIndex], ...updates };
    
    // Save to localStorage
    saveExams(exams);
    
    return { data: exams[examIndex], error: null };
  } catch (error) {
    console.error('Update exam error:', error);
    return { data: null, error };
  }
};

export const deleteExam = (examId: string): { success: boolean; error: any } => {
  try {
    const exams = getExamsData();
    const updatedExams = exams.filter(e => e.id !== examId);
    
    if (updatedExams.length === exams.length) {
      return { success: false, error: { message: 'Exam not found' } };
    }
    
    // Save to localStorage
    saveExams(updatedExams);
    
    // Also delete related question solutions
    const questionSolutions = getQuestionSolutionsData();
    const updatedQuestionSolutions = questionSolutions.filter(qs => qs.exam_id !== examId);
    saveQuestionSolutions(updatedQuestionSolutions);
    
    // Also delete related comments
    const comments = getCommentsData();
    const updatedComments = comments.filter(c => c.exam_id !== examId);
    saveComments(updatedComments);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete exam error:', error);
    return { success: false, error };
  }
};

// Comment functions
export const getComments = (examId: string): { data: Comment[]; error: any } => {
  try {
    const comments = getCommentsData();
    const filteredComments = comments.filter(c => c.exam_id === examId);
    return { data: filteredComments, error: null };
  } catch (error) {
    console.error('Get comments error:', error);
    return { data: [], error };
  }
};

export const addComment = (
  examId: string,
  userId: string,
  content: string,
  imageUrl?: string
): { data: Comment | null; error: any } => {
  try {
    const comments = getCommentsData();
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return { data: null, error: { message: 'User not found' } };
    }
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      exam_id: examId,
      user_id: userId,
      user_name: `${user.first_name} ${user.last_name}`,
      user_role: user.role,
      content,
      image_url: imageUrl,
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    saveComments([...comments, newComment]);
    
    return { data: newComment, error: null };
  } catch (error) {
    console.error('Add comment error:', error);
    return { data: null, error };
  }
};

export const deleteComment = (commentId: string): { success: boolean; error: any } => {
  try {
    const comments = getCommentsData();
    const updatedComments = comments.filter(c => c.id !== commentId);
    
    if (updatedComments.length === comments.length) {
      return { success: false, error: { message: 'Comment not found' } };
    }
    
    // Save to localStorage
    saveComments(updatedComments);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete comment error:', error);
    return { success: false, error };
  }
};

// Message functions
export const getMessages = (userId: string): { data: Message[]; error: any } => {
  try {
    const messages = getMessagesData();
    const userMessages = messages.filter(m => m.sender_id === userId || m.recipient_id === userId);
    return { data: userMessages, error: null };
  } catch (error) {
    console.error('Get messages error:', error);
    return { data: [], error };
  }
};

export const getMessage = (messageId: string): { data: Message | null; error: any } => {
  try {
    const messages = getMessagesData();
    const message = messages.find(m => m.id === messageId);
    
    if (!message) {
      return { data: null, error: { message: 'Message not found' } };
    }
    
    return { data: message, error: null };
  } catch (error) {
    console.error('Get message error:', error);
    return { data: null, error };
  }
};

export const sendMessage = (
  senderId: string,
  recipientId: string,
  subject: string,
  content: string,
  attachmentUrl?: string,
  attachmentName?: string
): { data: Message | null; error: any } => {
  try {
    const messages = getMessagesData();
    const users = getUsers();
    
    const sender = users.find(u => u.id === senderId);
    const recipient = users.find(u => u.id === recipientId);
    
    if (!sender || !recipient) {
      return { data: null, error: { message: 'Sender or recipient not found' } };
    }
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender_id: senderId,
      sender_name: `${sender.first_name} ${sender.last_name}`,
      recipient_id: recipientId,
      recipient_name: `${recipient.first_name} ${recipient.last_name}`,
      subject,
      content,
      attachment_url: attachmentUrl,
      attachment_name: attachmentName,
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    saveMessages([...messages, newMessage]);
    
    return { data: newMessage, error: null };
  } catch (error) {
    console.error('Send message error:', error);
    return { data: null, error };
  }
};

export const markMessageAsRead = (messageId: string): { success: boolean; error: any } => {
  try {
    const messages = getMessagesData();
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex === -1) {
      return { success: false, error: { message: 'Message not found' } };
    }
    
    // Mark as read
    messages[messageIndex].is_read = true;
    
    // Save to localStorage
    saveMessages(messages);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Mark message as read error:', error);
    return { success: false, error };
  }
};

export const deleteMessage = (messageId: string): { success: boolean; error: any } => {
  try {
    const messages = getMessagesData();
    const updatedMessages = messages.filter(m => m.id !== messageId);
    
    if (updatedMessages.length === messages.length) {
      return { success: false, error: { message: 'Message not found' } };
    }
    
    // Save to localStorage
    saveMessages(updatedMessages);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete message error:', error);
    return { success: false, error };
  }
};

export const getUnreadMessagesCount = (userId: string): number => {
  try {
    const messages = getMessagesData();
    return messages.filter(m => m.recipient_id === userId && !m.is_read).length;
  } catch (error) {
    console.error('Get unread messages count error:', error);
    return 0;
  }
};

// Exam Form functions
export const getExamForms = (): { data: ExamForm[]; error: any } => {
  try {
    const examForms = getExamFormsData();
    return { data: examForms, error: null };
  } catch (error) {
    console.error('Get exam forms error:', error);
    return { data: [], error };
  }
};

export const getExamFormsBySubject = (subjectId: string): { data: ExamForm[]; error: any } => {
  try {
    const examForms = getExamFormsData();
    const filteredForms = examForms.filter(f => f.subject_id === subjectId);
    return { data: filteredForms, error: null };
  } catch (error) {
    console.error('Get exam forms by subject error:', error);
    return { data: [], error };
  }
};

export const addExamForm = (subjectId: string, name: string): { data: ExamForm | null; error: any } => {
  try {
    const examForms = getExamFormsData();
    
    // Check if form already exists for this subject
    if (examForms.some(f => f.subject_id === subjectId && f.name === name)) {
      return { data: null, error: { message: 'Exam form already exists for this subject' } };
    }
    
    const newForm: ExamForm = {
      id: `form-${Date.now()}`,
      subject_id: subjectId,
      name,
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    saveExamForms([...examForms, newForm]);
    
    return { data: newForm, error: null };
  } catch (error) {
    console.error('Add exam form error:', error);
    return { data: null, error };
  }
};

export const deleteExamForm = (formId: string): { success: boolean; error: any } => {
  try {
    const examForms = getExamFormsData();
    const updatedForms = examForms.filter(f => f.id !== formId);
    
    if (updatedForms.length === examForms.length) {
      return { success: false, error: { message: 'Exam form not found' } };
    }
    
    // Save to localStorage
    saveExamForms(updatedForms);
    
    // Update exams that use this form
    const exams = getExamsData();
    const updatedExams = exams.map(e => {
      if (e.form === formId) {
        const { form, ...rest } = e;
        return rest;
      }
      return e;
    });
    saveExams(updatedExams);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete exam form error:', error);
    return { success: false, error };
  }
};

// Question Solution functions
export const getQuestionSolutions = (examId: string): { data: QuestionSolution[]; error: any } => {
  try {
    const questionSolutions = getQuestionSolutionsData();
    const filteredSolutions = questionSolutions.filter(qs => qs.exam_id === examId);
    return { data: filteredSolutions, error: null };
  } catch (error) {
    console.error('Get question solutions error:', error);
    return { data: [], error };
  }
};

export const addQuestionSolution = (
  examId: string,
  questionNumber: number,
  solutionVideoUrl: string,
  solutionText?: string
): { data: QuestionSolution | null; error: any } => {
  try {
    const questionSolutions = getQuestionSolutionsData();
    
    // Check if solution already exists for this question
    if (questionSolutions.some(qs => qs.exam_id === examId && qs.question_number === questionNumber)) {
      return { data: null, error: { message: 'Solution already exists for this question' } };
    }
    
    const newSolution: QuestionSolution = {
      id: `solution-${Date.now()}`,
      exam_id: examId,
      question_number: questionNumber,
      solution_video_url: solutionVideoUrl,
      solution_text: solutionText,
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage
    saveQuestionSolutions([...questionSolutions, newSolution]);
    
    return { data: newSolution, error: null };
  } catch (error) {
    console.error('Add question solution error:', error);
    return { data: null, error };
  }
};

export const updateQuestionSolution = (
  solutionId: string,
  updates: Partial<QuestionSolution>
): { data: QuestionSolution | null; error: any } => {
  try {
    const questionSolutions = getQuestionSolutionsData();
    const solutionIndex = questionSolutions.findIndex(qs => qs.id === solutionId);
    
    if (solutionIndex === -1) {
      return { data: null, error: { message: 'Question solution not found' } };
    }
    
    // Update solution
    questionSolutions[solutionIndex] = { ...questionSolutions[solutionIndex], ...updates };
    
    // Save to localStorage
    saveQuestionSolutions(questionSolutions);
    
    return { data: questionSolutions[solutionIndex], error: null };
  } catch (error) {
    console.error('Update question solution error:', error);
    return { data: null, error };
  }
};

export const deleteQuestionSolution = (solutionId: string): { success: boolean; error: any } => {
  try {
    const questionSolutions = getQuestionSolutionsData();
    const updatedSolutions = questionSolutions.filter(qs => qs.id !== solutionId);
    
    if (updatedSolutions.length === questionSolutions.length) {
      return { success: false, error: { message: 'Question solution not found' } };
    }
    
    // Save to localStorage
    saveQuestionSolutions(updatedSolutions);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete question solution error:', error);
    return { success: false, error };
  }
};

// User data functions for admin
export const getUsersData = (): { data: User[]; error: any } => {
  try {
    const users = getUsers();
    // Remove passwords
    const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
    return { data: usersWithoutPasswords as User[], error: null };
  } catch (error) {
    console.error('Get users data error:', error);
    return { data: [], error };
  }
};

export const getUsersCount = (): number => {
  try {
    const users = getUsers();
    return users.length;
  } catch (error) {
    console.error('Get users count error:', error);
    return 0;
  }
};

export const getExamsCount = (): number => {
  try {
    const exams = getExamsData();
    return exams.length;
  } catch (error) {
    console.error('Get exams count error:', error);
    return 0;
  }
};

export const getSubjectsCount = (): number => {
  try {
    const subjects = getSubjectsData();
    return subjects.length;
  } catch (error) {
    console.error('Get subjects count error:', error);
    return 0;
  }
};

export const getUsersByMonth = (months: number): { month: string; count: number }[] => {
  try {
    const users = getUsers();
    const result: { month: string; count: number }[] = [];
    
    // Get the last N months
    const now = new Date();
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      result.push({ month, count: 0 });
    }
    
    // Count users by month
    users.forEach(user => {
      const date = new Date(user.created_at);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthIndex = result.findIndex(r => r.month === month);
      if (monthIndex !== -1) {
        result[monthIndex].count++;
      }
    });
    
    return result.reverse();
  } catch (error) {
    console.error('Get users by month error:', error);
    return [];
  }
};

export const getRecentUsers = (limit: number): User[] => {
  try {
    const users = getUsers();
    // Sort by created_at (newest first)
    const sortedUsers = [...users].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    // Remove passwords
    const usersWithoutPasswords = sortedUsers
      .slice(0, limit)
      .map(({ password, ...rest }) => rest);
    return usersWithoutPasswords as User[];
  } catch (error) {
    console.error('Get recent users error:', error);
    return [];
  }
};

export const searchUsers = (query: string): { data: User[]; error: any } => {
  try {
    const users = getUsers();
    const filteredUsers = users.filter(user => 
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.first_name.toLowerCase().includes(query.toLowerCase()) ||
      user.last_name.toLowerCase().includes(query.toLowerCase())
    );
    // Remove passwords
    const usersWithoutPasswords = filteredUsers.map(({ password, ...rest }) => rest);
    return { data: usersWithoutPasswords as User[], error: null };
  } catch (error) {
    console.error('Search users error:', error);
    return { data: [], error };
  }
};