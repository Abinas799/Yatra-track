import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Calendar, MapPin, Edit, Trash2, LogOut, User, DollarSign, Tag, Filter, Users } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import YatraForm from './YatraForm';
import CompanionsList from './CompanionsList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [yatras, setYatras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingYatra, setEditingYatra] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCompanions, setShowCompanions] = useState(false);
  const [selectedYatraId, setSelectedYatraId] = useState(null);

  useEffect(() => {
    fetchYatras();
  }, []);

  const fetchYatras = async () => {
    try {
      const response = await axios.get('/api/yatra');
      setYatras(response.data.data.yatras);
    } catch (error) {
      toast.error('Failed to fetch yatras');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this yatra?')) {
      return;
    }

    try {
      await axios.delete(`/api/yatra/${id}`);
      toast.success('Yatra deleted successfully');
      fetchYatras();
    } catch (error) {
      toast.error('Failed to delete yatra');
    }
  };

  const handleEdit = (yatra) => {
    setEditingYatra(yatra);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingYatra(null);
  };

  const handleFormSuccess = () => {
    fetchYatras();
    handleFormClose();
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleCompanions = (yatraId) => {
    setSelectedYatraId(yatraId);
    setShowCompanions(true);
  };

  const handleCompanionsClose = () => {
    setShowCompanions(false);
    setSelectedYatraId(null);
  };

  // Filter yatras based on selected filters
  const filteredYatras = yatras.filter(yatra => {
    const categoryMatch = filterCategory === 'all' || yatra.category === filterCategory;
    const statusMatch = filterStatus === 'all' || yatra.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  // Calculate statistics
  const totalBudget = yatras.reduce((sum, yatra) => sum + (parseFloat(yatra.budget) || 0), 0);
  const upcomingYatras = yatras.filter(y => new Date(y.date) > new Date());
  const completedYatras = yatras.filter(y => y.status === 'completed');
  const inProgressYatras = yatras.filter(y => y.status === 'in_progress');

  // Get unique categories for filter
  const categories = [...new Set(yatras.map(y => y.category))];

  const getCategoryColor = (category) => {
    const colors = {
      business: 'bg-blue-100 text-blue-800',
      leisure: 'bg-green-100 text-green-800',
      adventure: 'bg-orange-100 text-orange-800',
      family: 'bg-purple-100 text-purple-800',
      romantic: 'bg-pink-100 text-pink-800',
      educational: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.planned;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">YatraTrack</h1>
              <div className="flex items-center space-x-2 text-white/80">
                <User className="h-5 w-5" />
                <span>Welcome, {user?.name}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card bg-white/10 backdrop-blur-md border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{yatras.length}</h3>
              <p className="text-white/80">Total Yatras</p>
            </div>
          </div>
          <div className="card bg-white/10 backdrop-blur-md border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{upcomingYatras.length}</h3>
              <p className="text-white/80">Upcoming</p>
            </div>
          </div>
          <div className="card bg-white/10 backdrop-blur-md border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{completedYatras.length}</h3>
              <p className="text-white/80">Completed</p>
            </div>
          </div>
          <div className="card bg-white/10 backdrop-blur-md border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{inProgressYatras.length}</h3>
              <p className="text-white/80">In Progress</p>
            </div>
          </div>
          <div className="card bg-white/10 backdrop-blur-md border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">${totalBudget.toFixed(2)}</h3>
              <p className="text-white/80">Total Budget</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-white" />
            <h3 className="text-white font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-input bg-white/20 border-white/30 text-white placeholder-white/50"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input bg-white/20 border-white/30 text-white placeholder-white/50"
              >
                <option value="all">All Status</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Yatra Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus className="h-5 w-5" />
            Add New Yatra
          </button>
        </div>

        {/* Yatras List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredYatras.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-white/60 text-lg mb-4">
                {yatras.length === 0 ? 'No yatras found. Start by creating your first journey!' : 'No yatras match your filters.'}
              </div>
              {yatras.length === 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Yatra
                </button>
              )}
            </div>
          ) : (
            filteredYatras.map((yatra) => (
              <div key={yatra.id} className="card bg-white/95 backdrop-blur-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{yatra.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(yatra.category)}`}>
                        {yatra.category.charAt(0).toUpperCase() + yatra.category.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(yatra.status)}`}>
                        {yatra.status.replace('_', ' ').charAt(0).toUpperCase() + yatra.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCompanions(yatra.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Manage companions"
                    >
                      <Users className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(yatra)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(yatra.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {yatra.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {yatra.description}
                  </p>
                )}

                <div className="space-y-2">
                  {yatra.destination && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{yatra.destination}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {format(new Date(yatra.date), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  {yatra.budget && parseFloat(yatra.budget) > 0 && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">${parseFloat(yatra.budget).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-gray-500">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Created by {yatra.user_name}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Yatra Form Modal */}
      {showForm && (
        <YatraForm
          yatra={editingYatra}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Companions List Modal */}
      {showCompanions && selectedYatraId && (
        <CompanionsList
          yatraId={selectedYatraId}
          onClose={handleCompanionsClose}
        />
      )}
    </div>
  );
};

export default Dashboard; 