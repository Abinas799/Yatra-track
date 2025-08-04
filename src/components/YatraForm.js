import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, DollarSign, Tag } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const YatraForm = ({ yatra, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'leisure',
    destination: '',
    date: '',
    budget: '',
    status: 'planned'
  });
  const [loading, setLoading] = useState(false);
  const isEditing = !!yatra;

  const categories = [
    { value: 'leisure', label: 'Leisure' },
    { value: 'business', label: 'Business' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'family', label: 'Family' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'educational', label: 'Educational' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (yatra) {
      setFormData({
        title: yatra.title,
        description: yatra.description || '',
        category: yatra.category || 'leisure',
        destination: yatra.destination || '',
        date: yatra.date,
        budget: yatra.budget || '',
        status: yatra.status || 'planned'
      });
    } else {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: '',
        description: '',
        category: 'leisure',
        destination: '',
        date: tomorrow.toISOString().split('T')[0],
        budget: '',
        status: 'planned'
      });
    }
  }, [yatra]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    
    if (formData.title.length < 3) {
      toast.error('Title must be at least 3 characters long');
      return false;
    }
    
    if (!formData.date) {
      toast.error('Date is required');
      return false;
    }
    
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Date cannot be in the past');
      return false;
    }

    if (formData.budget && parseFloat(formData.budget) < 0) {
      toast.error('Budget cannot be negative');
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
      const submitData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0
      };

      if (isEditing) {
        await axios.put(`/api/yatra/${yatra.id}`, submitData);
        toast.success('Yatra updated successfully');
      } else {
        await axios.post('/api/yatra', submitData);
        toast.success('Yatra created successfully');
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
            {isEditing ? 'Edit Yatra' : 'Create New Yatra'}
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
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="form-input"
              placeholder="Enter yatra title"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                className="form-input pr-12"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="destination" className="form-label">
              Destination
            </label>
            <div className="relative">
              <input
                id="destination"
                name="destination"
                type="text"
                className="form-input pr-12"
                placeholder="Enter destination"
                value={formData.destination}
                onChange={handleChange}
                maxLength={255}
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input form-textarea"
              placeholder="Enter yatra description (optional)"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              rows={4}
            />
            <p className="text-sm text-muted mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date *
              </label>
              <div className="relative">
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className="form-input pr-12"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="budget" className="form-label">
                Budget
              </label>
              <div className="relative">
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input pr-12"
                  placeholder="0.00"
                  value={formData.budget}
                  onChange={handleChange}
                />
                <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="form-input"
              value={formData.status}
              onChange={handleChange}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
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
                  {isEditing ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YatraForm; 