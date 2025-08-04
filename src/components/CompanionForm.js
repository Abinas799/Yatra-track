import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Users } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CompanionForm = ({ yatraId, companion, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const isEditing = !!companion;

  const relationships = [
    { value: 'family', label: 'Family' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'partner', label: 'Partner' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (companion) {
      setFormData({
        name: companion.name || '',
        email: companion.email || '',
        relationship: companion.relationship || '',
        phone: companion.phone || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        relationship: '',
        phone: ''
      });
    }
  }, [companion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    
    if (formData.name.length < 2) {
      toast.error('Name must be at least 2 characters long');
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`/api/yatra/${yatraId}/companions/${companion.id}`, formData);
        toast.success('Travel companion updated successfully');
      } else {
        await axios.post(`/api/yatra/${yatraId}/companions`, formData);
        toast.success('Travel companion added successfully');
      }
      
      onSuccess();
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Travel Companion' : 'Add Travel Companion'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name *
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-input pr-12"
                placeholder="Enter companion name"
                value={formData.name}
                onChange={handleChange}
                maxLength={255}
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="relationship" className="form-label">
              Relationship
            </label>
            <div className="relative">
              <select
                id="relationship"
                name="relationship"
                className="form-input pr-12"
                value={formData.relationship}
                onChange={handleChange}
              >
                <option value="">Select relationship</option>
                {relationships.map(rel => (
                  <option key={rel.value} value={rel.value}>
                    {rel.label}
                  </option>
                ))}
              </select>
              <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                className="form-input pr-12"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                maxLength={255}
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-input pr-12"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={20}
              />
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {isEditing ? 'Update' : 'Add'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanionForm; 