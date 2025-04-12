import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Download, 
  FileText,
  Filter,
  RefreshCw
} from 'lucide-react';

const ReportsModule: React.FC = () => {
  const { 
    customers, 
    invoices, 
    expenses, 
    products, 
    campaigns,
    productionOrders
  } = useAppContext();
  
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [isGenerating, setIsGenerating] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Filter data by date range
  const filterByDateRange = (items, dateField = 'date') => {
    const now = new Date();
    let threshold = new Date();
    
    switch (dateRange) {
      case 'week':
        threshold.setDate(now.getDate() - 7);
        break;
      case 'month':
        threshold.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        threshold.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        threshold.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return items;
    }
    
    const thresholdTime = threshold.getTime();
    
    return items.filter(item => new Date(item[dateField]).getTime() >= thresholdTime);
  };

  // Get title based on current report type
  const getReportTitle = () => {
    switch (reportType) {
      case 'sales':
        return 'Sales Report';
      case 'expenses':
        return 'Expense Report';
      case 'inventory':
        return 'Inventory Report';
      case 'customers':
        return 'Customer Analytics';
      case 'marketing':
        return 'Marketing Performance';
      default:
        return 'Report';
    }
  };

  // Generate sales report data
  const generateSalesReport = () => {
    const filteredInvoices = filterByDateRange(invoices);
    
    // Total sales
    const totalSales = filteredInvoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total, 0);
    
    // Sales by status
    const salesByStatus = {
      paid: filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
      sent: filteredInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
      draft: filteredInvoices.filter(inv => inv.status === 'draft').reduce((sum, inv) => sum + inv.total, 0),
      overdue: filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0)
    };
    
    // Sales by customer
    const salesByCustomer = {};
    filteredInvoices.forEach(invoice => {
      if (salesByCustomer[invoice.customerName]) {
        salesByCustomer[invoice.customerName] += invoice.total;
      } else {
        salesByCustomer[invoice.customerName] = invoice.total;
      }
    });
    
    // Convert to array and sort
    const topCustomers = Object.entries(salesByCustomer)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
    
    return {
      totalSales,
      invoiceCount: filteredInvoices.length,
      paidInvoiceCount: filteredInvoices.filter(inv => inv.status === 'paid').length,
      overdueInvoiceCount: filteredInvoices.filter(inv => inv.status === 'overdue').length,
      averageSale: filteredInvoices.length > 0 ? totalSales / filteredInvoices.length : 0,
      salesByStatus,
      topCustomers
    };
  };

  // Generate expense report data
  const generateExpenseReport = () => {
    const filteredExpenses = filterByDateRange(expenses);
    
    // Total expenses
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Expenses by category
    const expensesByCategory = {};
    filteredExpenses.forEach(expense => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.amount;
      } else {
        expensesByCategory[expense.category] = expense.amount;
      }
    });
    
    // Convert to array and sort
    const topCategories = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
    
    // Expenses by status
    const expensesByStatus = {
      paid: filteredExpenses.filter(exp => exp.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0),
      approved: filteredExpenses.filter(exp => exp.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0),
      pending: filteredExpenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0)
    };
    
    return {
      totalExpenses,
      expenseCount: filteredExpenses.length,
      paidExpenseCount: filteredExpenses.filter(exp => exp.status === 'paid').length,
      pendingExpenseCount: filteredExpenses.filter(exp => exp.status === 'pending').length,
      topCategories,
      expensesByStatus
    };
  };

  // Generate inventory report data
  const generateInventoryReport = () => {
    // Calculate inventory value
    const totalInventoryValue = products.reduce((sum, product) => sum + (product.costPrice * product.stock), 0);
    
    // Low stock items
    const lowStockItems = products.filter(product => product.stock <= product.reorderLevel);
    
    // Out of stock items
    const outOfStockItems = products.filter(product => product.stock === 0);
    
    // Top products by value
    const productsByValue = [...products]
      .map(product => ({
        ...product,
        totalValue: product.costPrice * product.stock
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
    
    return {
      totalInventoryValue,
      totalProducts: products.length,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      lowStockItems,
      productsByValue
    };
  };

  // Generate customer report data
  const generateCustomerReport = () => {
    // Active customers
    const activeCustomers = customers.filter(customer => customer.status === 'active');
    
    // Leads
    const leads = customers.filter(customer => customer.status === 'lead');
    
    // Customer by recent activity
    const recentCustomers = [...customers]
      .sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
      .slice(0, 5);
    
    // Calculate total sales by customer
    const customerSales = {};
    invoices.forEach(invoice => {
      if (customerSales[invoice.customerId]) {
        customerSales[invoice.customerId].sales += invoice.total;
        customerSales[invoice.customerId].count += 1;
      } else {
        customerSales[invoice.customerId] = {
          customerId: invoice.customerId,
          name: invoice.customerName,
          sales: invoice.total,
          count: 1
        };
      }
    });
    
    // Top customers by sales
    const topCustomers = Object.values(customerSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    
    return {
      totalCustomers: customers.length,
      activeCustomerCount: activeCustomers.length,
      leadCount: leads.length,
      customersByStatus: {
        active: activeCustomers.length,
        inactive: customers.filter(c => c.status === 'inactive').length,
        lead: leads.length
      },
      recentCustomers,
      topCustomers
    };
  };

  // Generate marketing report data
  const generateMarketingReport = () => {
    const filteredCampaigns = filterByDateRange(campaigns, 'startDate');
    
    // Total marketing spend
    const totalSpend = filteredCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
    
    // Total leads generated
    const totalLeads = filteredCampaigns.reduce((sum, campaign) => sum + campaign.leads, 0);
    
    // Total conversions
    const totalConversions = filteredCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
    
    // Conversion rate
    const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
    
    // Campaign performance
    const campaignPerformance = filteredCampaigns.map(campaign => ({
      name: campaign.name,
      type: campaign.type,
      leads: campaign.leads,
      conversions: campaign.conversions,
      spent: campaign.spent,
      conversionRate: campaign.leads > 0 ? (campaign.conversions / campaign.leads) * 100 : 0,
      costPerLead: campaign.leads > 0 ? campaign.spent / campaign.leads : 0,
      costPerConversion: campaign.conversions > 0 ? campaign.spent / campaign.conversions : 0
    }));
    
    return {
      totalCampaigns: filteredCampaigns.length,
      activeCampaigns: filteredCampaigns.filter(c => c.status === 'active').length,
      totalSpend,
      totalLeads,
      totalConversions,
      conversionRate,
      costPerLead: totalLeads > 0 ? totalSpend / totalLeads : 0,
      costPerConversion: totalConversions > 0 ? totalSpend / totalConversions : 0,
      campaignPerformance: campaignPerformance.sort((a, b) => b.conversions - a.conversions)
    };
  };

  // Get current report data based on type
  const getCurrentReportData = () => {
    switch (reportType) {
      case 'sales':
        return generateSalesReport();
      case 'expenses':
        return generateExpenseReport();
      case 'inventory':
        return generateInventoryReport();
      case 'customers':
        return generateCustomerReport();
      case 'marketing':
        return generateMarketingReport();
      default:
        return {};
    }
  };

  // Handle report generation
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 800);
  };

  // Handle report download
  const handleDownloadReport = () => {
    alert('Report download functionality would be implemented here.');
    // In a real application, this would generate a PDF or Excel file
  };

  // Report data
  const reportData = getCurrentReportData();

  // Report Type Button component
  const ReportTypeButton: React.FC<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }> = ({ id, label, icon }) => (
    <button
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        reportType === id 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-blue-50'
      }`}
      onClick={() => setReportType(id)}
    >
      <div className="mr-2">{icon}</div>
      <span>{label}</span>
    </button>
  );

  // Render specific report content based on type
  const renderReportContent = () => {
    switch (reportType) {
      case 'sales':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                <p className="text-xl font-bold">{formatCurrency(reportData.totalSales)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Invoices</h3>
                <p className="text-xl font-bold">{reportData.invoiceCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Average Sale</h3>
                <p className="text-xl font-bold">{formatCurrency(reportData.averageSale)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Overdue Invoices</h3>
                <p className="text-xl font-bold text-red-600">{reportData.overdueInvoiceCount}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Sales by Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Paid</span>
                      <span className="text-sm font-medium">{formatCurrency(reportData.salesByStatus.paid)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.salesByStatus.paid / reportData.totalSales) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Sent</span>
                      <span className="text-sm font-medium">{formatCurrency(reportData.salesByStatus.sent)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.salesByStatus.sent / reportData.totalSales) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Overdue</span>
                      <span className="text-sm font-medium">{formatCurrency(reportData.salesByStatus.overdue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.salesByStatus.overdue / reportData.totalSales) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Draft</span>
                      <span className="text-sm font-medium">{formatCurrency(reportData.salesByStatus.draft)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.salesByStatus.draft / reportData.totalSales) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Top Customers by Sales</h3>
                <div className="space-y-4">
                  {reportData.topCustomers && reportData.topCustomers.map((customer, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{customer.name}</span>
                        <span className="text-sm font-medium">{formatCurrency(customer.total)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(customer.total / reportData.topCustomers[0].total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'expenses':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                <p className="text-xl font-bold">{formatCurrency(reportData.totalExpenses)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Expense Count</h3>
                <p className="text-xl font-bold">{reportData.expenseCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Paid Expenses</h3>
                <p className="text-xl font-bold">{reportData.paidExpenseCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Pending Expenses</h3>
                <p className="text-xl font-bold">{reportData.pendingExpenseCount}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Expenses by Category</h3>
                <div className="space-y-4">
                  {reportData.topCategories && reportData.topCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{category.category}</span>
                        <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(category.amount / reportData.topCategories[0].amount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Expenses by Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Paid</span>
                      <span className="text-sm font-medium">{formatCurrency(reportData.expensesByStatus.paid)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.expensesByStatus.paid / reportData.totalExpenses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Approved</span>
                      <span className="text-sm font-medium">{formatCurrency(reportData.expensesByStatus.approved)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.expensesByStatus.approved / reportData.totalExpenses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Pending</span>
                      <span className="text-sm font-medium">{formatCurrency(reportData.expensesByStatus.pending)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.expensesByStatus.pending / reportData.totalExpenses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
                <p className="text-xl font-bold">{formatCurrency(reportData.totalInventoryValue)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                <p className="text-xl font-bold">{reportData.totalProducts}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
                <p className="text-xl font-bold text-yellow-600">{reportData.lowStockCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
                <p className="text-xl font-bold text-red-600">{reportData.outOfStockCount}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Top Products by Value</h3>
                <div className="space-y-4">
                  {reportData.productsByValue && reportData.productsByValue.map((product, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{product.name}</span>
                        <span className="text-sm font-medium">{formatCurrency(product.totalValue)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">Stock: {product.stock} units</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(product.totalValue / reportData.productsByValue[0].totalValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Low Stock Items</h3>
                <div className="overflow-y-auto max-h-64">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Level</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.lowStockItems && reportData.lowStockItems.map((product, index) => (
                        <tr key={index}>
                          <td className="py-2 px-3 whitespace-nowrap text-sm">{product.name}</td>
                          <td className="py-2 px-3 whitespace-nowrap text-sm font-medium text-red-600">{product.stock}</td>
                          <td className="py-2 px-3 whitespace-nowrap text-sm">{product.reorderLevel}</td>
                        </tr>
                      ))}
                      {reportData.lowStockItems && reportData.lowStockItems.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-sm text-gray-500">No low stock items</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'customers':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
                <p className="text-xl font-bold">{reportData.totalCustomers}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
                <p className="text-xl font-bold">{reportData.activeCustomerCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Leads</h3>
                <p className="text-xl font-bold">{reportData.leadCount}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Customers by Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Active</span>
                      <span className="text-sm font-medium">{reportData.customersByStatus && reportData.customersByStatus.active}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.customersByStatus && (reportData.customersByStatus.active / reportData.totalCustomers) * 100) || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Inactive</span>
                      <span className="text-sm font-medium">{reportData.customersByStatus && reportData.customersByStatus.inactive}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.customersByStatus && (reportData.customersByStatus.inactive / reportData.totalCustomers) * 100) || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Leads</span>
                      <span className="text-sm font-medium">{reportData.customersByStatus && reportData.customersByStatus.lead}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(reportData.customersByStatus && (reportData.customersByStatus.lead / reportData.totalCustomers) * 100) || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Top Customers by Sales</h3>
                <div className="space-y-4">
                  {reportData.topCustomers && reportData.topCustomers.map((customer, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{customer.name}</span>
                        <span className="text-sm font-medium">{formatCurrency(customer.sales)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">Orders: {customer.count}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(customer.sales / reportData.topCustomers[0].sales) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'marketing':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
                <p className="text-xl font-bold">{reportData.totalCampaigns}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Spend</h3>
                <p className="text-xl font-bold">{formatCurrency(reportData.totalSpend)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
                <p className="text-xl font-bold">{reportData.totalLeads}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
                <p className="text-xl font-bold">{formatPercentage(reportData.conversionRate)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Cost Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Cost per Lead</span>
                      <span className="text-sm font-medium">{formatCurrency(reportData.costPerLead)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Cost per Conversion</span>
                      <span className="text-sm font-medium">{formatCurrency(reportData.costPerConversion)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Active Campaigns</span>
                      <span className="text-sm font-medium">{reportData.activeCampaigns}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-md font-medium mb-4">Campaign Performance</h3>
                <div className="overflow-y-auto max-h-64">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Conv. Rate</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/Conv.</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.campaignPerformance && reportData.campaignPerformance.map((campaign, index) => (
                        <tr key={index}>
                          <td className="py-2 px-3 whitespace-nowrap text-sm">{campaign.name}</td>
                          <td className="py-2 px-3 whitespace-nowrap text-sm">{campaign.leads}</td>
                          <td className="py-2 px-3 whitespace-nowrap text-sm">{formatPercentage(campaign.conversionRate)}</td>
                          <td className="py-2 px-3 whitespace-nowrap text-sm">{formatCurrency(campaign.costPerConversion)}</td>
                        </tr>
                      ))}
                      {reportData.campaignPerformance && reportData.campaignPerformance.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-sm text-gray-500">No campaign data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Select a report type to generate</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw size={18} className="mr-1" />
                Refresh Report
              </>
            )}
          </button>
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
            onClick={handleDownloadReport}
          >
            <Download size={18} className="mr-1" />
            Download
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-2">
          <ReportTypeButton 
            id="sales" 
            label="Sales" 
            icon={<BarChart3 size={18} />} 
          />
          <ReportTypeButton 
            id="expenses" 
            label="Expenses" 
            icon={<DollarSign size={18} />} 
          />
          <ReportTypeButton 
            id="inventory" 
            label="Inventory" 
            icon={<Package size={18} />} 
          />
          <ReportTypeButton 
            id="customers" 
            label="Customers" 
            icon={<Users size={18} />} 
          />
          <ReportTypeButton 
            id="marketing" 
            label="Marketing" 
            icon={<TrendingUp size={18} />} 
          />
        </div>
        
        <div className="p-4 border-b flex items-center bg-gray-50">
          <div className="flex items-center mr-4">
            <FileText size={18} className="text-blue-600 mr-2" />
            <h2 className="font-medium">{getReportTitle()}</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-gray-600">Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2 text-sm"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        
        <div className="p-5">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-10">
              <RefreshCw size={40} className="text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Generating your report...</p>
            </div>
          ) : (
            renderReportContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsModule;