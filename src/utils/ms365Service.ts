// This is a mock service to simulate MS365 integration
// In a real application, this would use the Microsoft Graph API

import { Document, DocumentFolder, DocumentPermission } from '../types';

// Authentication configuration
const msalConfig = {
  auth: {
    clientId: 'your-client-id',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Scopes required for document access
const scopes = [
  'files.readwrite',
  'sites.readwrite.all',
  'user.read',
  'offline_access'
];

// Mock authentication function
export const authenticateWithMicrosoft = async (): Promise<boolean> => {
  // In a real implementation, this would use MSAL
  console.log('Authenticating with Microsoft 365...');
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Authentication successful');
      resolve(true);
    }, 1500);
  });
};

// Mock get documents function
export const getDocuments = async (folderId?: string): Promise<Document[]> => {
  // In a real implementation, this would call the Microsoft Graph API
  console.log('Fetching documents from Microsoft 365...');
  return new Promise(resolve => {
    setTimeout(() => {
      // Return mock data
      resolve([
        {
          id: 'doc-mock-001',
          name: 'Business Plan.docx',
          type: 'word',
          size: 250000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Admin User',
          lastModifiedBy: 'Admin User',
          url: 'https://example.com/documents/business-plan',
          webUrl: 'https://example.com/documents/business-plan',
          downloadUrl: 'https://example.com/documents/business-plan/download',
          thumbnailUrl: 'https://example.com/thumbnails/word.png',
          folder: 'My Documents',
          tags: ['business', 'planning'],
          permissions: []
        }
      ]);
    }, 1000);
  });
};

// Mock get folders function
export const getFolders = async (parentId?: string): Promise<DocumentFolder[]> => {
  // In a real implementation, this would call the Microsoft Graph API
  console.log('Fetching folders from Microsoft 365...');
  return new Promise(resolve => {
    setTimeout(() => {
      // Return mock data
      resolve([
        {
          id: 'folder-mock-001',
          name: 'Projects',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          parentId: parentId,
        }
      ]);
    }, 1000);
  });
};

// Mock create document function
export const createDocument = async (file: File, folderId?: string): Promise<Document> => {
  // In a real implementation, this would upload to Microsoft 365
  console.log('Creating document in Microsoft 365...');
  return new Promise(resolve => {
    setTimeout(() => {
      // Return mock data
      const fileType = file.name.split('.').pop()?.toLowerCase();
      let docType: 'word' | 'excel' | 'powerpoint' | 'pdf' | 'other' = 'other';
      
      if (fileType === 'docx' || fileType === 'doc') docType = 'word';
      else if (fileType === 'xlsx' || fileType === 'xls') docType = 'excel';
      else if (fileType === 'pptx' || fileType === 'ppt') docType = 'powerpoint';
      else if (fileType === 'pdf') docType = 'pdf';
      
      resolve({
        id: `doc-mock-${Date.now()}`,
        name: file.name,
        type: docType,
        size: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Admin User',
        lastModifiedBy: 'Admin User',
        url: `https://example.com/documents/${file.name.toLowerCase().replace(/\s+/g, '-')}`,
        webUrl: `https://example.com/documents/${file.name.toLowerCase().replace(/\s+/g, '-')}`,
        downloadUrl: `https://example.com/documents/${file.name.toLowerCase().replace(/\s+/g, '-')}/download`,
        thumbnailUrl: `https://example.com/thumbnails/${docType}.png`,
        parentId: folderId,
        tags: [],
        permissions: [
          {
            id: 'perm-mock-001',
            userId: 'user-001',
            userName: 'Admin User',
            userEmail: 'admin@example.com',
            role: 'owner'
          }
        ]
      });
    }, 2000);
  });
};

// Mock create folder function
export const createFolder = async (name: string, parentId?: string): Promise<DocumentFolder> => {
  // In a real implementation, this would create a folder in Microsoft 365
  console.log('Creating folder in Microsoft 365...');
  return new Promise(resolve => {
    setTimeout(() => {
      // Return mock data
      resolve({
        id: `folder-mock-${Date.now()}`,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId,
      });
    }, 1000);
  });
};

// Mock update document permissions
export const updateDocumentPermissions = async (documentId: string, permissions: DocumentPermission[]): Promise<boolean> => {
  // In a real implementation, this would update permissions in Microsoft 365
  console.log('Updating document permissions in Microsoft 365...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Mock delete document
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  // In a real implementation, this would delete from Microsoft 365
  console.log('Deleting document from Microsoft 365...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Mock delete folder
export const deleteFolder = async (folderId: string): Promise<boolean> => {
  // In a real implementation, this would delete from Microsoft 365
  console.log('Deleting folder from Microsoft 365...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};