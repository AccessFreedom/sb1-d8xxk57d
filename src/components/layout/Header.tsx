import React, { useState } from 'react';
import { Bell, Search, HelpCircle, Moon, Sun, Menu } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { activeModule } = useAppContext();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Format module name for display
  const formatModuleName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Toggle dark/light mode (this would normally update a theme context)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <button 
          className="mr-4 p-1 rounded-full hover:bg-gray-100 lg:hidden" 
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{formatModuleName(activeModule)}</h2>
      </div>
      
      <div className="flex-1 mx-10 max-w-xl hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-1.5 rounded-full hover:bg-gray-100">
          <HelpCircle size={20} className="text-gray-600" />
        </button>
        <button className="p-1.5 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <button 
          className="p-1.5 rounded-full hover:bg-gray-100"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <Sun size={20} className="text-gray-600" />
          ) : (
            <Moon size={20} className="text-gray-600" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;