import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Edit, Trash2, Plus, Search, Filter, Clock, Check, AlertTriangle } from 'lucide-react';
import { ProductionOrder, Product, Material } from '../../types';

const ProductionModule: React.FC = () => {
  const { 
    productionOrders, 
    products, 
    materials,
    addProductionOrder, 
    updateProductionOrder, 
    deleteProductionOrder 
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [newOrder, setNewOrder] = useState<Omit<ProductionOrder, 'id'>>({
    productId: '',
    productName: '',
    quantity: 0,
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'planned',
    materials: []
  });
  const [currentMaterial, setCurrentMaterial] = useState<{
    materialId: string;
    materialName: string;
    quantityRequired: number;
  }>({
    materialId: '',
    materialName: '',
    quantityRequired: 1
  });

  // Filter orders based on search term and status
  const filteredOrders = productionOrders.filter(order => 
    (order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  );

  // Status badge component
  const StatusBadge: React.FC<{ status: ProductionOrder['status'] }> = ({ status }) => {
    let colorClass = '';
    let icon = null;
    
    switch (status) {
      case 'planned':
        colorClass = 'bg-blue-100 text-blue-800';
        icon = <Clock size={14} className="mr-1" />;
        break;
      case 'in_progress':
        colorClass = 'bg-yellow-100 text-yellow-800';
        icon = <AlertTriangle size={14} className="mr-1" />;
        break;
      case 'completed':
        colorClass = 'bg-green-100 text-green-800';
        icon = <Check size={14} className="mr-1" />;
        break;
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${colorClass}`}>
        {icon}
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  // Handle form input change for production order
  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        if (editingOrder) {
          setEditingOrder({
            ...editingOrder,
            productId: product.id,
            productName: product.name
          });
        } else {
          setNewOrder({
            ...newOrder,
            productId: product.id,
            productName: product.name
          });
        }
      }
    } else if (name === 'quantity') {
      const quantity = parseInt(value) || 0;
      if (editingOrder) {
        setEditingOrder({
          ...editingOrder,
          quantity
        });
      } else {
        setNewOrder({
          ...newOrder,
          quantity
        });
      }
    } else {
      if (editingOrder) {
        setEditingOrder({
          ...editingOrder,
          [name]: value
        });
      } else {
        setNewOrder({
          ...newOrder,
          [name]: value
        });
      }
    }
  };

  // Handle form input change for current material
  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'materialId') {
      const material = materials.find(m => m.id === value);
      if (material) {
        setCurrentMaterial({
          ...currentMaterial,
          materialId: material.id,
          materialName: material.name
        });
      }
    } else if (name === 'quantityRequired') {
      setCurrentMaterial({
        ...currentMaterial,
        quantityRequired: parseInt(value) || 0
      });
    }
  };

  // Add material to production order
  const addMaterialToOrder = () => {
    if (currentMaterial.materialId && currentMaterial.quantityRequired > 0) {
      const newMaterial = {
        materialId: currentMaterial.materialId,
        materialName: currentMaterial.materialName,
        quantityRequired: currentMaterial.quantityRequired
      };
      
      if (editingOrder) {
        setEditingOrder({
          ...editingOrder,
          materials: [...editingOrder.materials, newMaterial]
        });
      } else {
        setNewOrder({
          ...newOrder,
          materials: [...newOrder.materials, newMaterial]
        });
      }
      
      // Reset current material
      setCurrentMaterial({
        materialId: '',
        materialName: '',
        quantityRequired: 1
      });
    }
  };

  // Remove material from production order
  const removeMaterialFromOrder = (materialId: string) => {
    if (editingOrder) {
      setEditingOrder({
        ...editingOrder,
        materials: editingOrder.materials.filter(m => m.materialId !== materialId)
      });
    } else {
      setNewOrder({
        ...newOrder,
        materials: newOrder.materials.filter(m => m.materialId !== materialId)
      });
    }
  };

  // Handle add new production order
  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrder.productId && newOrder.quantity > 0) {
      addProductionOrder(newOrder);
      setNewOrder({
        productId: '',
        productName: '',
        quantity: 0,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'planned',
        materials: []
      });
      setShowAddModal(false);
    }
  };

  // Handle edit production order
  const handleEditOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder && editingOrder.productId && editingOrder.quantity > 0) {
      updateProductionOrder(editingOrder.id, editingOrder);
      setEditingOrder(null);
    }
  };

  // Handle delete production order
  const handleDeleteOrder = (id: string) => {
    if (confirm('Are you sure you want to delete this production order?')) {
      deleteProductionOrder(id);
    }
  };

  // Check if material is in stock
  const isMaterialInStock = (materialId: string, quantityRequired: number) => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.stock >= quantityRequired : false;
  };

  // Production Order Form component (used for both Add and Edit)
  const OrderForm: React.FC<{
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  }> = ({ onSubmit, isEdit = false }) => {
    const order = isEdit ? editingOrder : newOrder;
    
    return (
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              name="productId"
              value={order?.productId || ''}
              onChange={handleOrderChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={order?.quantity || 0}
              onChange={handleOrderChange}
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={order?.startDate || ''}
              onChange={handleOrderChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={order?.dueDate || ''}
              onChange={handleOrderChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={order?.status || 'planned'}
            onChange={handleOrderChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">Required Materials</h3>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Material</label>
              <select
                name="materialId"
                value={currentMaterial.materialId || ''}
                onChange={handleMaterialChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Material</option>
                {materials.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.name} (In Stock: {material.stock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity Required</label>
              <input
                type="number"
                name="quantityRequired"
                value={currentMaterial.quantityRequired || ''}
                onChange={handleMaterialChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="button"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={addMaterialToOrder}
                disabled={!currentMaterial.materialId || currentMaterial.quantityRequired <= 0}
              >
                Add Material
              </button>
            </div>
          </div>
          
          {order && order.materials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.materials.map(material => (
                    <tr key={material.materialId}>
                      <td className="px-3 py-2 whitespace-nowrap">{material.materialName}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{material.quantityRequired}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {isMaterialInStock(material.materialId, material.quantityRequired) ? (
                          <span className="text-green-600">In Stock</span>
                        ) : (
                          <span className="text-red-600">Insufficient Stock</span>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => removeMaterialFromOrder(material.materialId)}
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
              No materials added yet
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            onClick={() => {
              isEdit ? setEditingOrder(null) : setShowAddModal(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!order?.productId || order.quantity <= 0}
          >
            {isEdit ? 'Update Order' : 'Create Order'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Production Management</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} className="mr-1" />
          Create Production Order
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
                placeholder="Search orders..."
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
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Showing {filteredOrders.length} of {productionOrders.length} orders
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Materials
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-blue-600">{order.id}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {order.productName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {order.quantity}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {order.startDate}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {order.dueDate}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {order.materials.length} materials
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        onClick={() => setEditingOrder(order)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                    No production orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Production Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddModal(false)}></div>
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Create Production Order</h2>
              <OrderForm onSubmit={handleAddOrder} />
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Production Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setEditingOrder(null)}></div>
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Edit Production Order</h2>
              <OrderForm onSubmit={handleEditOrder} isEdit={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionModule;