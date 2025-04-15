import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Edit, Trash2, Plus, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Expense } from '../../types';

/**
 * Manages expenses by providing functionalities for adding, editing, deleting, and filtering expense records.
 * @example
 * ExpenseModule()
 * Renders the expense management interface with add, edit, and filter functionalities.
 * @param {object} useAppContext - Provides context for the application including expenses and methods to manage them.
 * @returns {JSX.Element} Renders an expense management interface.
 * @description
 *   - Utilizes React hooks for state management, including useState and useAppContext.
 *   - Allows filtering of expenses based on vendor, description, status, and category.
 *   - Provides modals for adding and editing expenses.
 *   - Formats currency display according to GBP standards.
 */
const ExpenseModule: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    category: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    description: '',
    status: 'pending'
  });

  // Get all unique categories
  const categories = ['all', ...Array.from(new Set(expenses.map(e => e.category)))];

  // Filter expenses based on search term, status, and category
  const filteredExpenses = expenses.filter(expense => 
    (expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
     expense.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || expense.status === statusFilter) &&
    (categoryFilter === 'all' || expense.category === categoryFilter)
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Status badge component
  /**
  * Returns a styled React component for displaying the status with corresponding color and icon.
  * @example
  * statusDisplay({ status: 'pending' })
  * // Returns a span element with yellow color class and clock icon
  * @param {Object} statusObject - An object containing the status to be displayed.
  * @returns {JSX.Element} A styled span element representing the status.
  * @description
  *   - The function uses the status to determine which color class and icon to apply.
  *   - It capitalizes the first letter of the status string for display.
  *   - The component uses Tailwind CSS classes for styling.
  */
  const StatusBadge: React.FC<{ status: Expense['status'] }> = ({ status }) => {
    let colorClass = '';
    let icon = null;
    
    switch (status) {
      case 'pending':
        colorClass = 'bg-yellow-100 text-yellow-800';
        icon = <Clock size={14} className="mr-1" />;
        break;
      case 'approved':
        colorClass = 'bg-blue-100 text-blue-800';
        icon = <CheckCircle size={14} className="mr-1" />;
        break;
      case 'paid':
        colorClass = 'bg-green-100 text-green-800';
        icon = <CheckCircle size={14} className="mr-1" />;
        break;
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${colorClass}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle form input change
  /**
  * Handles the change event for input elements and updates the respective expense data.
  * @example
  * handleExpenseChange(event)
  * Updates amount or other fields in newExpense or editingExpense state.
  * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e - The event object containing the name and value of the input element.
  * @returns {void} No return value.
  * @description
  *   - Parses the 'amount' input to a float and defaults to 0 if NaN.
  *   - Updates state for either new or editing expense based on current context.
  *   - Ensures the correct property ('amount' or other named property) is updated in the expense object.
  *   - Handles different input elements (input, select, textarea) interchangeably.
  */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const amount = parseFloat(value) || 0;
      if (editingExpense) {
        setEditingExpense({
          ...editingExpense,
          amount
        });
      } else {
        setNewExpense({
          ...newExpense,
          amount
        });
      }
    } else {
      if (editingExpense) {
        setEditingExpense({
          ...editingExpense,
          [name]: value
        });
      } else {
        setNewExpense({
          ...newExpense,
          [name]: value
        });
      }
    }
  };

  // Handle add new expense
  /**
  * Handles form submission for adding a new expense entry
  * @example
  * handleSubmit(event)
  * // Prevents default form submission, adds new expense, resets the form, and closes the modal
  * @param {React.FormEvent} e - The form submission event.
  * @returns {void} Does not return a value, performs UI updates and state changes.
  * @description
  *   - Resets the new expense data to initial default values.
  *   - Closes the "Add Expense" modal upon completion.
  */
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense(newExpense);
    setNewExpense({
      category: '',
      vendor: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      description: '',
      status: 'pending'
    });
    setShowAddModal(false);
  };

  // Handle edit expense
  const handleEditExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense(editingExpense.id, editingExpense);
      setEditingExpense(null);
    }
  };

  // Handle delete expense
  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  // Expense Form component (used for both Add and Edit)
  const ExpenseForm: React.FC<{
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  /**
   * Renders an expense form for adding or editing expense details.
   * @example
   * renderExpenseForm({ onSubmit, isEdit: true })
   * <form>...</form>
   * @param {function} onSubmit - Function to handle form submission.
   * @param {boolean} isEdit - Indicator for edit mode, determines if the form is for editing or adding a new expense. Defaults to false.
   * @returns {JSX.Element} A form element containing fields for expense details including category, vendor, date, amount, description, and status.
   * @description
   *   - Adjusts input values dynamically based on whether the form is in edit mode.
   *   - Provides default values for form fields if not specified.
   *   - Offers cancel functionality with dynamic behavior for edit and add modes.
   *   - Submits the form data using the specified onSubmit handler.
   */
  }> = ({ onSubmit, isEdit = false }) => {
    const expense = isEdit ? editingExpense : newExpense;
    
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={expense?.category || ''}
              onChange={handleInputChange}
              placeholder="e.g., Office Supplies, Travel, Utilities"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor</label>
            <input
              type="text"
              name="vendor"
              value={expense?.vendor || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={expense?.date || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={expense?.amount || 0}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={expense?.description || ''}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={expense?.status || 'pending'}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            onClick={() => {
              isEdit ? setEditingExpense(null) : setShowAddModal(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEdit ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} className="mr-1" />
          Add Expense
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search expenses..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="py-2 px-3 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <select
                className="py-2 px-3 border border-gray-300 rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {expense.date}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {expense.vendor}
                  </td>
                  <td className="py-3 px-4 text-gray-700 max-w-xs truncate">
                    {expense.description}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={expense.status} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {expense.status === 'pending' && (
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => updateExpense(expense.id, { status: 'approved' })}
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {expense.status === 'approved' && (
                        <button
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          onClick={() => updateExpense(expense.id, { status: 'paid' })}
                          title="Mark Paid"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        onClick={() => setEditingExpense(expense)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        onClick={() => handleDeleteExpense(expense.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddModal(false)}></div>
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
              <ExpenseForm onSubmit={handleAddExpense} />
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setEditingExpense(null)}></div>
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
              <ExpenseForm onSubmit={handleEditExpense} isEdit={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseModule;