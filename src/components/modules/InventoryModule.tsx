import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Edit, Trash2, Plus, Search, Filter, AlertCircle } from 'lucide-react';
import { Product } from '../../types';

/**
 * Inventory management interface for adding, updating, and deleting products
 * @example
 * InventoryModule()
 * Returns an interactive interface for managing products in inventory
 * @param {object} props - React component props.
 * @returns {JSX.Element} The inventory management component interface for use within React applications.
 * @description
 *   - Utilizes useAppContext to manage state related to products.
 *   - Filters products based on search input and category selection.
 *   - Handles form inputs with validation and allows tracking and updating of product details.
 *   - Displays an interactive UI for managing product inventory with options to add, edit, or delete products.
 */
const InventoryModule: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    sku: '',
    category: '',
    description: '',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    reorderLevel: 0
  });

  // Get all unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => 
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'all' || product.category === categoryFilter)
  );

  // Handle form input change
  /**
   * Handles change events for input fields, updating the product state.
   * @example
   * handleChangeEvent(event)
   * // Updates the state with the new input value.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e - The event object from the change event.
   * @returns {void} No return value.
   * @description
   *   - Parses input values as floats if the field is specified as numeric.
   *   - Updates either the editing or new product state with the new values.
   *   - Ensures appropriate handling for multiple input field types.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['costPrice', 'sellingPrice', 'stock', 'reorderLevel'];
    
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [name]: numericFields.includes(name) ? parseFloat(value) : value
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: numericFields.includes(name) ? parseFloat(value) : value
      });
    }
  };

  // Handle add new product
  /**
  * Handles form submission, adds a new product, and resets the form.
  * @example
  * handleSubmit(event);
  * // No return value
  * @param {React.FormEvent} e - The form submission event.
  * @returns {void} No return value.
  * @description
  *   - Calls `addProduct` to add the new product using the current form state.
  *   - Resets the product form to initial state with default values after submission.
  *   - Closes the add product modal by setting `setShowAddModal` to false.
  */
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setNewProduct({
      name: '',
      sku: '',
      category: '',
      description: '',
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
      reorderLevel: 0
    });
    setShowAddModal(false);
  };

  // Handle edit product
  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    }
  };

  // Handle delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Product Form component (used for both Add and Edit)
  const ProductForm: React.FC<{
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  /**
   * Renders a form for adding or editing a product in the inventory.
   * @example
   * ({ onSubmit, isEdit: true })
   * <form>...</form>
   * @param {Function} onSubmit - Function to handle the form submission.
   * @param {boolean} isEdit - Flag indicating whether the form is in edit mode.
   * @returns {JSX.Element} The form element for product management.
   * @description
   *   - The form adapts its button label to either "Add Product" or "Update Product" based on the `isEdit` flag.
   *   - Calculates Profit Margin dynamically based on cost price and selling price.
   *   - Provides input validation via HTML5 attributes such as `required` and `min`.
   *   - Uses Tailwind CSS classes for styling layout and responsiveness.
   */
  }> = ({ onSubmit, isEdit = false }) => {
    const product = isEdit ? editingProduct : newProduct;
    
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={product?.name || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              value={product?.sku || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={product?.category || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={product?.stock || 0}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Price</label>
            <input
              type="number"
              name="costPrice"
              value={product?.costPrice || 0}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              value={product?.sellingPrice || 0}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              value={product?.reorderLevel || 0}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Profit Margin</label>
            <div className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
              {product && product.costPrice > 0
                ? `${(((product.sellingPrice - product.costPrice) / product.costPrice) * 100).toFixed(2)}%`
                : '0.00%'}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={product?.description || ''}
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
              isEdit ? setEditingProduct(null) : setShowAddModal(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} className="mr-1" />
          Add Product
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
                placeholder="Search products..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {product.sku}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.stock <= product.reorderLevel && (
                        <AlertCircle size={16} className="text-red-500 mr-1" />
                      )}
                      <span className={product.stock <= product.reorderLevel ? 'text-red-600 font-medium' : 'text-gray-700'}>
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {formatCurrency(product.costPrice)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {formatCurrency(product.sellingPrice)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-green-600">
                      {product.costPrice > 0
                        ? `${(((product.sellingPrice - product.costPrice) / product.costPrice) * 100).toFixed(2)}%`
                        : '0.00%'}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        onClick={() => setEditingProduct(product)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddModal(false)}></div>
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Add New Product</h2>
              <ProductForm onSubmit={handleAddProduct} />
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setEditingProduct(null)}></div>
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Edit Product</h2>
              <ProductForm onSubmit={handleEditProduct} isEdit={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryModule;