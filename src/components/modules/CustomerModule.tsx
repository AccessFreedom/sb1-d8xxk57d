import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Edit, Trash2, Plus, Search, Filter, MoreHorizontal, File, FileText, FilePlus, ChevronRight, ChevronDown } from 'lucide-react';
import { Customer, Document } from '../../types';

/**
 * A customer management component that allows users to add, edit, search, filter, and display a list of customers along with their documents.
 * @example
 * useCustomerManagement()
 * Returns a rendered UI component for customer management.
 * @param {None} None - This hook function does not take any parameters.
 * @returns {JSX.Element} The complete customer management interface including search, add, edit, and view functionalities.
 * @description
 *   - Utilizes context to access and modify customer data globally.
 *   - State is managed using React's useState hook for various UI interactions such as modals and search state.
 *   - Provides inline editing and document association for each customer.
 *   - Offers a responsive design accommodating both mobile and desktop users.
 */
const CustomerModule: React.FC = () => {
  const { customers, documents, addCustomer, updateCustomer, deleteCustomer } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [expandedCustomers, setExpandedCustomers] = useState<string[]>([]);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    lastContact: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input change
  /**
   * Updates the customer information based on the triggered event from a form input.
   * @example
   * handleInputChange(event)
   * No specific return value; updates customer data state.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e - The event triggered by the form input change that contains the name and value.
   * @returns {void} This function does not return a value.
   * @description
   *   - Updates either editing or new customer state depending on the current operation mode.
   *   - Merges the existing customer data with the new input value, preserving other properties.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (editingCustomer) {
      setEditingCustomer({
        ...editingCustomer,
        [name]: value
      });
    } else {
      setNewCustomer({
        ...newCustomer,
        [name]: value
      });
    }
  };

  // Handle add new customer
  /**
  * Handles the submission event for adding a new customer.
  * @example
  * handleSubmit(e)
  * // no return value
  * @param {React.FormEvent} e - The form submission event.
  * @returns {void} Does not return anything.
  * @description
  *   - Prevents the default form submission behavior.
  *   - Calls a function to add a new customer with current input values.
  *   - Resets the new customer form fields to default values.
  *   - Closes the modal used for adding a new customer.
  */
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(newCustomer);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead',
      lastContact: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddModal(false);
  };

  // Handle edit customer
  const handleEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, editingCustomer);
      setEditingCustomer(null);
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  // Toggle customer expanded state
  const toggleCustomerExpanded = (customerId: string) => {
    setExpandedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  // Get documents related to a customer
  const getCustomerDocuments = (customerId: string) => {
    return documents.filter(doc => doc.relatedItemId === customerId && doc.relatedItemType === 'customer');
  };

  // Status badge component
  /**
  * Returns a styled span element based on the given status.
  * @example
  * renderStatusBadge({ status: 'active' })
  * <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
  * @param {Object} params - The parameters for the function.
  * @param {string} params.status - The status of the item which determines the styling of the badge.
  * @returns {JSX.Element} A span element with a class and text content based on status.
  * @description
  *   - The function capitalizes the first letter of the status when displaying it in the span.
  *   - Utilizes Tailwind CSS classes for styling the badge based on status.
  *   - Provides fallback styling of an empty string if status does not match predefined cases.
  */
  const StatusBadge: React.FC<{ status: Customer['status'] }> = ({ status }) => {
    let colorClass = '';
    
    switch (status) {
      case 'active':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'inactive':
        colorClass = 'bg-gray-100 text-gray-800';
        break;
      case 'lead':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // File icon component
  /**
  * Returns an icon component based on the document type provided.
  * @example
  * getFileIcon({ type: 'word' })
  * returns: <FileText className="text-blue-500" size={16} />
  * @param {Object} {type} - Specifies the type of document (e.g., 'word', 'excel', 'powerpoint', 'pdf').
  * @returns {JSX.Element} JSX element representing the icon with a color corresponding to the document type.
  * @description
  *   - Handles unknown document types by returning a default gray icon.
  *   - Utilizes the FileText and File components to visually represent document types.
  *   - Ensures consistent icon sizes across different document types.
  */
  const FileIcon = ({ type }) => {
    switch (type) {
      case 'word':
        return <FileText className="text-blue-500" size={16} />;
      case 'excel':
        return <FileText className="text-green-600" size={16} />;
      case 'powerpoint':
        return <FileText className="text-orange-500" size={16} />;
      case 'pdf':
        return <FileText className="text-red-500" size={16} />;
      default:
        return <File className="text-gray-500" size={16} />;
    }
  };

  // Customer Form component (used for both Add and Edit)
  const CustomerForm: React.FC<{
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  /**
   * Renders a form for adding or editing customer details.
   * @example
   * renderCustomerForm({ onSubmit: handleSubmit, isEdit: true })
   * // Returns JSX for updating customer details form when in edit mode.
   * @param {function} onSubmit - Function to handle form submission.
   * @param {boolean} isEdit - Determines if the form is in edit mode or add mode.
   * @returns {JSX.Element} A form element for customer data input.
   * @description
   *   - Fields include name, email, phone, company, status, last contact, and notes.
   *   - The form adapts its behavior based on edit or add mode indicated by `isEdit`.
   *   - The form integrates controlled components via `handleInputChange` for state management.
   *   - Uses Tailwind CSS for styling and layout configuration.
   */
  }> = ({ onSubmit, isEdit = false }) => {
    const customer = isEdit ? editingCustomer : newCustomer;
    
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={customer?.name || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={customer?.email || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={customer?.phone || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              name="company"
              value={customer?.company || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={customer?.status || 'lead'}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Contact</label>
            <input
              type="date"
              name="lastContact"
              value={customer?.lastContact || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={customer?.notes || ''}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            onClick={() => {
              isEdit ? setEditingCustomer(null) : setShowAddModal(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEdit ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} className="mr-1" />
          Add Customer
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-3 py-2 bg-gray-100 rounded-md flex items-center text-gray-700 hover:bg-gray-200">
              <Filter size={16} className="mr-1" />
              Filter
            </button>
          </div>
          <div className="text-gray-500 text-sm">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10"></th> {/* For expand/collapse */}
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const customerDocuments = getCustomerDocuments(customer.id);
                const isExpanded = expandedCustomers.includes(customer.id);
                
                return (
                  <React.Fragment key={customer.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="pl-4">
                        {customerDocuments.length > 0 && (
                          <button
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                            onClick={() => toggleCustomerExpanded(customer.id)}
                          >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{customer.name}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {customer.company}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                          {customer.email}
                        </a>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {customer.phone}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={customer.status} />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {formatDate(customer.lastContact)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            onClick={() => setEditingCustomer(customer)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            onClick={() => setActiveModule('documents')}
                            title="Add Document"
                          >
                            <FilePlus size={16} />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => handleDeleteCustomer(customer.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            className="p-1 text-gray-500 hover:bg-gray-50 rounded"
                            title="More options"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && customerDocuments.length > 0 && (
                      <tr className="bg-gray-50">
                        <td colSpan={8} className="py-2 px-8">
                          <div className="text-sm font-medium text-gray-600 mb-2">Documents</div>
                          <div className="space-y-1">
                            {customerDocuments.map(doc => (
                              <div key={doc.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-100 rounded">
                                <div className="flex items-center">
                                  <FileIcon type={doc.type} />
                                  <span className="ml-2">{doc.name}</span>
                                  <span className="ml-4 text-xs text-gray-500">
                                    Updated: {formatDate(doc.updatedAt)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    className="p-1 text-gray-500 hover:text-blue-600"
                                    title="Open"
                                    onClick={() => window.open(doc.webUrl, '_blank')}
                                  >
                                    <File size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddModal(false)}></div>
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
              <CustomerForm onSubmit={handleAddCustomer} />
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setEditingCustomer(null)}></div>
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
              <CustomerForm onSubmit={handleEditCustomer} isEdit={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerModule;