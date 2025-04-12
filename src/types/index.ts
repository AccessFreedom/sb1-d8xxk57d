// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
  lastContact: string;
  notes: string;
}

// Inventory Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  reorderLevel: number;
}

export interface Material {
  id: string;
  name: string;
  sku: string;
  description: string;
  unitCost: number;
  stock: number;
  reorderLevel: number;
}

// Financial Types
export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  total: number;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Expense {
  id: string;
  category: string;
  vendor: string;
  date: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'paid';
}

// Marketing Types
export interface Campaign {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: 'planned' | 'active' | 'completed';
  leads: number;
  conversions: number;
}

// Manufacturing Types
export interface ProductionOrder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  startDate: string;
  dueDate: string;
  status: 'planned' | 'in_progress' | 'completed';
  materials: ProductionMaterial[];
}

export interface ProductionMaterial {
  materialId: string;
  materialName: string;
  quantityRequired: number;
}

// Microsoft 365 Document Types
export interface Document {
  id: string;
  name: string;
  type: 'word' | 'excel' | 'powerpoint' | 'pdf' | 'other';
  size: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  url: string;
  webUrl: string;
  downloadUrl: string;
  thumbnailUrl: string;
  folder?: string;
  parentId?: string;
  relatedItemId?: string;
  relatedItemType?: 'customer' | 'invoice' | 'product' | 'campaign' | 'expense' | 'production';
  permissions: DocumentPermission[];
  tags: string[];
}

export interface DocumentPermission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface DocumentFolder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}