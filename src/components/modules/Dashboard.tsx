import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Megaphone, 
  FileText, 
  AlertCircle,
  TrendingUp,
  Factory
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex items-center">
      <div className={`rounded-full ${color} p-3 mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { stats } = useAppContext();
  
  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate profit
  const profit = stats.totalSales - stats.totalExpenses;
  
  // Calculate conversion rate
  const conversionRate = stats.campaignLeads > 0 
    ? ((stats.campaignConversions / stats.campaignLeads) * 100).toFixed(1) 
    : '0';
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Business Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Sales" 
          value={formatCurrency(stats.totalSales)}
          icon={<TrendingUp className="text-white" size={20} />}
          color="bg-green-500"
        />
        <StatCard 
          title="Total Expenses" 
          value={formatCurrency(stats.totalExpenses)}
          icon={<DollarSign className="text-white" size={20} />}
          color="bg-red-500"
        />
        <StatCard 
          title="Net Profit" 
          value={formatCurrency(profit)}
          icon={<ShoppingCart className="text-white" size={20} />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Active Customers" 
          value={stats.activeCustomers}
          icon={<Users className="text-white" size={20} />}
          color="bg-purple-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer & Inventory Section */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">Customer & Inventory Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center">
                <Users size={18} className="text-blue-500 mr-2" />
                <span>Total Customers</span>
              </div>
              <span className="font-bold">{stats.totalCustomers}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center">
                <Users size={18} className="text-yellow-500 mr-2" />
                <span>Active Leads</span>
              </div>
              <span className="font-bold">{stats.leads}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center">
                <Package size={18} className="text-blue-500 mr-2" />
                <span>Inventory Value</span>
              </div>
              <span className="font-bold">{formatCurrency(stats.inventoryValue)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center">
                <AlertCircle size={18} className="text-red-500 mr-2" />
                <span>Low Stock Items</span>
              </div>
              <span className="font-bold">{stats.lowStockItems}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Factory size={18} className="text-green-500 mr-2" />
                <span>Production Orders</span>
              </div>
              <span className="font-bold">{stats.productionOrders}</span>
            </div>
          </div>
        </div>
        
        {/* Financial & Marketing Section */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">Finances & Marketing</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center">
                <FileText size={18} className="text-blue-500 mr-2" />
                <span>Total Invoices</span>
              </div>
              <span className="font-bold">{stats.totalInvoices}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center">
                <FileText size={18} className="text-orange-500 mr-2" />
                <span>Unpaid Invoices</span>
              </div>
              <span className="font-bold">{stats.unpaidInvoices}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center">
                <Megaphone size={18} className="text-purple-500 mr-2" />
                <span>Active Campaigns</span>
              </div>
              <span className="font-bold">{stats.activeCampaigns}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center">
                <Users size={18} className="text-blue-500 mr-2" />
                <span>Campaign Leads</span>
              </div>
              <span className="font-bold">{stats.campaignLeads}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp size={18} className="text-green-500 mr-2" />
                <span>Conversion Rate</span>
              </div>
              <span className="font-bold">{conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start pb-3 border-b">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium">New invoice created</p>
              <p className="text-sm text-gray-500">Invoice #INV-005 for Emily Chen - £358.99</p>
              <p className="text-xs text-gray-400 mt-1">Today, 9:41 AM</p>
            </div>
          </div>
          <div className="flex items-start pb-3 border-b">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <DollarSign size={16} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium">Payment received</p>
              <p className="text-sm text-gray-500">John Smith paid invoice #INV-002 - £239.94</p>
              <p className="text-xs text-gray-400 mt-1">Yesterday, 2:30 PM</p>
            </div>
          </div>
          <div className="flex items-start pb-3 border-b">
            <div className="bg-yellow-100 rounded-full p-2 mr-3">
              <Users size={16} className="text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">New lead created</p>
              <p className="text-sm text-gray-500">Michael Rodriguez from Global Tech</p>
              <p className="text-xs text-gray-400 mt-1">Yesterday, 11:15 AM</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <Package size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Inventory updated</p>
              <p className="text-sm text-gray-500">25 Premium Widgets added to inventory</p>
              <p className="text-xs text-gray-400 mt-1">2 days ago, 4:45 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;