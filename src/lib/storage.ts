// Simple file storage utility using localStorage
// In a real application, this would use Supabase Storage or another cloud storage solution

/**
 * Stores a file in localStorage as base64
 * @param file The file to store
 * @returns A promise that resolves to the file URL
 */
export const storeFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        // Generate a unique ID for the file
        const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        try {
          // Try to store the file in localStorage
          localStorage.setItem(fileId, reader.result as string);
          
          // Return a "fake URL" that we can use to retrieve the file later
          resolve(`local://${fileId}`);
        } catch (storageError) {
          // If localStorage is full, try to clear some space
          if (storageError instanceof DOMException && 
              (storageError.code === 22 || storageError.name === 'QuotaExceededError')) {
            
            console.warn('localStorage quota exceeded, trying to clear space');
            
            // Find and remove the oldest files
            const keys = Object.keys(localStorage).filter(key => key.startsWith('file_'));
            if (keys.length > 0) {
              // Sort by timestamp (oldest first)
              keys.sort((a, b) => {
                const timeA = parseInt(a.split('_')[1] || '0');
                const timeB = parseInt(b.split('_')[1] || '0');
                return timeA - timeB;
              });
              
              // Remove the oldest 20% of files or at least one
              const removeCount = Math.max(1, Math.floor(keys.length * 0.2));
              for (let i = 0; i < removeCount; i++) {
                localStorage.removeItem(keys[i]);
              }
              
              // Try again
              try {
                localStorage.setItem(fileId, reader.result as string);
                resolve(`local://${fileId}`);
              } catch (retryError) {
                reject(new Error('Storage quota exceeded even after clearing space'));
              }
            } else {
              reject(new Error('Storage quota exceeded and no files to clear'));
            }
          } else {
            reject(storageError);
          }
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Retrieves a file from localStorage
 * @param url The URL of the file to retrieve
 * @returns The file data as a base64 string, or null if not found
 */
export const getFileData = (url: string): string | null => {
  if (!url.startsWith('local://')) {
    return url; // It's an external URL, return as is
  }
  
  const fileId = url.replace('local://', '');
  return localStorage.getItem(fileId);
};

/**
 * Deletes a file from localStorage
 * @param url The URL of the file to delete
 */
export const deleteFile = (url: string): void => {
  if (!url.startsWith('local://')) {
    return; // It's an external URL, nothing to delete
  }
  
  const fileId = url.replace('local://', '');
  localStorage.removeItem(fileId);
};