import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { File, FolderPlus, Folder, FilePlus, Search, Filter, Grid, List, MoreHorizontal, ChevronDown, Edit, Trash2, Download, Share, FileText, FileSpreadsheet, FileImage, Presentation as FilePresentation, FilePen, FileCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { Document, DocumentFolder, DocumentPermission } from '../../types';

// Icon mapping based on file type
/**
* Determines and returns the appropriate file icon component based on the document type
* @example
* getFileIconComponent({ type: 'pdf', className: 'custom-class' })
* <FilePen className="custom-class text-red-500" />
* @param {Object} config - Configuration object containing type and optional className.
* @param {string} config.type - The type of document, e.g., 'word', 'excel', 'powerpoint', 'pdf'.
* @param {string} [config.className='w-10 h-10'] - Optional CSS classes to apply to the file icon component.
* @returns {JSX.Element} Returns the JSX element representing the file icon with applied styles.
* @description
*   - Uses a switch statement to determine the icon and color based on the document type.
*   - Each file type corresponds to a distinct color and file icon component.
*   - Default icon and color are used when no valid type is passed.
*/
const FileIcon = ({ type, className = "w-10 h-10" }) => {
  switch (type) {
    case 'word':
      return <FileText className={`${className} text-blue-500`} />;
    case 'excel':
      return <FileSpreadsheet className={`${className} text-green-600`} />;
    case 'powerpoint':
      return <FilePresentation className={`${className} text-orange-500`} />;
    case 'pdf':
      return <FilePen className={`${className} text-red-500`} />;
    default:
      return <File className={`${className} text-gray-500`} />;
  }
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const DocumentsModule: React.FC = () => {
  const { documents, documentFolders, addDocument, updateDocument, deleteDocument, addDocumentFolder, updateDocumentFolder, deleteDocumentFolder, updateDocumentPermission } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<Document | null>(null);
  
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [newPermission, setNewPermission] = useState<Omit<DocumentPermission, 'id'>>({
    userId: '',
    userName: '',
    userEmail: '',
    role: 'viewer'
  });

  // Handle Microsoft 365 authentication
  const handleAuthenticate = () => {
    setIsConnecting(true);
    // Simulate authentication process
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsConnecting(false);
    }, 1500);
  };

  // Filter documents based on search term, file type, and current folder
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          document.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || document.type === filterType;
    const matchesFolder = currentFolder === null || document.parentId === currentFolder;
    
    return matchesSearch && matchesType && matchesFolder;
  });
  
  // Get subfolders for current folder
  const subFolders = documentFolders.filter(folder => 
    (currentFolder === null && !folder.parentId) || 
    folder.parentId === currentFolder
  );
  
  // Get current folder name
  const getCurrentFolderName = () => {
    if (currentFolder === null) return 'My Documents';
    const folder = documentFolders.find(f => f.id === currentFolder);
    return folder ? folder.name : 'My Documents';
  };
  
  // Get breadcrumb path
  /**
   * Constructs a path from a current folder to the root in a hierarchical folder structure.
   * @example
   * functionName(3, documentFolders)
   * [{ id: null, name: 'My Documents' }, { id: 1, name: 'Folder A' }, { id: 3, name: 'Folder C' }]
   * @param {number} currentFolder - The ID of the current folder from which the path starts.
   * @param {Array<Object>} documentFolders - Array of folder objects, each containing id, name, and parentId.
   * @returns {Array<Object>} An array representing the path from the root to the current folder, each object contains id and name.
   * @description
   *   - The function assumes that the folder array contains unique ids for each folder.
   *   - If a folder with a given id is not found, the path construction will terminate early.
   *   - The path starts with a generic 'My Documents' entry and then includes all found folders from the root to the specified folder.
   */
  const getBreadcrumbPath = () => {
    const path = [{ id: null, name: 'My Documents' }];
    let currentId = currentFolder;
    
    while (currentId) {
      const folder = documentFolders.find(f => f.id === currentId);
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    
    return path;
  };
  
  // Handle file upload
  /**
   * Handles form submission to upload a file and create a new document.
   * @example
   * handleSubmit(event)
   * Document object is created and stored.
   * @param {React.FormEvent} e - The form event triggered by submission, used to prevent default form action.
   * @returns {void} No return value.
   * @description
   *   - Simulates file upload progress by using an interval to increment progress state.
   *   - Determines document type based on the file extension and creates a document object.
   *   - Sets the upload file and progress state back to initial state upon completion.
   *   - Calls addDocument with the new document object to store it.
   */
  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    
    // Mock upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Create new document
          const fileType = uploadFile.name.split('.').pop()?.toLowerCase();
          let docType: 'word' | 'excel' | 'powerpoint' | 'pdf' | 'other' = 'other';
          
          if (fileType === 'docx' || fileType === 'doc') docType = 'word';
          else if (fileType === 'xlsx' || fileType === 'xls') docType = 'excel';
          else if (fileType === 'pptx' || fileType === 'ppt') docType = 'powerpoint';
          else if (fileType === 'pdf') docType = 'pdf';
          
          const newDocument: Omit<Document, 'id'> = {
            name: uploadFile.name,
            type: docType,
            size: uploadFile.size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'Admin User',
            lastModifiedBy: 'Admin User',
            url: `https://example.com/documents/${uploadFile.name.toLowerCase().replace(/\s+/g, '-')}`,
            webUrl: `https://example-tenant.sharepoint.com/documents/${uploadFile.name.toLowerCase().replace(/\s+/g, '-')}`,
            downloadUrl: `https://example.com/documents/${uploadFile.name.toLowerCase().replace(/\s+/g, '-')}/download`,
            thumbnailUrl: `https://example.com/thumbnails/${docType}.png`,
            folder: getCurrentFolderName(),
            parentId: currentFolder,
            tags: [],
            permissions: [
              {
                id: 'perm-new',
                userId: 'user-001',
                userName: 'Admin User',
                userEmail: 'admin@example.com',
                role: 'owner'
              }
            ]
          };
          
          addDocument(newDocument);
          setUploadFile(null);
          setUploadProgress(0);
          setShowUploadModal(false);
        }
        return newProgress;
      });
    }, 300);
  };
  
  // Handle new folder creation
  /**
  * Handles the form submission for creating a new document folder.
  * @example
  * handleSubmit(event)
  * // Prevents default form submission, creates a new folder, and resets state.
  * @param {React.FormEvent} e - The form submission event.
  * @returns {void} No return value.
  * @description
  *   - Prevents the default form behavior to stop page reloads upon submission.
  *   - Ensures new folder names are not empty or solely spaces.
  *   - Sets the folder's creation and update times to the current date and time.
  *   - Resets the folder name input and hides the new folder modal after submission.
  */
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    const newFolder: Omit<DocumentFolder, 'id'> = {
      name: newFolderName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: currentFolder
    };
    
    addDocumentFolder(newFolder);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };
  
  // Handle document sharing
  /**
  * Handles form submission to update document permissions based on user input
  * @example
  * handleFormSubmit(event)
  * undefined
  * @param {React.FormEvent} e - Event object representing the form submission event.
  * @returns {void} Does not return a value.
  * @description
  *   - Prevents the default form submission behavior.
  *   - Checks if the share modal is open and if a user email is provided.
  *   - Creates a new permission object with a unique id based on the current timestamp.
  *   - Resets the new permission form fields and closes the share modal.
  */
  const handleShareDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showShareModal || !newPermission.userEmail) return;
    
    const permission: DocumentPermission = {
      ...newPermission,
      id: `perm-${Date.now()}`
    };
    
    updateDocumentPermission(showShareModal, permission);
    setNewPermission({
      userId: '',
      userName: '',
      userEmail: '',
      role: 'viewer'
    });
    setShowShareModal(null);
  };
  
  // Handle document selection
  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments(prev => {
      if (prev.includes(id)) {
        return prev.filter(docId => docId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Delete selected documents
  const deleteSelectedDocuments = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDocuments.length} document(s)?`)) {
      selectedDocuments.forEach(id => deleteDocument(id));
      setSelectedDocuments([]);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedDocuments([]);
  };
  
  // Document Item component (used in both grid and list views)
  /**
   * Renders a document item either in grid or list view with interaction features.
   * 
   * @example
   * renderDocument({ id: 1, name: 'Document', size: 1024, type: 'pdf', updatedAt: new Date(), webUrl: 'http://...', lastModifiedBy: 'User', folder: 'Folder' })
   * // Returns a React component for displaying the document in the selected view mode
   * 
   * @param {Object} document - The document object containing details to render.
   * @returns {JSX.Element} A JSX element for displaying the document.
   * @description
   *   - Handles click events to toggle document selection.
   *   - Supports document actions like preview, open, share, and delete.
   *   - Conditionally renders based on view mode: 'grid' or 'list'.
   *   - Applies styles and icons to enhance user interaction and visuals.
   */
  const DocumentItem: React.FC<{ document: Document }> = ({ document }) => {
    const isSelected = selectedDocuments.includes(document.id);
    
    return viewMode === 'grid' ? (
      <div 
        className={`relative p-4 border rounded-lg ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
        onClick={() => toggleDocumentSelection(document.id)}
      >
        <div className="flex flex-col items-center text-center">
          <FileIcon type={document.type} />
          <div className="mt-2 font-medium truncate w-full">{document.name}</div>
          <div className="text-xs text-gray-500 mt-1">{formatFileSize(document.size)}</div>
          <div className="text-xs text-gray-500 mt-1">{formatDate(document.updatedAt)}</div>
          <div className="mt-2 flex space-x-1">
            <button 
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setShowPreviewModal(document);
              }}
              title="Preview"
            >
              <FileCheck size={16} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                window.open(document.webUrl, '_blank');
              }}
              title="Open in Microsoft 365"
            >
              <ExternalLink size={16} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setShowShareModal(document.id);
              }}
              title="Share"
            >
              <Share size={16} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete ${document.name}?`)) {
                  deleteDocument(document.id);
                }
              }}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <FileCheck size={12} className="text-white" />
          </div>
        )}
      </div>
    ) : (
      <tr 
        className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
        onClick={() => toggleDocumentSelection(document.id)}
      >
        <td className="py-3 px-4 whitespace-nowrap">
          <div className="flex items-center">
            <FileIcon type={document.type} className="w-6 h-6 mr-2" />
            <div className="font-medium">{document.name}</div>
          </div>
        </td>
        <td className="py-3 px-4 whitespace-nowrap text-gray-500">
          {formatFileSize(document.size)}
        </td>
        <td className="py-3 px-4 whitespace-nowrap text-gray-500">
          {formatDate(document.updatedAt)}
        </td>
        <td className="py-3 px-4 whitespace-nowrap text-gray-500">
          {document.lastModifiedBy}
        </td>
        <td className="py-3 px-4 whitespace-nowrap text-gray-500">
          {document.folder}
        </td>
        <td className="py-3 px-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end space-x-2">
            <button 
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setShowPreviewModal(document);
              }}
              title="Preview"
            >
              <FileCheck size={16} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                window.open(document.webUrl, '_blank');
              }}
              title="Open in Microsoft 365"
            >
              <ExternalLink size={16} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setShowShareModal(document.id);
              }}
              title="Share"
            >
              <Share size={16} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete ${document.name}?`)) {
                  deleteDocument(document.id);
                }
              }}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };
  
  // Folder Item component
  /**
   * Renders a folder either as a grid item or a table row based on the view mode.
   * @example
   * renderFolderComponent({folder})
   * // Renders as a grid item or table row and enables folder management options
   * @param {Object} folder - An object representing the folder which includes folder details like id, name, and updatedAt date.
   * @returns {JSX.Element} A JSX element that visually represents the folder with actions for renaming and deletion.
   * @description
   *   - Handles `click` events for folder selection, renaming, and deletion.
   *   - Supports confirmation prompts for deleting a folder.
   *   - Uses `viewMode` variable to determine rendering style as grid or list.
   *   - Prevents propagation of events to allow handling within buttons.
   */
  const FolderItem: React.FC<{ folder: DocumentFolder }> = ({ folder }) => {
    return viewMode === 'grid' ? (
      <div 
        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
        onClick={() => setCurrentFolder(folder.id)}
      >
        <div className="flex flex-col items-center text-center">
          <Folder size={40} className="text-yellow-500" />
          <div className="mt-2 font-medium truncate w-full">{folder.name}</div>
          <div className="text-xs text-gray-500 mt-1">{formatDate(folder.updatedAt)}</div>
          <div className="mt-2 flex space-x-2">
            <button 
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                const newName = prompt('Enter new folder name:', folder.name);
                if (newName && newName !== folder.name) {
                  updateDocumentFolder(folder.id, { name: newName });
                }
              }}
              title="Rename"
            >
              <Edit size={16} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete folder "${folder.name}"? This will not delete the files inside.`)) {
                  deleteDocumentFolder(folder.id);
                }
              }}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ) : (
      <tr 
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => setCurrentFolder(folder.id)}
      >
        <td className="py-3 px-4 whitespace-nowrap" colSpan={5}>
          <div className="flex items-center">
            <Folder size={18} className="text-yellow-500 mr-2" />
            <div className="font-medium">{folder.name}</div>
          </div>
        </td>
        <td className="py-3 px-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end space-x-2">
            <button 
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                const newName = prompt('Enter new folder name:', folder.name);
                if (newName && newName !== folder.name) {
                  updateDocumentFolder(folder.id, { name: newName });
                }
              }}
              title="Rename"
            >
              <Edit size={16} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete folder "${folder.name}"? This will not delete the files inside.`)) {
                  deleteDocumentFolder(folder.id);
                }
              }}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-lg mx-auto mt-8">
          <div className="text-center">
            <File className="w-20 h-20 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold mt-4 mb-2">Connect to Microsoft 365</h2>
            <p className="text-gray-600 mb-6">
              Connect your Microsoft 365 account to access, edit, and manage your documents directly within BizMaster Pro.
            </p>
            <button
              onClick={handleAuthenticate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center mx-auto"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink size={18} className="mr-2" />
                  Connect to Microsoft 365
                </>
              )}
            </button>
            <div className="mt-6 text-sm text-gray-500">
              <p>By connecting, you'll be able to:</p>
              <ul className="list-disc text-left ml-8 mt-2">
                <li>Access Word, Excel, PowerPoint documents</li>
                <li>Edit documents in-app using Microsoft's web editors</li>
                <li>Share documents with team members</li>
                <li>Organize files in folders</li>
                <li>Link documents to customers, projects, and more</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Document Management</h1>
              <div className="flex items-center mt-2">
                {getBreadcrumbPath().map((item, index, array) => (
                  <React.Fragment key={index}>
                    <button
                      className={`text-${index === array.length - 1 ? 'blue-600 font-medium' : 'gray-600 hover:text-blue-500'}`}
                      onClick={() => setCurrentFolder(item.id)}
                    >
                      {item.name}
                    </button>
                    {index < array.length - 1 && <span className="mx-2 text-gray-400">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                onClick={() => setShowUploadModal(true)}
              >
                <FilePlus size={18} className="mr-1" />
                Upload Document
              </button>
              <button
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                onClick={() => setShowNewFolderModal(true)}
              >
                <FolderPlus size={18} className="mr-1" />
                New Folder
              </button>
              {selectedDocuments.length > 0 && (
                <>
                  <button
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center"
                    onClick={deleteSelectedDocuments}
                  >
                    <Trash2 size={18} className="mr-1" />
                    Delete ({selectedDocuments.length})
                  </button>
                  <button
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                    onClick={clearSelection}
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    className="py-2 px-3 border border-gray-300 rounded-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="word">Word Documents</option>
                    <option value="excel">Excel Spreadsheets</option>
                    <option value="powerpoint">PowerPoint Presentations</option>
                    <option value="pdf">PDFs</option>
                    <option value="other">Other Files</option>
                  </select>
                </div>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
              <div className="text-gray-500 text-sm">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 && 's'} • {subFolders.length} folder{subFolders.length !== 1 && 's'}
              </div>
            </div>
            
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="p-4">
                {subFolders.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-medium mb-3 text-gray-600 flex items-center">
                      <Folder size={18} className="mr-2 text-yellow-500" />
                      Folders
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {subFolders.map(folder => (
                        <FolderItem key={folder.id} folder={folder} />
                      ))}
                    </div>
                  </div>
                )}
                
                {filteredDocuments.length > 0 ? (
                  <div>
                    <h2 className="font-medium mb-3 text-gray-600 flex items-center">
                      <File size={18} className="mr-2" />
                      Documents
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredDocuments.map(document => (
                        <DocumentItem key={document.id} document={document} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No documents found
                  </div>
                )}
              </div>
            )}
            
            {/* List View */}
            {viewMode === 'list' && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modified
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modified By
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subFolders.map(folder => (
                      <FolderItem key={folder.id} folder={folder} />
                    ))}
                    {filteredDocuments.map(document => (
                      <DocumentItem key={document.id} document={document} />
                    ))}
                    {subFolders.length === 0 && filteredDocuments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                          No documents or folders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowUploadModal(false)}></div>
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Upload Document</h2>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select File
                  </label>
                  <input
                    type="file"
                    className="w-full border border-gray-300 rounded-md py-2 px-3"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
                
                {uploadProgress > 0 && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={!uploadFile || uploadProgress > 0}
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowNewFolderModal(false)}></div>
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div>
                  <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    id="folder-name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter folder name"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    onClick={() => setShowNewFolderModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={!newFolderName.trim()}
                  >
                    Create Folder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Document Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowShareModal(null)}></div>
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Share Document</h2>
              
              <div className="mb-4">
                <h3 className="font-medium text-sm text-gray-500 mb-2">Current Permissions</h3>
                <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                  {documents.find(d => d.id === showShareModal)?.permissions.map(permission => (
                    <div key={permission.id} className="flex justify-between items-center py-1">
                      <div>
                        <div className="font-medium text-sm">{permission.userName}</div>
                        <div className="text-xs text-gray-500">{permission.userEmail}</div>
                      </div>
                      <div>
                        <span 
                          className={`text-xs py-1 px-2 rounded-full ${
                            permission.role === 'owner' 
                              ? 'bg-purple-100 text-purple-800' 
                              : permission.role === 'editor'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {permission.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleShareDocument} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newPermission.userEmail}
                    onChange={(e) => setNewPermission({
                      ...newPermission,
                      userEmail: e.target.value,
                      userName: e.target.value.split('@')[0] // Simple way to get a name
                    })}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email to share with"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="permission" className="block text-sm font-medium text-gray-700 mb-1">
                    Permission
                  </label>
                  <select
                    id="permission"
                    value={newPermission.role}
                    onChange={(e) => setNewPermission({
                      ...newPermission,
                      role: e.target.value as 'editor' | 'viewer'
                    })}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    onClick={() => setShowShareModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Share
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Document Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowPreviewModal(null)}></div>
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative z-10">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">{showPreviewModal.name}</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPreviewModal(null)}
                >
                  &times;
                </button>
              </div>
              
              <div className="bg-gray-100 rounded-md p-6 min-h-[400px] flex flex-col items-center justify-center">
                <FileIcon type={showPreviewModal.type} className="w-20 h-20 mb-4" />
                <div className="text-center">
                  <p className="mb-2">Preview not available directly within the application.</p>
                  <p className="text-sm text-gray-500 mb-4">Use the buttons below to view or edit this document.</p>
                  
                  <div className="flex justify-center space-x-3">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      onClick={() => window.open(showPreviewModal.webUrl, '_blank')}
                    >
                      <ExternalLink size={18} className="mr-1" />
                      Open in Microsoft 365
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                      onClick={() => window.open(showPreviewModal.downloadUrl, '_blank')}
                    >
                      <Download size={18} className="mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Document Details</h3>
                  <div className="mt-2 space-y-1">
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="col-span-2 capitalize">{showPreviewModal.type}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-gray-600">Size:</span>
                      <span className="col-span-2">{formatFileSize(showPreviewModal.size)}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="col-span-2">{formatDate(showPreviewModal.createdAt)}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-gray-600">Modified:</span>
                      <span className="col-span-2">{formatDate(showPreviewModal.updatedAt)}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-gray-600">Created By:</span>
                      <span className="col-span-2">{showPreviewModal.createdBy}</span>
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                      <span className="text-gray-600">Location:</span>
                      <span className="col-span-2">{showPreviewModal.folder}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Shared With</h3>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {showPreviewModal.permissions.length > 0 ? (
                      <div className="space-y-2">
                        {showPreviewModal.permissions.map(permission => (
                          <div key={permission.id} className="flex justify-between text-sm">
                            <span>{permission.userName} ({permission.userEmail})</span>
                            <span 
                              className={`text-xs py-1 px-2 rounded-full ${
                                permission.role === 'owner' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : permission.role === 'editor'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {permission.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Not shared with anyone</div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={() => {
                        setShowPreviewModal(null);
                        setShowShareModal(showPreviewModal.id);
                      }}
                    >
                      <Share size={14} className="mr-1" />
                      Share Document
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentsModule;