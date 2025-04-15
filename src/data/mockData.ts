import { 
  Customer, 
  Product, 
  Material, 
  Invoice, 
  Expense, 
  Campaign,
  ProductionOrder,
  Document,
  DocumentFolder
} from '../types';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// Generate a random date within the last year
const generateDate = (daysAgo = 365) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

// Generate a future date
const generateFutureDate = (daysAhead = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date.toISOString().split('T')[0];
};

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: generateId(),
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Corp',
    status: 'active',
    lastContact: generateDate(30),
    notes: 'Key decision maker'
  },
  {
    id: generateId(),
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    company: 'XYZ Industries',
    status: 'active',
    lastContact: generateDate(15),
    notes: 'Interested in bulk orders'
  },
  {
    id: generateId(),
    name: 'Michael Rodriguez',
    email: 'mrodriguez@example.com',
    phone: '(555) 456-7890',
    company: 'Global Tech',
    status: 'lead',
    lastContact: generateDate(5),
    notes: 'New lead from trade show'
  },
  {
    id: generateId(),
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    phone: '(555) 234-5678',
    company: 'Innovative Solutions',
    status: 'inactive',
    lastContact: generateDate(120),
    notes: 'Following up in Q3'
  },
  {
    id: generateId(),
    name: 'David Kim',
    email: 'dkim@example.com',
    phone: '(555) 876-5432',
    company: 'Pacific Partners',
    status: 'active',
    lastContact: generateDate(10),
    notes: 'Monthly recurring order'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: generateId(),
    name: 'Premium Widget',
    sku: 'WDG-001',
    category: 'Widgets',
    description: 'High-quality premium widget',
    costPrice: 15.99,
    sellingPrice: 29.99,
    stock: 120,
    reorderLevel: 20
  },
  {
    id: generateId(),
    name: 'Standard Gadget',
    sku: 'GDG-002',
    category: 'Gadgets',
    description: 'Reliable standard gadget',
    costPrice: 8.50,
    sellingPrice: 19.99,
    stock: 85,
    reorderLevel: 15
  },
  {
    id: generateId(),
    name: 'Deluxe Tool Set',
    sku: 'TLS-003',
    category: 'Tools',
    description: 'Complete deluxe tool set with case',
    costPrice: 45.75,
    sellingPrice: 89.99,
    stock: 32,
    reorderLevel: 10
  },
  {
    id: generateId(),
    name: 'Basic Accessory',
    sku: 'ACC-004',
    category: 'Accessories',
    description: 'Essential basic accessory',
    costPrice: 3.25,
    sellingPrice: 7.99,
    stock: 210,
    reorderLevel: 30
  },
  {
    id: generateId(),
    name: 'Pro Component',
    sku: 'CMP-005',
    category: 'Components',
    description: 'Professional-grade component',
    costPrice: 28.50,
    sellingPrice: 59.99,
    stock: 45,
    reorderLevel: 12
  }
];

// Mock Materials
export const mockMaterials: Material[] = [
  {
    id: generateId(),
    name: 'Aluminum Sheet',
    sku: 'MAT-001',
    description: '2mm aluminum sheet',
    unitCost: 5.75,
    stock: 200,
    reorderLevel: 50
  },
  {
    id: generateId(),
    name: 'Steel Rod',
    sku: 'MAT-002',
    description: '10mm steel rod',
    unitCost: 3.20,
    stock: 150,
    reorderLevel: 30
  },
  {
    id: generateId(),
    name: 'Plastic Injection Mold',
    sku: 'MAT-003',
    description: 'ABS plastic for injection molding',
    unitCost: 2.15,
    stock: 300,
    reorderLevel: 75
  },
  {
    id: generateId(),
    name: 'Circuit Board',
    sku: 'MAT-004',
    description: 'PCB board component',
    unitCost: 8.90,
    stock: 120,
    reorderLevel: 25
  },
  {
    id: generateId(),
    name: 'Packaging Material',
    sku: 'MAT-005',
    description: 'Eco-friendly packaging material',
    unitCost: 1.10,
    stock: 500,
    reorderLevel: 100
  }
];

// Generate mock invoice items from products
/**
* Generates a list of randomly selected product items with quantities and prices.
* @example
* generateItems(2)
* // Returns an array of 2 items with random products, quantities, and total prices.
* @param {number} count - The number of product items to generate.
* @returns {Array<Object>} An array of objects, each representing a product with id, productId, description, quantity, unitPrice, and total.
* @description
*   - Utilizes a `mockProducts` array to select random products.
*   - Each product has a randomly generated quantity between 1 and 5.
*   - Each item's total is calculated as quantity times the unit price.
*/
const generateInvoiceItems = (count = 3) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    items.push({
      id: generateId(),
      productId: product.id,
      description: product.name,
      quantity: quantity,
      unitPrice: product.sellingPrice,
      total: quantity * product.sellingPrice
    });
  }
  return items;
};

// Calculate total from invoice items
const calculateInvoiceTotal = (items) => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    customerId: mockCustomers[0].id,
    customerName: mockCustomers[0].name,
    date: generateDate(30),
    dueDate: generateFutureDate(15),
    items: generateInvoiceItems(3),
    status: 'paid',
    total: 0 // Will be calculated
  },
  {
    id: 'INV-002',
    customerId: mockCustomers[1].id,
    customerName: mockCustomers[1].name,
    date: generateDate(15),
    dueDate: generateFutureDate(15),
    items: generateInvoiceItems(2),
    status: 'sent',
    total: 0 // Will be calculated
  },
  {
    id: 'INV-003',
    customerId: mockCustomers[4].id,
    customerName: mockCustomers[4].name,
    date: generateDate(7),
    dueDate: generateFutureDate(30),
    items: generateInvoiceItems(4),
    status: 'draft',
    total: 0 // Will be calculated
  },
  {
    id: 'INV-004',
    customerId: mockCustomers[2].id,
    customerName: mockCustomers[2].name,
    date: generateDate(60),
    dueDate: generateDate(30),
    items: generateInvoiceItems(1),
    status: 'overdue',
    total: 0 // Will be calculated
  },
  {
    id: 'INV-005',
    customerId: mockCustomers[3].id,
    customerName: mockCustomers[3].name,
    date: generateDate(10),
    dueDate: generateFutureDate(20),
    items: generateInvoiceItems(3),
    status: 'sent',
    total: 0 // Will be calculated
  }
];

// Calculate totals for invoices
mockInvoices.forEach(invoice => {
  invoice.total = calculateInvoiceTotal(invoice.items);
});

// Mock Expenses
export const mockExpenses: Expense[] = [
  {
    id: 'EXP-001',
    category: 'Office Supplies',
    vendor: 'Office Depot',
    date: generateDate(15),
    amount: 124.56,
    description: 'Printer paper and ink cartridges',
    status: 'paid'
  },
  {
    id: 'EXP-002',
    category: 'Utilities',
    vendor: 'Power Company',
    date: generateDate(7),
    amount: 345.89,
    description: 'Electricity bill for March',
    status: 'approved'
  },
  {
    id: 'EXP-003',
    category: 'Marketing',
    vendor: 'Facebook Ads',
    date: generateDate(3),
    amount: 500.00,
    description: 'Social media ad campaign',
    status: 'pending'
  },
  {
    id: 'EXP-004',
    category: 'Rent',
    vendor: 'Commercial Properties Inc',
    date: generateDate(20),
    amount: 2000.00,
    description: 'Office rent for April',
    status: 'paid'
  },
  {
    id: 'EXP-005',
    category: 'Travel',
    vendor: 'Delta Airlines',
    date: generateDate(10),
    amount: 650.75,
    description: 'Flight tickets for conference',
    status: 'approved'
  }
];

// Mock Marketing Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: generateId(),
    name: 'Spring Sale Promotion',
    type: 'Email',
    startDate: generateDate(30),
    endDate: generateFutureDate(15),
    budget: 1000.00,
    spent: 750.00,
    status: 'active',
    leads: 120,
    conversions: 28
  },
  {
    id: generateId(),
    name: 'Social Media Awareness',
    type: 'Social',
    startDate: generateDate(60),
    endDate: generateDate(30),
    budget: 1500.00,
    spent: 1500.00,
    status: 'completed',
    leads: 250,
    conversions: 45
  },
  {
    id: generateId(),
    name: 'Product Launch',
    type: 'Multi-channel',
    startDate: generateFutureDate(10),
    endDate: generateFutureDate(40),
    budget: 3000.00,
    spent: 0.00,
    status: 'planned',
    leads: 0,
    conversions: 0
  },
  {
    id: generateId(),
    name: 'Trade Show Exhibition',
    type: 'Event',
    startDate: generateDate(90),
    endDate: generateDate(87),
    budget: 5000.00,
    spent: 4800.00,
    status: 'completed',
    leads: 180,
    conversions: 35
  },
  {
    id: generateId(),
    name: 'Holiday Season Special',
    type: 'PPC',
    startDate: generateFutureDate(60),
    endDate: generateFutureDate(90),
    budget: 2000.00,
    spent: 0.00,
    status: 'planned',
    leads: 0,
    conversions: 0
  }
];

// Generate production materials for orders
/**
 * Generates a list of items with random material details and required quantity.
 * @example
 * generateItems(3)
 * // Possible return value:
 * // [
 * //   { materialId: 1, materialName: 'Wood', quantityRequired: 5 },
 * //   { materialId: 2, materialName: 'Metal', quantityRequired: 8 },
 * //   { materialId: 3, materialName: 'Plastic', quantityRequired: 2 }
 * // ]
 * @param {number} count - Number of items to generate.
 * @returns {Array<Object>} A list of items containing material details and quantity required.
 * @description
 *   - Utilizes the global list `mockMaterials` to select random materials.
 *   - The `materialId` and `materialName` are derived from the randomly chosen material.
 *   - The `quantityRequired` is generated randomly between 1 and 10.
 */
const generateProductionMaterials = (count = 3) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const material = mockMaterials[Math.floor(Math.random() * mockMaterials.length)];
    items.push({
      materialId: material.id,
      materialName: material.name,
      quantityRequired: Math.floor(Math.random() * 10) + 1
    });
  }
  return items;
};

// Mock Production Orders
export const mockProductionOrders: ProductionOrder[] = [
  {
    id: 'PO-001',
    productId: mockProducts[0].id,
    productName: mockProducts[0].name,
    quantity: 50,
    startDate: generateDate(10),
    dueDate: generateFutureDate(5),
    status: 'in_progress',
    materials: generateProductionMaterials(3)
  },
  {
    id: 'PO-002',
    productId: mockProducts[1].id,
    productName: mockProducts[1].name,
    quantity: 30,
    startDate: generateDate(5),
    dueDate: generateFutureDate(10),
    status: 'planned',
    materials: generateProductionMaterials(2)
  },
  {
    id: 'PO-003',
    productId: mockProducts[2].id,
    productName: mockProducts[2].name,
    quantity: 20,
    startDate: generateDate(30),
    dueDate: generateDate(15),
    status: 'completed',
    materials: generateProductionMaterials(4)
  },
  {
    id: 'PO-004',
    productId: mockProducts[3].id,
    productName: mockProducts[3].name,
    quantity: 100,
    startDate: generateFutureDate(2),
    dueDate: generateFutureDate(15),
    status: 'planned',
    materials: generateProductionMaterials(2)
  },
  {
    id: 'PO-005',
    productId: mockProducts[4].id,
    productName: mockProducts[4].name,
    quantity: 25,
    startDate: generateDate(20),
    dueDate: generateDate(5),
    status: 'in_progress',
    materials: generateProductionMaterials(3)
  }
];

// Mock Document Folders
export const mockDocumentFolders: DocumentFolder[] = [
  {
    id: 'folder-001',
    name: 'Invoices',
    createdAt: generateDate(90),
    updatedAt: generateDate(5)
  },
  {
    id: 'folder-002',
    name: 'Customer Contracts',
    createdAt: generateDate(85),
    updatedAt: generateDate(10)
  },
  {
    id: 'folder-003',
    name: 'Product Specifications',
    createdAt: generateDate(80),
    updatedAt: generateDate(15)
  },
  {
    id: 'folder-004',
    name: 'Marketing Materials',
    createdAt: generateDate(75),
    updatedAt: generateDate(3)
  },
  {
    id: 'folder-005',
    name: 'Reports',
    createdAt: generateDate(70),
    updatedAt: generateDate(1)
  },
  {
    id: 'folder-006',
    name: 'Production Plans',
    createdAt: generateDate(65),
    updatedAt: generateDate(7)
  }
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    name: 'Q1 Sales Report.xlsx',
    type: 'excel',
    size: 2450000,
    createdAt: generateDate(60),
    updatedAt: generateDate(5),
    createdBy: 'Admin User',
    lastModifiedBy: 'Admin User',
    url: 'https://example.com/documents/q1-sales-report',
    webUrl: 'https://example-tenant.sharepoint.com/documents/q1-sales-report',
    downloadUrl: 'https://example.com/documents/q1-sales-report/download',
    thumbnailUrl: 'https://example.com/thumbnails/excel.png',
    folder: 'Reports',
    parentId: 'folder-005',
    tags: ['sales', 'quarterly', 'report'],
    permissions: [
      {
        id: 'perm-001',
        userId: 'user-001',
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        role: 'owner'
      },
      {
        id: 'perm-002',
        userId: 'user-002',
        userName: 'John Smith',
        userEmail: 'john.smith@example.com',
        role: 'editor'
      }
    ]
  },
  {
    id: 'doc-002',
    name: 'Customer Contract - XYZ Industries.docx',
    type: 'word',
    size: 1850000,
    createdAt: generateDate(45),
    updatedAt: generateDate(10),
    createdBy: 'Admin User',
    lastModifiedBy: 'John Smith',
    url: 'https://example.com/documents/xyz-contract',
    webUrl: 'https://example-tenant.sharepoint.com/documents/xyz-contract',
    downloadUrl: 'https://example.com/documents/xyz-contract/download',
    thumbnailUrl: 'https://example.com/thumbnails/word.png',
    folder: 'Customer Contracts',
    parentId: 'folder-002',
    relatedItemId: mockCustomers[1].id,
    relatedItemType: 'customer',
    tags: ['contract', 'customer', 'legal'],
    permissions: [
      {
        id: 'perm-003',
        userId: 'user-001',
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        role: 'owner'
      },
      {
        id: 'perm-004',
        userId: 'user-002',
        userName: 'John Smith',
        userEmail: 'john.smith@example.com',
        role: 'editor'
      },
      {
        id: 'perm-005',
        userId: 'user-003',
        userName: 'Sarah Johnson',
        userEmail: 'sarah.j@example.com',
        role: 'viewer'
      }
    ]
  },
  {
    id: 'doc-003',
    name: 'Product Presentation.pptx',
    type: 'powerpoint',
    size: 5250000,
    createdAt: generateDate(30),
    updatedAt: generateDate(3),
    createdBy: 'Jane Smith',
    lastModifiedBy: 'Admin User',
    url: 'https://example.com/documents/product-presentation',
    webUrl: 'https://example-tenant.sharepoint.com/documents/product-presentation',
    downloadUrl: 'https://example.com/documents/product-presentation/download',
    thumbnailUrl: 'https://example.com/thumbnails/powerpoint.png',
    folder: 'Marketing Materials',
    parentId: 'folder-004',
    tags: ['presentation', 'marketing', 'product'],
    permissions: [
      {
        id: 'perm-006',
        userId: 'user-001',
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        role: 'editor'
      },
      {
        id: 'perm-007',
        userId: 'user-004',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com',
        role: 'owner'
      }
    ]
  },
  {
    id: 'doc-004',
    name: 'Invoice #INV-001.pdf',
    type: 'pdf',
    size: 980000,
    createdAt: generateDate(25),
    updatedAt: generateDate(25),
    createdBy: 'System',
    lastModifiedBy: 'System',
    url: 'https://example.com/documents/invoice-001',
    webUrl: 'https://example-tenant.sharepoint.com/documents/invoice-001',
    downloadUrl: 'https://example.com/documents/invoice-001/download',
    thumbnailUrl: 'https://example.com/thumbnails/pdf.png',
    folder: 'Invoices',
    parentId: 'folder-001',
    relatedItemId: 'INV-001',
    relatedItemType: 'invoice',
    tags: ['invoice', 'finance'],
    permissions: [
      {
        id: 'perm-008',
        userId: 'user-001',
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        role: 'owner'
      }
    ]
  },
  {
    id: 'doc-005',
    name: 'Production Schedule - Q2.xlsx',
    type: 'excel',
    size: 1650000,
    createdAt: generateDate(20),
    updatedAt: generateDate(2),
    createdBy: 'Admin User',
    lastModifiedBy: 'Production Manager',
    url: 'https://example.com/documents/production-schedule-q2',
    webUrl: 'https://example-tenant.sharepoint.com/documents/production-schedule-q2',
    downloadUrl: 'https://example.com/documents/production-schedule-q2/download',
    thumbnailUrl: 'https://example.com/thumbnails/excel.png',
    folder: 'Production Plans',
    parentId: 'folder-006',
    tags: ['production', 'schedule', 'planning'],
    permissions: [
      {
        id: 'perm-009',
        userId: 'user-001',
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        role: 'owner'
      },
      {
        id: 'perm-010',
        userId: 'user-005',
        userName: 'Production Manager',
        userEmail: 'production@example.com',
        role: 'editor'
      }
    ]
  },
  {
    id: 'doc-006',
    name: 'Website Redesign Proposal.docx',
    type: 'word',
    size: 3250000,
    createdAt: generateDate(15),
    updatedAt: generateDate(1),
    createdBy: 'Marketing Manager',
    lastModifiedBy: 'Marketing Manager',
    url: 'https://example.com/documents/website-proposal',
    webUrl: 'https://example-tenant.sharepoint.com/documents/website-proposal',
    downloadUrl: 'https://example.com/documents/website-proposal/download',
    thumbnailUrl: 'https://example.com/thumbnails/word.png',
    folder: 'Marketing Materials',
    parentId: 'folder-004',
    relatedItemId: mockCampaigns[0].id,
    relatedItemType: 'campaign',
    tags: ['website', 'proposal', 'marketing'],
    permissions: [
      {
        id: 'perm-011',
        userId: 'user-001',
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        role: 'viewer'
      },
      {
        id: 'perm-012',
        userId: 'user-006',
        userName: 'Marketing Manager',
        userEmail: 'marketing@example.com',
        role: 'owner'
      }
    ]
  }
];

// Summary statistics for dashboard
export const dashboardStats = {
  totalCustomers: mockCustomers.length,
  activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
  leads: mockCustomers.filter(c => c.status === 'lead').length,
  inventoryValue: mockProducts.reduce((sum, p) => sum + (p.costPrice * p.stock), 0),
  lowStockItems: mockProducts.filter(p => p.stock <= p.reorderLevel).length,
  totalInvoices: mockInvoices.length,
  unpaidInvoices: mockInvoices.filter(i => i.status === 'sent' || i.status === 'overdue').length,
  totalSales: mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
  totalExpenses: mockExpenses.reduce((sum, e) => sum + e.amount, 0),
  activeCampaigns: mockCampaigns.filter(c => c.status === 'active').length,
  campaignLeads: mockCampaigns.reduce((sum, c) => sum + c.leads, 0),
  campaignConversions: mockCampaigns.reduce((sum, c) => sum + c.conversions, 0),
  productionOrders: mockProductionOrders.length,
  inProgressOrders: mockProductionOrders.filter(o => o.status === 'in_progress').length,
};