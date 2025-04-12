import React, { useState } from 'react';
import { 
  Save, 
  UserCog, 
  Building, 
  CreditCard, 
  Mail, 
  Bell, 
  Lock, 
  Palette,
  Users,
  Database
} from 'lucide-react';

const SettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationApp, setNotificationApp] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Company info state
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Acme Corporation',
    address: '123 Business Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States',
    taxId: 'US123456789',
    phone: '(555) 123-4567',
    email: 'info@acmecorp.com',
    website: 'www.acmecorp.com'
  });
  
  // User info state
  const [userInfo, setUserInfo] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phone: '(555) 987-6543',
    position: 'Administrator',
    department: 'Management'
  });
  
  // Handle form input change
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo({
      ...companyInfo,
      [name]: value
    });
  };
  
  // Handle user info change
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a server
    alert('Settings saved successfully!');
  };
  
  // Tab button component
  const TabButton: React.FC<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }> = ({ id, label, icon }) => (
    <button
      className={`flex items-center px-4 py-2 mb-1 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-blue-50'
      }`}
      onClick={() => setActiveTab(id)}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </button>
  );
  
  // Render profile settings
  const renderProfileSettings = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Personal Information</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={userInfo.firstName}
              onChange={handleUserInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={userInfo.lastName}
              onChange={handleUserInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={userInfo.phone}
              onChange={handleUserInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={userInfo.position}
              onChange={handleUserInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
            <select
              id="department"
              name="department"
              value={userInfo.department}
              onChange={handleUserInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Management">Management</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">User Photo</h2>
        <div className="mt-4 flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)}
          </div>
          <div>
            <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              Change Photo
            </button>
            <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size 1MB.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save size={18} className="mr-1" />
          Save Changes
        </button>
      </div>
    </form>
  );
  
  // Render company settings
  const renderCompanySettings = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Company Information</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={companyInfo.name}
              onChange={handleCompanyInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID / VAT Number</label>
            <input
              type="text"
              id="taxId"
              name="taxId"
              value={companyInfo.taxId}
              onChange={handleCompanyInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={companyInfo.address}
            onChange={handleCompanyInfoChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={companyInfo.city}
              onChange={handleCompanyInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
            <input
              type="text"
              id="state"
              name="state"
              value={companyInfo.state}
              onChange={handleCompanyInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={companyInfo.zip}
              onChange={handleCompanyInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={companyInfo.country}
            onChange={handleCompanyInfoChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Contact Information</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={companyInfo.phone}
              onChange={handleCompanyInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={companyInfo.email}
              onChange={handleCompanyInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={companyInfo.website}
            onChange={handleCompanyInfoChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save size={18} className="mr-1" />
          Save Changes
        </button>
      </div>
    </form>
  );
  
  // Render notification settings
  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Notification Preferences</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationEmail}
                onChange={() => setNotificationEmail(!notificationEmail)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">In-App Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications within the application</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationApp}
                onChange={() => setNotificationApp(!notificationApp)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Notification Types</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center">
            <input
              id="notifications-sales"
              name="notifications-sales"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              defaultChecked
            />
            <label htmlFor="notifications-sales" className="ml-3">
              <div className="font-medium">Sales Alerts</div>
              <p className="text-sm text-gray-500">Notifications about new sales, invoices, and payments</p>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="notifications-inventory"
              name="notifications-inventory"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              defaultChecked
            />
            <label htmlFor="notifications-inventory" className="ml-3">
              <div className="font-medium">Inventory Alerts</div>
              <p className="text-sm text-gray-500">Notifications about low stock items and inventory changes</p>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="notifications-customers"
              name="notifications-customers"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              defaultChecked
            />
            <label htmlFor="notifications-customers" className="ml-3">
              <div className="font-medium">Customer Updates</div>
              <p className="text-sm text-gray-500">Notifications about new customers and customer activity</p>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="notifications-marketing"
              name="notifications-marketing"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              defaultChecked
            />
            <label htmlFor="notifications-marketing" className="ml-3">
              <div className="font-medium">Marketing Campaign Updates</div>
              <p className="text-sm text-gray-500">Notifications about campaign performance and metrics</p>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={handleSubmit}
        >
          <Save size={18} className="mr-1" />
          Save Preferences
        </button>
      </div>
    </div>
  );
  
  // Render appearance settings
  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Theme Preferences</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-gray-500">Use dark theme for the application</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Layout Options</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 cursor-pointer ring-2 ring-blue-500">
            <div className="mb-2 h-32 bg-gray-100 rounded-md flex items-center justify-center">
              <div className="w-full h-full p-2 flex">
                <div className="w-1/5 h-full bg-gray-300 rounded"></div>
                <div className="w-4/5 h-full pl-2 flex flex-col">
                  <div className="h-1/6 bg-gray-300 rounded mb-2"></div>
                  <div className="flex-1 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Default Layout</span>
              <input
                type="radio"
                name="layout"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
            </div>
          </div>
          
          <div className="border rounded-lg p-4 cursor-pointer">
            <div className="mb-2 h-32 bg-gray-100 rounded-md flex items-center justify-center">
              <div className="w-full h-full p-2 flex">
                <div className="w-full h-full flex flex-col">
                  <div className="h-1/6 bg-gray-300 rounded mb-2"></div>
                  <div className="flex-1 flex">
                    <div className="w-1/5 bg-gray-300 rounded mr-2"></div>
                    <div className="flex-1 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Top Navigation</span>
              <input
                type="radio"
                name="layout"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="border rounded-lg p-4 cursor-pointer">
            <div className="mb-2 h-32 bg-gray-100 rounded-md flex items-center justify-center">
              <div className="w-full h-full p-2 flex flex-col">
                <div className="h-1/6 bg-gray-300 rounded mb-2"></div>
                <div className="flex-1 flex">
                  <div className="w-1/5 bg-gray-300 rounded mr-2"></div>
                  <div className="flex-1 bg-gray-300 rounded"></div>
                  <div className="w-1/5 bg-gray-300 rounded ml-2"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Three Column</span>
              <input
                type="radio"
                name="layout"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Color Theme</h2>
        <div className="mt-4 flex space-x-4">
          <div className="cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-blue-600 ring-2 ring-blue-600 ring-offset-2"></div>
            <div className="text-center text-sm mt-1">Blue</div>
          </div>
          <div className="cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-purple-600"></div>
            <div className="text-center text-sm mt-1">Purple</div>
          </div>
          <div className="cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-green-600"></div>
            <div className="text-center text-sm mt-1">Green</div>
          </div>
          <div className="cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-orange-600"></div>
            <div className="text-center text-sm mt-1">Orange</div>
          </div>
          <div className="cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-red-600"></div>
            <div className="text-center text-sm mt-1">Red</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={handleSubmit}
        >
          <Save size={18} className="mr-1" />
          Save Preferences
        </button>
      </div>
    </div>
  );
  
  // Render security settings
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Password Settings</h2>
        <form className="mt-4 space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              id="current-password"
              name="current-password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Password must:</p>
            <ul className="list-disc pl-5">
              <li>Be at least 8 characters long</li>
              <li>Include at least one uppercase letter</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>
          
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Two-Factor Authentication</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Secure your account with an extra layer of protection</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Set Up Two-Factor Authentication
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Login Sessions</h2>
        <div className="mt-4 space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Current Session</h3>
                <p className="text-sm text-gray-500">Device: Chrome on Windows</p>
                <p className="text-sm text-gray-500">IP Address: 192.168.1.1</p>
                <p className="text-sm text-gray-500">Last Activity: Just now</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Active</span>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Previous Session</h3>
                <p className="text-sm text-gray-500">Device: Safari on Mac</p>
                <p className="text-sm text-gray-500">IP Address: 192.168.1.2</p>
                <p className="text-sm text-gray-500">Last Activity: 2 days ago</p>
              </div>
              <button
                type="button"
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Revoke
              </button>
            </div>
          </div>
          
          <button
            type="button"
            className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
          >
            Sign Out All Other Sessions
          </button>
        </div>
      </div>
    </div>
  );
  
  // Render user management
  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">User Management</h2>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add User
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">AU</div>
                  <div className="ml-3">
                    <div className="font-medium">Admin User</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">admin@example.com</td>
              <td className="py-3 px-4 whitespace-nowrap">Administrator</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Active</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-right">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                <button className="text-gray-600 hover:text-gray-800">Disable</button>
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">JD</div>
                  <div className="ml-3">
                    <div className="font-medium">John Doe</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">john.doe@example.com</td>
              <td className="py-3 px-4 whitespace-nowrap">Sales Manager</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Active</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-right">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                <button className="text-gray-600 hover:text-gray-800">Disable</button>
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">JS</div>
                  <div className="ml-3">
                    <div className="font-medium">Jane Smith</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">jane.smith@example.com</td>
              <td className="py-3 px-4 whitespace-nowrap">Inventory Manager</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Active</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-right">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                <button className="text-gray-600 hover:text-gray-800">Disable</button>
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">RJ</div>
                  <div className="ml-3">
                    <div className="font-medium">Robert Johnson</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">robert.j@example.com</td>
              <td className="py-3 px-4 whitespace-nowrap">Finance Manager</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded-full">Inactive</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-right">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                <button className="text-green-600 hover:text-green-800">Enable</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Role Management</h2>
        <div className="mt-4 space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Administrator</h3>
            <p className="text-sm text-gray-500 mb-2">Full access to all system functions</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">All permissions</span>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Sales Manager</h3>
            <p className="text-sm text-gray-500 mb-2">Manage sales, customers, and invoices</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Customers</span>
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Sales</span>
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Invoices</span>
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Marketing</span>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Inventory Manager</h3>
            <p className="text-sm text-gray-500 mb-2">Manage products, inventory, and production</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Inventory</span>
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Products</span>
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Production</span>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Finance Manager</h3>
            <p className="text-sm text-gray-500 mb-2">Manage expenses, invoices, and reports</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Invoices</span>
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Expenses</span>
              <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render database settings
  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Database Information</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Database Type</h3>
            <p className="text-base">PostgreSQL</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Version</h3>
            <p className="text-base">13.4</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Connection Status</h3>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-base">Connected</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Last Backup</h3>
            <p className="text-base">2023-05-12 08:30:00</p>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Backup Settings</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Automatic Backups</h3>
              <p className="text-sm text-gray-500">Backup your database automatically on a schedule</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                defaultChecked
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Backup Frequency</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              defaultValue="daily"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Retention Period</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              defaultValue="30"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </select>
          </div>
          
          <div className="flex">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
            >
              Backup Now
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              View Backup History
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium border-b pb-2">Data Management</h2>
        <div className="mt-4 space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium">Database Size</h3>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-sm">
                <span>Used: 258 MB</span>
                <span>Total: 1 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: '25.8%' }}
                ></div>
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mr-2"
            >
              Optimize Database
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
            >
              Clear Test Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render active content based on tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'company':
        return renderCompanySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'security':
        return renderSecuritySettings();
      case 'users':
        return renderUserManagement();
      case 'database':
        return renderDatabaseSettings();
      default:
        return renderProfileSettings();
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="w-full md:w-64 space-y-1">
          <TabButton id="profile" label="Profile" icon={<UserCog size={18} />} />
          <TabButton id="company" label="Company" icon={<Building size={18} />} />
          <TabButton id="notifications" label="Notifications" icon={<Bell size={18} />} />
          <TabButton id="appearance" label="Appearance" icon={<Palette size={18} />} />
          <TabButton id="security" label="Security" icon={<Lock size={18} />} />
          <TabButton id="users" label="Users & Roles" icon={<Users size={18} />} />
          <TabButton id="database" label="Database" icon={<Database size={18} />} />
        </div>
        
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;