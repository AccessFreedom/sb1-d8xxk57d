import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppContext } from '../../contexts/AppContext';
import Dashboard from '../modules/Dashboard';
import CustomerModule from '../modules/CustomerModule';
import InventoryModule from '../modules/InventoryModule';
import ProductionModule from '../modules/ProductionModule';
import SalesModule from '../modules/SalesModule';
import InvoiceModule from '../modules/InvoiceModule';
import ExpenseModule from '../modules/ExpenseModule';
import MarketingModule from '../modules/MarketingModule';
import ReportsModule from '../modules/ReportsModule';
import SettingsModule from '../modules/SettingsModule';
import DocumentsModule from '../modules/DocumentsModule';

const Layout: React.FC = () => {
  const { activeModule } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render the active module
  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'crm':
        return <CustomerModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'production':
        return <ProductionModule />;
      case 'sales':
        return <SalesModule />;
      case 'invoices':
        return <InvoiceModule />;
      case 'expenses':
        return <ExpenseModule />;
      case 'marketing':
        return <MarketingModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'reports':
        return <ReportsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile, shown on larger screens */}
      <div className={`fixed inset-y-0 left-0 z-30 transform lg:relative lg:translate-x-0 transition duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>
      
      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-5">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default Layout;