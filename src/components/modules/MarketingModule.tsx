import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Edit, Trash2, Plus, Search, Filter, TrendingUp, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react';
import { Campaign } from '../../types';

const MarketingModule: React.FC = () => {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState<Omit<Campaign, 'id'>>({
    name: '',
    type: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: 0,
    spent: 0,
    status: 'planned',
    leads: 0,
    conversions: 0
  });

  // Campaign types
  const campaignTypes = ['Email', 'Social', 'PPC', 'Multi-channel', 'Event', 'Content', 'SEO', 'Other'];

  // Filter campaigns based on search term and status
  const filteredCampaigns = campaigns.filter(campaign => 
    (campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     campaign.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || campaign.status === statusFilter)
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate ROI
  const calculateROI = (campaign: Campaign) => {
    // Simple ROI calculation
    // In a real system, this would use actual revenue data
    const estimatedRevenue = campaign.conversions * 100; // Assuming £100 per conversion
    if (campaign.spent === 0) return 0;
    const roi = ((estimatedRevenue - campaign.spent) / campaign.spent) * 100;
    return roi.toFixed(2);
  };

  // Calculate conversion rate
  const calculateConversionRate = (campaign: Campaign) => {
    if (campaign.leads === 0) return '0.00';
    return ((campaign.conversions / campaign.leads) * 100).toFixed(2);
  };

  // Status badge component
  const StatusBadge: React.FC<{ status: Campaign['status'] }> = ({ status }) => {
    let colorClass = '';
    
    switch (status) {
      case 'planned':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'active':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'completed':
        colorClass = 'bg-gray-100 text-gray-800';
        break;
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['budget', 'spent', 'leads', 'conversions'];
    
    if (editingCampaign) {
      setEditingCampaign({
        ...editingCampaign,
        [name]: numericFields.includes(name) ? parseFloat(value) : value
      });
    } else {
      setNewCampaign({
        ...newCampaign,
        [name]: numericFields.includes(name) ? parseFloat(value) : value
      });
    }
  };

  // Handle add new campaign
  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign(newCampaign);
    setNewCampaign({
      name: '',
      type: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: 0,
      spent: 0,
      status: 'planned',
      leads: 0,
      conversions: 0
    });
    setShowAddModal(false);
  };

  // Handle edit campaign
  const handleEditCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampaign) {
      updateCampaign(editingCampaign.id, editingCampaign);
      setEditingCampaign(null);
    }
  };

  // Handle delete campaign
  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
    }
  };

  // Campaign Form component (used for both Add and Edit)
  const CampaignForm: React.FC<{
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  }> = ({ onSubmit, isEdit = false }) => {
    const campaign = isEdit ? editingCampaign : newCampaign;
    
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
            <input
              type="text"
              name="name"
              value={campaign?.name || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign Type</label>
            <select
              name="type"
              value={campaign?.type || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Type</option>
              {campaignTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={campaign?.startDate || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={campaign?.endDate || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <input
              type="number"
              name="budget"
              value={campaign?.budget || 0}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Spent</label>
            <input
              type="number"
              name="spent"
              value={campaign?.spent || 0}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={campaign?.status || 'planned'}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Leads Generated</label>
            <input
              type="number"
              name="leads"
              value={campaign?.leads || 0}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Conversions</label>
            <input
              type="number"
              name="conversions"
              value={campaign?.conversions || 0}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            onClick={() => {
              isEdit ? setEditingCampaign(null) : setShowAddModal(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEdit ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Marketing Campaigns</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} className="mr-1" />
          Add Campaign
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
                placeholder="Search campaigns..."
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
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget/Spent
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {campaign.type}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      <div>Start: {campaign.startDate}</div>
                      <div>End: {campaign.endDate}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      <div>Budget: {formatCurrency(campaign.budget)}</div>
                      <div className="flex items-center">
                        <span>Spent: {formatCurrency(campaign.spent)}</span>
                        {campaign.spent > campaign.budget && (
                          <AlertCircle size={16} className="ml-1 text-red-500" />
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${campaign.spent > campaign.budget ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${campaign.budget > 0 ? Math.min(100, (campaign.spent / campaign.budget) * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div>Leads: <span className="font-medium">{campaign.leads}</span></div>
                      <div>Conv: <span className="font-medium">{campaign.conversions}</span> ({calculateConversionRate(campaign)}%)</div>
                      <div>ROI: <span className={`font-medium ${parseFloat(calculateROI(campaign)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculateROI(campaign)}%
                      </span></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {campaign.status === 'planned' && (
                        <button
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          onClick={() => updateCampaign(campaign.id, { status: 'active' })}
                          title="Start Campaign"
                        >
                          <PlayCircle size={16} />
                        </button>
                      )}
                      {campaign.status === 'active' && (
                        <button
                          className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                          onClick={() => updateCampaign(campaign.id, { status: 'completed' })}
                          title="Complete Campaign"
                        >
                          <PauseCircle size={16} />
                        </button>
                      )}
                      <button
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        onClick={() => setEditingCampaign(campaign)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                    No campaigns found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddModal(false)}></div>
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
              <CampaignForm onSubmit={handleAddCampaign} />
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setEditingCampaign(null)}></div>
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Edit Campaign</h2>
              <CampaignForm onSubmit={handleEditCampaign} isEdit={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingModule;