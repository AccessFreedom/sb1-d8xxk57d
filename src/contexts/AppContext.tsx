import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  mockCustomers, 
  mockProducts, 
  mockMaterials, 
  mockInvoices, 
  mockExpenses, 
  mockCampaigns,
  mockProductionOrders,
  mockDocuments,
  mockDocumentFolders,
  dashboardStats
} from '../data/mockData';
import { 
  Customer, 
  Product, 
  Material, 
  Invoice, 
  Expense, 
  Campaign,
  ProductionOrder,
  Document,
  DocumentFolder,
  DocumentPermission
} from '../types';

// Define the context shape
interface AppContextType {
  // Data
  customers: Customer[];
  products: Product[];
  materials: Material[];
  invoices: Invoice[];
  expenses: Expense[];
  campaigns: Campaign[];
  productionOrders: ProductionOrder[];
  documents: Document[];
  documentFolders: DocumentFolder[];
  stats: typeof dashboardStats;
  
  // Active Module
  activeModule: string;
  setActiveModule: (module: string) => void;
  
  // CRUD operations
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  addProductionOrder: (order: Omit<ProductionOrder, 'id'>) => void;
  updateProductionOrder: (id: string, order: Partial<ProductionOrder>) => void;
  deleteProductionOrder: (id: string) => void;
  
  // Document operations
  addDocument: (document: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  
  addDocumentFolder: (folder: Omit<DocumentFolder, 'id'>) => void;
  updateDocumentFolder: (id: string, folder: Partial<DocumentFolder>) => void;
  deleteDocumentFolder: (id: string) => void;
  
  updateDocumentPermission: (documentId: string, permission: DocumentPermission) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Generate a simple ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for data
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(mockProductionOrders);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [documentFolders, setDocumentFolders] = useState<DocumentFolder[]>(mockDocumentFolders);
  const [stats, setStats] = useState(dashboardStats);
  
  // Active module state
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // CRUD operations for Customers
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: generateId() };
    setCustomers([...customers, newCustomer as Customer]);
    // Update stats
    setStats({
      ...stats,
      totalCustomers: stats.totalCustomers + 1,
      activeCustomers: customer.status === 'active' ? stats.activeCustomers + 1 : stats.activeCustomers,
      leads: customer.status === 'lead' ? stats.leads + 1 : stats.leads
    });
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, ...customerData } : customer
    ));
    // Stats would need to be recalculated here for a real app
  };

  const deleteCustomer = (id: string) => {
    const customerToDelete = customers.find(c => c.id === id);
    setCustomers(customers.filter(customer => customer.id !== id));
    // Update stats
    if (customerToDelete) {
      setStats({
        ...stats,
        totalCustomers: stats.totalCustomers - 1,
        activeCustomers: customerToDelete.status === 'active' ? stats.activeCustomers - 1 : stats.activeCustomers,
        leads: customerToDelete.status === 'lead' ? stats.leads - 1 : stats.leads
      });
    }
  };

  // CRUD operations for Products
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: generateId() };
    setProducts([...products, newProduct as Product]);
    // Update stats
    setStats({
      ...stats,
      inventoryValue: stats.inventoryValue + (product.costPrice * product.stock),
      lowStockItems: product.stock <= product.reorderLevel ? stats.lowStockItems + 1 : stats.lowStockItems
    });
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
    // Stats would need to be recalculated here for a real app
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    setProducts(products.filter(product => product.id !== id));
    // Update stats
    if (productToDelete) {
      setStats({
        ...stats,
        inventoryValue: stats.inventoryValue - (productToDelete.costPrice * productToDelete.stock),
        lowStockItems: productToDelete.stock <= productToDelete.reorderLevel ? stats.lowStockItems - 1 : stats.lowStockItems
      });
    }
  };

  // CRUD operations for Invoices
  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newId = `INV-${invoices.length + 1}`.padStart(8, '0');
    const newInvoice = { ...invoice, id: newId };
    setInvoices([...invoices, newInvoice as Invoice]);
    // Update stats
    setStats({
      ...stats,
      totalInvoices: stats.totalInvoices + 1,
      unpaidInvoices: invoice.status === 'sent' || invoice.status === 'overdue' ? stats.unpaidInvoices + 1 : stats.unpaidInvoices,
      totalSales: invoice.status === 'paid' ? stats.totalSales + invoice.total : stats.totalSales
    });
  };

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, ...invoiceData } : invoice
    ));
    // Stats would need to be recalculated here for a real app
  };

  const deleteInvoice = (id: string) => {
    const invoiceToDelete = invoices.find(i => i.id === id);
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    // Update stats
    if (invoiceToDelete) {
      setStats({
        ...stats,
        totalInvoices: stats.totalInvoices - 1,
        unpaidInvoices: invoiceToDelete.status === 'sent' || invoiceToDelete.status === 'overdue' ? stats.unpaidInvoices - 1 : stats.unpaidInvoices,
        totalSales: invoiceToDelete.status === 'paid' ? stats.totalSales - invoiceToDelete.total : stats.totalSales
      });
    }
  };

  // CRUD operations for Expenses
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newId = `EXP-${expenses.length + 1}`.padStart(8, '0');
    const newExpense = { ...expense, id: newId };
    setExpenses([...expenses, newExpense as Expense]);
    // Update stats
    setStats({
      ...stats,
      totalExpenses: stats.totalExpenses + expense.amount
    });
  };

  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    const oldExpense = expenses.find(e => e.id === id);
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...expenseData } : expense
    ));
    // Update stats if amount changed
    if (oldExpense && expenseData.amount !== undefined) {
      setStats({
        ...stats,
        totalExpenses: stats.totalExpenses - oldExpense.amount + expenseData.amount
      });
    }
  };

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(e => e.id === id);
    setExpenses(expenses.filter(expense => expense.id !== id));
    // Update stats
    if (expenseToDelete) {
      setStats({
        ...stats,
        totalExpenses: stats.totalExpenses - expenseToDelete.amount
      });
    }
  };

  // CRUD operations for Campaigns
  const addCampaign = (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign = { ...campaign, id: generateId() };
    setCampaigns([...campaigns, newCampaign as Campaign]);
    // Update stats
    setStats({
      ...stats,
      activeCampaigns: campaign.status === 'active' ? stats.activeCampaigns + 1 : stats.activeCampaigns,
      campaignLeads: stats.campaignLeads + campaign.leads,
      campaignConversions: stats.campaignConversions + campaign.conversions
    });
  };

  const updateCampaign = (id: string, campaignData: Partial<Campaign>) => {
    const oldCampaign = campaigns.find(c => c.id === id);
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id ? { ...campaign, ...campaignData } : campaign
    ));
    // Stats updates for complex cases would be handled here
  };

  const deleteCampaign = (id: string) => {
    const campaignToDelete = campaigns.find(c => c.id === id);
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    // Update stats
    if (campaignToDelete) {
      setStats({
        ...stats,
        activeCampaigns: campaignToDelete.status === 'active' ? stats.activeCampaigns - 1 : stats.activeCampaigns,
        campaignLeads: stats.campaignLeads - campaignToDelete.leads,
        campaignConversions: stats.campaignConversions - campaignToDelete.conversions
      });
    }
  };

  // CRUD operations for Production Orders
  const addProductionOrder = (order: Omit<ProductionOrder, 'id'>) => {
    const newId = `PO-${productionOrders.length + 1}`.padStart(8, '0');
    const newOrder = { ...order, id: newId };
    setProductionOrders([...productionOrders, newOrder as ProductionOrder]);
    // Update stats
    setStats({
      ...stats,
      productionOrders: stats.productionOrders + 1,
      inProgressOrders: order.status === 'in_progress' ? stats.inProgressOrders + 1 : stats.inProgressOrders
    });
  };

  const updateProductionOrder = (id: string, orderData: Partial<ProductionOrder>) => {
    const oldOrder = productionOrders.find(o => o.id === id);
    setProductionOrders(productionOrders.map(order => 
      order.id === id ? { ...order, ...orderData } : order
    ));
    // Stats updates for complex cases would be handled here
  };

  const deleteProductionOrder = (id: string) => {
    const orderToDelete = productionOrders.find(o => o.id === id);
    setProductionOrders(productionOrders.filter(order => order.id !== id));
    // Update stats
    if (orderToDelete) {
      setStats({
        ...stats,
        productionOrders: stats.productionOrders - 1,
        inProgressOrders: orderToDelete.status === 'in_progress' ? stats.inProgressOrders - 1 : stats.inProgressOrders
      });
    }
  };

  // CRUD operations for Documents
  const addDocument = (document: Omit<Document, 'id'>) => {
    const newDocument = { ...document, id: generateId() };
    setDocuments([...documents, newDocument as Document]);
  };

  const updateDocument = (id: string, documentData: Partial<Document>) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, ...documentData } : doc
    ));
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  // CRUD operations for Document Folders
  const addDocumentFolder = (folder: Omit<DocumentFolder, 'id'>) => {
    const newFolder = { ...folder, id: generateId() };
    setDocumentFolders([...documentFolders, newFolder as DocumentFolder]);
  };

  const updateDocumentFolder = (id: string, folderData: Partial<DocumentFolder>) => {
    setDocumentFolders(documentFolders.map(folder => 
      folder.id === id ? { ...folder, ...folderData } : folder
    ));
  };

  const deleteDocumentFolder = (id: string) => {
    setDocumentFolders(documentFolders.filter(folder => folder.id !== id));
  };

  // Update document permission
  const updateDocumentPermission = (documentId: string, permission: DocumentPermission) => {
    setDocuments(documents.map(doc => {
      if (doc.id === documentId) {
        const existingPermissionIndex = doc.permissions.findIndex(p => p.id === permission.id);
        
        if (existingPermissionIndex >= 0) {
          // Update existing permission
          const updatedPermissions = [...doc.permissions];
          updatedPermissions[existingPermissionIndex] = permission;
          return { ...doc, permissions: updatedPermissions };
        } else {
          // Add new permission
          return { 
            ...doc, 
            permissions: [...doc.permissions, { ...permission, id: permission.id || generateId() }]
          };
        }
      }
      return doc;
    }));
  };

  // Context value
  const value = {
    // Data
    customers,
    products,
    materials,
    invoices,
    expenses,
    campaigns,
    productionOrders,
    documents,
    documentFolders,
    stats,
    
    // Active Module
    activeModule,
    setActiveModule,
    
    // CRUD operations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    addProduct,
    updateProduct,
    deleteProduct,
    
    addInvoice,
    updateInvoice,
    deleteInvoice,
    
    addExpense,
    updateExpense,
    deleteExpense,
    
    addCampaign,
    updateCampaign,
    deleteCampaign,

    addProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
    
    // Document operations
    addDocument,
    updateDocument,
    deleteDocument,
    
    addDocumentFolder,
    updateDocumentFolder,
    deleteDocumentFolder,
    
    updateDocumentPermission
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};