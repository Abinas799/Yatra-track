import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Mail, Phone, Users, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CompanionForm from './CompanionForm';

const CompanionsList = ({ yatraId, onClose }) => {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState(null);

  useEffect(() => {
    fetchCompanions();
  }, [yatraId]);

  const fetchCompanions = async () => {
    try {
      const response = await axios.get(`/api/yatra/${yatraId}/companions`);
      setCompanions(response.data.data.companions);
    } catch (error) {
      toast.error('Failed to fetch travel companions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (companionId) => {
    if (!window.confirm('Are you sure you want to remove this travel companion?')) {
      return;
    }

    try {
      await axios.delete(`/api/yatra/${yatraId}/companions/${companionId}`);
      toast.success('Travel companion removed successfully');
      fetchCompanions();
    } catch (error) {
      toast.error('Failed to remove travel companion');
    }
  };

  const handleEdit = (companion) => {
    setEditingCompanion(companion);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCompanion(null);
  };

  const handleFormSuccess = () => {
    fetchCompanions();
    handleFormClose();
  };

  const getRelationshipColor = (relationship) => {
    const colors = {
      family: 'bg-purple-100 text-purple-800',
      friend: 'bg-blue-100 text-blue-800',
      colleague: 'bg-green-100 text-green-800',
      partner: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[relationship] || colors.other;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 text-center">
            <div className="text-gray-600">Loading companions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Travel Companions</h2>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
              {companions.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add Companion Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Plus className="h-5 w-5" />
              Add Travel Companion
            </button>
          </div>

          {/* Companions List */}
          {companions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No travel companions yet</h3>
              <p className="text-gray-500 mb-6">Add friends, family, or colleagues to your trip</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                <Plus className="h-5 w-5" />
                Add Your First Companion
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {companions.map((companion) => (
                <div key={companion.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{companion.name}</h3>
                        {companion.relationship && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(companion.relationship)}`}>
                            {companion.relationship.charAt(0).toUpperCase() + companion.relationship.slice(1)}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {companion.email && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{companion.email}</span>
                          </div>
                        )}
                        {companion.phone && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">{companion.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(companion)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit companion"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(companion.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove companion"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Companion Form Modal */}
      {showForm && (
        <CompanionForm
          yatraId={yatraId}
          companion={editingCompanion}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default CompanionsList; 