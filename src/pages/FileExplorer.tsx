import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileExplorerItem } from '../types';
import { format } from 'date-fns';
import bytes from 'bytes';
import { useNavigate } from 'react-router-dom';
import { Folder, FileText, FileSpreadsheet, Presentation as FilePresentation, File as FilePdf, ChevronRight, Plus, Upload, ArrowUpRight, SortAsc, SortDesc, Search, AlertCircle, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileIcon, Compass, Clock, ArrowRight, MoreVertical, Edit2, Trash2, Download } from 'lucide-react';
import DeleteConfirmation from '../components/DeleteConfirmation';

const FileExplorer: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<FileExplorerItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type' | 'size'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item?: FileExplorerItem } | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FileExplorerItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<FileExplorerItem | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [currentFolder]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const mockItems: FileExplorerItem[] = [
        {
          id: '1',
          name: 'מסמכים',
          type: 'folder',
          created_at: new Date().toISOString(),
          user_id: user?.id || '',
          parent_id: null
        },
        {
          id: '2',
          name: 'מצגת שיעור',
          type: 'powerpoint',
          size: 2500000,
          created_at: new Date().toISOString(),
          user_id: user?.id || '',
          parent_id: null,
          file_url: '#'
        },
        {
          id: '3',
          name: 'טבלת נתונים',
          type: 'excel',
          size: 150000,
          created_at: new Date().toISOString(),
          user_id: user?.id || '',
          parent_id: null,
          file_url: '#'
        }
      ];

      setItems(mockItems);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('אירעה שגיאה בטעינת הקבצים');
    } finally {
      setLoading(false);
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <img src="https://img.icons8.com/color/48/000000/folder-invoices.png" alt="folder" className="h-5 w-5" />;
      case 'word':
        return <img src="https://img.icons8.com/color/48/000000/microsoft-word-2019.png" alt="word" className="h-5 w-5" />;
      case 'excel':
        return <img src="https://img.icons8.com/color/48/000000/microsoft-excel-2019.png" alt="excel" className="h-5 w-5" />;
      case 'powerpoint':
        return <img src="https://img.icons8.com/color/48/000000/microsoft-powerpoint-2019.png" alt="powerpoint" className="h-5 w-5" />;
      case 'pdf':
        return <img src="https://img.icons8.com/color/48/000000/pdf.png" alt="pdf" className="h-5 w-5" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleItemClick = (item: FileExplorerItem) => {
    if (editingItem === item.id) return;
    
    setSelectedItem(item.id);
    
    if (item.type === 'folder') {
      setCurrentFolder(item.id);
      setCurrentPath([...currentPath, item.name]);
    } else if (item.file_url) {
      window.open(item.file_url, '_blank');
    }
  };

  const handleDownload = (e: React.MouseEvent, item: FileExplorerItem) => {
    e.stopPropagation();
    if (item.file_url) {
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: FileExplorerItem) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(item);
    
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-white p-2 rounded shadow';
    dragImage.innerHTML = `<div class="flex items-center">
      ${getItemIcon(item.type).outerHTML}
      <span class="ml-2">${item.name}</span>
    </div>`;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: React.DragEvent, item: FileExplorerItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (item.type === 'folder' && draggedItem && item.id !== draggedItem.id) {
      e.currentTarget.classList.add('bg-primary-50');
      setDropTarget(item.id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-primary-50');
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetItem: FileExplorerItem) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-primary-50');
    
    if (!draggedItem || targetItem.type !== 'folder' || targetItem.id === draggedItem.id) return;

    setItems(items.map(item => 
      item.id === draggedItem.id ? { ...item, parent_id: targetItem.id } : item
    ));

    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    setUploadFiles(Array.from(files));
    setShowUploadModal(true);
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileExplorerItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  const handleBackgroundContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCreateFolder = async () => {
    try {
      const newFolder: FileExplorerItem = {
        id: `folder-${Date.now()}`,
        name: 'תיקייה חדשה',
        type: 'folder',
        created_at: new Date().toISOString(),
        user_id: user?.id || '',
        parent_id: currentFolder
      };

      setItems([...items, newFolder]);
      setEditingItem(newFolder.id);
      setEditingName(newFolder.name);
      setContextMenu(null);
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('אירעה שגיאה ביצירת התיקייה');
    }
  };

  const handleRename = (item: FileExplorerItem) => {
    setEditingItem(item.id);
    setEditingName(item.name);
    setContextMenu(null);
  };

  const handleDelete = async (item: FileExplorerItem) => {
    try {
      setItems(items.filter(i => i.id !== item.id));
      setContextMenu(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('אירעה שגיאה במחיקת הפריט');
    }
  };

  const confirmDelete = (item: FileExplorerItem) => {
    setItemToDelete(item);
    setShowDeleteConfirmation(true);
    setContextMenu(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;
    
    try {
      await handleDelete(itemToDelete);
      setShowDeleteConfirmation(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('אירעה שגיאה במחיקת הפריט');
    }
  };

  const handleRenameSubmit = async (item: FileExplorerItem) => {
    try {
      setItems(items.map(i => 
        i.id === item.id ? { ...i, name: editingName } : i
      ));
    } catch (err) {
      console.error('Error renaming item:', err);
      setError('אירעה שגיאה בשינוי השם');
    } finally {
      setEditingItem(null);
      setEditingName('');
    }
  };

  const navigateToPath = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    setCurrentFolder(index === -1 ? null : items.find(item => item.name === newPath[newPath.length - 1])?.id || null);
  };

  const sortItems = (items: FileExplorerItem[]) => {
    return [...items].sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;

      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const filteredAndSortedItems = sortItems(
    items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.parent_id === currentFolder
    )
  );

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
    <div 
      className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 py-8 animate-fadeIn relative overflow-hidden"
      onContextMenu={handleBackgroundContextMenu}
    >
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <BookOpen className="absolute h-32 w-32 text-primary-600 top-[10%] left-[15%] transform -rotate-12" />
        <Calculator className="absolute h-24 w-24 text-indigo-600 top-[25%] left-[35%] transform rotate-6" />
        <GraduationCap className="absolute h-40 w-40 text-purple-600 top-[15%] right-[20%] transform rotate-12" />
        <PenTool className="absolute h-28 w-28 text-blue-600 top-[40%] left-[10%] transform -rotate-6" />
        <Brain className="absolute h-36 w-36 text-primary-700 top-[60%] left-[25%] transform rotate-12" />
        <Lightbulb className="absolute h-24 w-24 text-yellow-500 top-[20%] right-[10%] transform -rotate-12" />
        <School className="absolute h-32 w-32 text-indigo-700 top-[70%] right-[15%] transform rotate-6" />
        <Award className="absolute h-28 w-28 text-green-600 top-[50%] right-[30%] transform -rotate-6" />
        <FileIcon className="absolute h-24 w-24 text-primary-600 bottom-[10%] left-[20%] transform rotate-12" />
        <Compass className="absolute h-32 w-32 text-blue-500 bottom-[20%] right-[25%] transform -rotate-12" />
        <Clock className="absolute h-28 w-28 text-indigo-500 bottom-[15%] left-[40%] transform rotate-6" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center text-sm">
                <button
                  onClick={() => navigateToPath(-1)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  הקבצים שלי
                </button>
                {currentPath.map((folder, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <button
                      onClick={() => navigateToPath(index)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      {folder}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {currentFolder && (
                  <button
                    onClick={() => {
                      const newPath = currentPath.slice(0, -1);
                      setCurrentPath(newPath);
                      setCurrentFolder(newPath.length === 0 ? null : items.find(item => item.name === newPath[newPath.length - 1])?.id || null);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowRight className="h-4 w-4 ml-1" />
                    חזור
                  </button>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  העלה קובץ
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  תיקייה חדשה
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="חפש קבצים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="block w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="name">שם</option>
                  <option value="date">תאריך</option>
                  <option value="type">סוג</option>
                  <option value="size">גודל</option>
                </select>
                <button
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc className="h-5 w-5 text-gray-500" />
                  ) : (
                    <SortDesc className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">טוען קבצים...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center text-red-500 mb-2">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchItems}
                  className="mt-4 text-primary-600 hover:text-primary-800"
                >
                  נסה שוב
                </button>
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>אין קבצים להצגה</p>
                {searchQuery && (
                  <p className="mt-2 text-sm">נסה לחפש משהו אחר</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        שם
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        תאריך הוספה
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        סוג
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        גודל
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedItems.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        onContextMenu={(e) => handleContextMenu(e, item)}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={(e) => handleDragOver(e, item)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, item)}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedItem === item.id ? 'bg-primary-50' : ''
                        } ${dropTarget === item.id ? 'bg-primary-100' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getItemIcon(item.type)}
                            {editingItem === item.id ? (
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onBlur={() => handleRenameSubmit(item)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRenameSubmit(item);
                                  } else if (e.key === 'Escape') {
                                    setEditingItem(null);
                                    setEditingName('');
                                  }
                                }}
                                className="mr-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className="mr-2 text-sm font-medium text-gray-900">
                                {item.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.type === 'folder' ? 'תיקייה' : item.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.size ? bytes(item.size) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(item);
                              }}
                              className="text-yellow-500 hover:text-yellow-600 transition-colors"
                              title="שנה שם"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(item);
                              }}
                              className="text-red-500 hover:text-red-600 transition-colors"
                              title="מחק"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            {item.type !== 'folder' && (
                              <button
                                onClick={(e) => handleDownload(e, item)}
                                className="text-green-500 hover:text-green-600 transition-colors"
                                title="הורד"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
        accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
      />

      {contextMenu && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg py-1 min-w-[160px]"
          style={{
            top: contextMenu.y,
            left: contextMenu.x
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.item ? (
            <>
              <button
                onClick={() => handleRename(contextMenu.item!)}
                className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Edit2 className="h-4 w-4 ml-2 text-yellow-500" />
                שנה שם
              </button>
              <button
                onClick={() => confirmDelete(contextMenu.item!)}
                className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Trash2 className="h-4 w-4 ml-2 text-red-500" />
                מחק
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Upload className="h-4 w-4 ml-2 text-green-500" />
                העלה קובץ
              </button>
              <button
                onClick={handleCreateFolder}
                className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Plus className="h-4 w-4 ml-2 text-blue-500" />
                תיקייה חדשה
              </button>
            </>
          )}
        </div>
      )}

      {showDeleteConfirmation && itemToDelete && (
        <DeleteConfirmation
          title="מחיקת פריט"
          message={`האם אתה בטוח שברצונך למחוק את ${itemToDelete.name}?`}
          confirmText="מחק"
          cancelText="ביטול"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setItemToDelete(null);
          }}
        />
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">העלאת קבצים</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {uploadFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{bytes(file.size)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  uploadFiles.forEach(file => handleFileUpload([file]));
                  setShowUploadModal(false);
                  setUploadFiles([]);
                }}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                העלה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;