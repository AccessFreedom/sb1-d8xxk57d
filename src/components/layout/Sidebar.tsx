import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  FileText, 
  DollarSign, 
  Megaphone,
  Factory,
  Settings,
  BarChart,
  File
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <div
      className={`flex items-center px-4 py-3 mb-1 rounded-lg cursor-pointer transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-blue-50'
      }`}
      onClick={onClick}
    >
      <div className="mr-3">{icon}</div>
      <span className="font-medium">{label}</span>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'crm', label: 'CRM', icon: <Users size={18} /> },
    { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
    { id: 'production', label: 'Production', icon: <Factory size={18} /> },
    { id: 'sales', label: 'Sales', icon: <ShoppingCart size={18} /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText size={18} /> },
    { id: 'expenses', label: 'Expenses', icon: <DollarSign size={18} /> },
    { id: 'marketing', label: 'Marketing', icon: <Megaphone size={18} /> },
    { id: 'documents', label: 'Documents', icon: <File size={18} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-700 flex items-center">
          <Package className="mr-2" />
          BizMaster Pro
        </h1>
      </div>
      
      <div className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeModule === item.id}
            onClick={() => setActiveModule(item.id)}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="ml-2">
            <div className="text-sm font-semibold">Admin User</div>
            <div className="text-xs text-gray-500">admin@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;