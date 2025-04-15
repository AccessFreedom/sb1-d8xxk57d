import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Edit, Trash2, Plus, Search, Filter, FileText, ArrowDownCircle, CheckCircle, Eye, File, FilePlus, ChevronDown, ChevronRight } from 'lucide-react';
import { Invoice, InvoiceItem, Customer, Product, Document } from '../../types';

const InvoiceModule: React.FC = () => {
  const { invoices, customers, products, documents, addInvoice, updateInvoice, deleteInvoice } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [expandedInvoices, setExpandedInvoices] = useState<string[]>([]);
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id'>>({
    customerId: '',
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    status: 'draft',
    total: 0
  });
  const [currentItem, setCurrentItem] = useState<Partial<InvoiceItem>>({
    id: '',
    productId: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter(invoice => 
    (invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     invoice.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || invoice.status === statusFilter)
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
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

  // Calculate invoice total
  const calculateTotal = (items: InvoiceItem[]) => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  // Toggle invoice expanded state
  const toggleInvoiceExpanded = (invoiceId: string) => {
    setExpandedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  // Get documents related to an invoice
  const getInvoiceDocuments = (invoiceId: string) => {
    return documents.filter(doc => doc.relatedItemId === invoiceId && doc.relatedItemType === 'invoice');
  };

  // Status badge component
  /**
  * Returns a styled span element with a color class based on invoice status.
  * @example
  * renderInvoiceStatus({ status: 'paid' })
  * <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Paid</span>
  * @param {Object} statusObj - An object containing the status of the invoice.
  * @returns {JSX.Element} A span element styled according to the specified status.
  * @description
  *   - Applies different color classes for different invoice statuses ('paid', 'sent', 'draft', 'overdue').
  *   - Capitalizes the first letter of the status text for display.
  */
  const StatusBadge: React.FC<{ status: Invoice['status'] }> = ({ status }) => {
    let colorClass = '';
    
    switch (status) {
      case 'paid':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'sent':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'draft':
        colorClass = 'bg-gray-100 text-gray-800';
        break;
      case 'overdue':
        colorClass = 'bg-red-100 text-red-800';
        break;
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // File icon component
  /**
   * Returns an icon component corresponding to the file type.
   * @example
   * getFileIcon('word')
   * <FileText className="text-blue-500" size={16} />
   * @param {string} type - The file type to match for the icon display.
   * @returns {JSX.Element} A JSX Element representing the icon for the specified file type.
   * @description
   *   - Uses different color codes to visually differentiate between file types.
   *   - Returns a default file icon for unspecified file types with a gray color.
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

  // Handle form input change for invoice
  /**
   * Handles change events for inputs related to invoice creation or editing.
   * @example
   * handleInputChange(event)
   * Updates the invoice state with new values based on the event input.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event from the input element.
   * @returns {void} No return value, updates the invoice state directly.
   * @description
   *   - Updates either a new invoice or an existing one in editing mode.
   *   - Specifically updates customerId and customerName if the name is 'customerId'.
   *   - Handles both scenarios where an invoice is being edited or new invoice creation is in process.
   */
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerId') {
      const customer = customers.find(c => c.id === value);
      if (customer) {
        if (editingInvoice) {
          setEditingInvoice({
            ...editingInvoice,
            customerId: customer.id,
            customerName: customer.name
          });
        } else {
          setNewInvoice({
            ...newInvoice,
            customerId: customer.id,
            customerName: customer.name
          });
        }
      }
    } else {
      if (editingInvoice) {
        setEditingInvoice({
          ...editingInvoice,
          [name]: value
        });
      } else {
        setNewInvoice({
          ...newInvoice,
          [name]: value
        });
      }
    }
  };

  // Handle form input change for current item
  /**
   * Handles changes in input fields for invoice items and updates the current item state.
   * @example
   * handleChange(event)
   * Updates the current item based on the field changed and its value
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event triggered by user input in invoice item fields.
   * @returns {void} No return value, function modifies state.
   * @description
   *   - Updates product details such as product ID, description, unit price, and total when product ID is changed.
   *   - Computes quantities or unit prices to recalculate total prices based on user input in quantity or unit price fields.
   *   - Assumes default quantity as 1 if not defined during product ID change.
   *   - Handles generic updates for other input fields by directly assigning their values.
   */
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        const quantity = currentItem.quantity || 1;
        const unitPrice = product.sellingPrice;
        setCurrentItem({
          ...currentItem,
          productId: product.id,
          description: product.name,
          unitPrice,
          total: quantity * unitPrice
        });
      }
    } else if (name === 'quantity') {
      const quantity = parseInt(value) || 0;
      const unitPrice = currentItem.unitPrice || 0;
      setCurrentItem({
        ...currentItem,
        quantity,
        total: quantity * unitPrice
      });
    } else if (name === 'unitPrice') {
      const unitPrice = parseFloat(value) || 0;
      const quantity = currentItem.quantity || 0;
      setCurrentItem({
        ...currentItem,
        unitPrice,
        total: quantity * unitPrice
      });
    } else {
      setCurrentItem({
        ...currentItem,
        [name]: value
      });
    }
  };

  // Add current item to invoice
  /**
   * Adds a new item to either the editing or a new invoice and updates totals
   * @example
   * addItemToInvoice(currentItem)
   * // Updates invoice with new item and recalculates total
   * @param {object} currentItem - The current item object including productId, quantity, unitPrice, etc.
   * @returns {void} Does not return any value.
   * @description
   *   - Generates a unique ID for each new item using a random string.
   *   - Appends the new item to either an existing invoice or a new one.
   *   - Resets the current item to its initial state after adding.
   *   - Calculates the total cost of items in the invoice after adding the new item.
   */
  const addItemToInvoice = () => {
    if (currentItem.productId && currentItem.quantity && currentItem.unitPrice) {
      const newItem: InvoiceItem = {
        id: Math.random().toString(36).substring(2, 10),
        productId: currentItem.productId as string,
        description: currentItem.description as string,
        quantity: currentItem.quantity as number,
        unitPrice: currentItem.unitPrice as number,
        total: currentItem.total as number
      };
      
      if (editingInvoice) {
        const updatedItems = [...editingInvoice.items, newItem];
        setEditingInvoice({
          ...editingInvoice,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        });
      } else {
        const updatedItems = [...newInvoice.items, newItem];
        setNewInvoice({
          ...newInvoice,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        });
      }
      
      // Reset current item
      setCurrentItem({
        id: '',
        productId: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      });
    }
  };

  // Remove item from invoice
  /**
  * Removes an item from an invoice and updates the invoice state.
  * @example
  * removeItemFromInvoice('12345')
  * // Updates the state by removing the item with '12345' from the current invoice
  * @param {string} itemId - The ID of the item to be removed from the invoice.
  * @returns {void} No return value; updates the invoice state directly.
  * @description
  *   - Differentiates between editing an existing invoice and creating a new one by checking `editingInvoice`.
  *   - Recalculates the total invoice amount after removing the specified item.
  */
  const removeItemFromInvoice = (itemId: string) => {
    if (editingInvoice) {
      const updatedItems = editingInvoice.items.filter(item => item.id !== itemId);
      setEditingInvoice({
        ...editingInvoice,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      });
    } else {
      const updatedItems = newInvoice.items.filter(item => item.id !== itemId);
      setNewInvoice({
        ...newInvoice,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      });
    }
  };

  // Handle add new invoice
  /**
   * Handles the form submission for adding a new invoice.
   * @example
   * handleSubmit(event)
   * // Prevents default form submission, validates, adds invoice, and resets form.
   * @param {React.FormEvent} e - The form submission event.
   * @returns {void} No return value.
   * @description
   *   - Prevents default form submission behavior.
   *   - Validates that a customer ID and item(s) are provided before processing.
   *   - Resets the invoice form upon successful submission.
   *   - Closes the add invoice modal after submission.
   */
  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInvoice.customerId && newInvoice.items.length > 0) {
      addInvoice(newInvoice);
      setNewInvoice({
        customerId: '',
        customerName: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [],
        status: 'draft',
        total: 0
      });
      setShowAddModal(false);
    }
  };

  // Handle edit invoice
  const handleEditInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvoice && editingInvoice.customerId && editingInvoice.items.length > 0) {
      updateInvoice(editingInvoice.id, editingInvoice);
      setEditingInvoice(null);
    }
  };

  // Handle delete invoice
  const handleDeleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
    }
  };

  // Invoice Form component (used for both Add and Edit)
  const InvoiceForm: React.FC<{
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  /**
   * Renders a form for creating or editing an invoice.
   * @example
   * renderInvoiceForm({ onSubmit: handleSubmit, isEdit: true })
   * Returns a form element for editing an existing invoice.
   * @param {Object} params - The parameters for rendering the form.
   * @param {Function} params.onSubmit - Callback function triggered on form submission.
   * @param {boolean} [params.isEdit=false] - Determines whether the form is for editing an existing invoice or creating a new one.
   * @returns {JSX.Element} A form element for invoice creation or editing.
   * @description
   *   - The form handles customer selection and status updates.
   *   - Includes date and due date input fields with default validation.
   *   - Supports adding multiple items with product and quantity selection.
   *   - Displays total invoice amount dynamically based on added items.
   */
  }> = ({ onSubmit, isEdit = false }) => {
    const invoice = isEdit ? editingInvoice : newInvoice;
    
    return (
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              name="customerId"
              value={invoice?.customerId || ''}
              onChange={handleInvoiceChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={invoice?.status || 'draft'}
              onChange={handleInvoiceChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={invoice?.date || ''}
              onChange={handleInvoiceChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={invoice?.dueDate || ''}
              onChange={handleInvoiceChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">Items</h3>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                name="productId"
                value={currentItem.productId || ''}
                onChange={handleItemChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.sellingPrice)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={currentItem.quantity || ''}
                onChange={handleItemChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="button"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={addItemToInvoice}
                disabled={!currentItem.productId || !currentItem.quantity}
              >
                Add Item
              </button>
            </div>
          </div>
          
          {invoice && invoice.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-3 py-2 whitespace-nowrap">{item.description}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{item.quantity}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(item.total)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => removeItemFromInvoice(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No items added yet
            </div>
          )}
          
          {invoice && invoice.items.length > 0 && (
            <div className="mt-4 text-right">
              <p className="text-lg font-bold">
                Total: {formatCurrency(invoice.total)}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            onClick={() => {
              isEdit ? setEditingInvoice(null) : setShowAddModal(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!invoice?.customerId || invoice.items.length === 0}
          >
            {isEdit ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoice Management</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} className="mr-1" />
          Create Invoice
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
                placeholder="Search invoices..."
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
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10"></th> {/* For expand/collapse */}
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
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
              {filteredInvoices.map((invoice) => {
                const invoiceDocuments = getInvoiceDocuments(invoice.id);
                const isExpanded = expandedInvoices.includes(invoice.id);
                
                return (
                  <React.Fragment key={invoice.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="pl-4">
                        <button
                          className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                          onClick={() => toggleInvoiceExpanded(invoice.id)}
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-blue-600">{invoice.id}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {invoice.customerName}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700 font-medium">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            onClick={() => setShowViewModal(invoice)}
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            onClick={() => setEditingInvoice(invoice)}
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
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            onClick={() => {
                              updateInvoice(invoice.id, { status: 'paid' });
                            }}
                            title="Mark Paid"
                            disabled={invoice.status === 'paid'}
                          >
                            <CheckCircle size={16} className={invoice.status === 'paid' ? 'opacity-50' : ''} />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={8} className="py-2 px-8">
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-600 mb-2">Invoice Items</div>
                            <table className="min-w-full divide-y divide-gray-200 border rounded-md">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unit Price</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {invoice.items.map(item => (
                                  <tr key={item.id}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.description}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">{formatCurrency(item.unitPrice)}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{formatCurrency(item.total)}</td>
                                  </tr>
                                ))}
                                <tr className="bg-gray-50">
                                  <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium">Total:</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-bold">{formatCurrency(invoice.total)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          
                          {invoiceDocuments.length > 0 && (
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-2">Documents</div>
                              <div className="space-y-1">
                                {invoiceDocuments.map(doc => (
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
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddModal(false)}></div>
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Create New Invoice</h2>
              <InvoiceForm onSubmit={handleAddInvoice} />
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setEditingInvoice(null)}></div>
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Edit Invoice</h2>
              <InvoiceForm onSubmit={handleEditInvoice} isEdit={true} />
            </div>
          </div>
        </div>
      )}
      
      {/* View Invoice Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowViewModal(null)}></div>
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Invoice Details</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowViewModal(null)}
                >
                  &times;
                </button>
              </div>
              
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Invoice #{showViewModal.id}</h3>
                    <p className="text-gray-600">Created: {formatDate(showViewModal.date)}</p>
                    <p className="text-gray-600">Due: {formatDate(showViewModal.dueDate)}</p>
                    <div className="mt-1">
                      <StatusBadge status={showViewModal.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold">Bill To:</h4>
                    <p>{showViewModal.customerName}</p>
                    {/* Customer details would go here */}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-bold mb-2">Items</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {showViewModal.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-3 py-2">{item.description}</td>
                        <td className="px-3 py-2">{item.quantity}</td>
                        <td className="px-3 py-2">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right font-bold">Total:</td>
                      <td className="px-3 py-2 text-right font-bold">{formatCurrency(showViewModal.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="flex justify-end mt-4 gap-3">
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                  onClick={() => setShowViewModal(null)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <ArrowDownCircle size={18} className="mr-1" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceModule;