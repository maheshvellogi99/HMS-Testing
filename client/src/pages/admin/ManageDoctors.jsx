import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, ArrowLeft, Search, Edit, Trash2, UserCheck } from 'lucide-react';
import api from '../../services/api';

const ManageDoctors = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSpecialization = searchParams.get('specialization') || '';
  const [doctors, setDoctors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(urlSpecialization || '');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialization: urlSpecialization || '',
    qualification: '',
    experience: '',
    consultationFee: '',
    availableFrom: '',
    availableTo: '',
    languages: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  // If URL specialization changes (e.g., navigating from another department), update filters and form
  useEffect(() => {
    if (urlSpecialization) {
      setSearchTerm(urlSpecialization);
      setFormData((prev) => ({ ...prev, specialization: urlSpecialization }));
    }
  }, [urlSpecialization]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    
    // Auto-format time inputs
    if (e.target.name === 'availableFrom' || e.target.name === 'availableTo') {
      // Remove any non-digit characters except colon
      value = value.replace(/[^\d:]/g, '');
      
      // Auto-add colon after 2 digits if not present
      if (value.length === 2 && !value.includes(':')) {
        value = value + ':';
      }
      
      // Limit to HH:MM format
      if (value.length > 5) {
        value = value.slice(0, 5);
      }
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate time fields if provided
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (formData.availableFrom && !timeRegex.test(formData.availableFrom)) {
      alert('Invalid "Available From" time. Please use format HH:MM (e.g., 09:00)');
      setLoading(false);
      return;
    }
    
    if (formData.availableTo && !timeRegex.test(formData.availableTo)) {
      alert('Invalid "Available To" time. Please use format HH:MM (e.g., 17:00)');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        ...formData,
        role: 'doctor',
      });
      
      alert('Doctor added successfully!');
      setShowAddForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        // Keep specialization tied to the selected department if any
        specialization: urlSpecialization || '',
        qualification: '',
        experience: '',
        consultationFee: '',
        availableFrom: '',
        availableTo: '',
        languages: '',
      });
      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      password: '', // Don't pre-fill password
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      experience: doctor.experience || '',
      consultationFee: doctor.consultationFee || '',
      availableFrom: doctor.availableFrom || '',
      availableTo: doctor.availableTo || '',
      languages: doctor.languages || '',
    });
    setShowEditForm(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate time fields if provided
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (formData.availableFrom && !timeRegex.test(formData.availableFrom)) {
      alert('Invalid "Available From" time. Please use format HH:MM (e.g., 09:00)');
      setLoading(false);
      return;
    }
    
    if (formData.availableTo && !timeRegex.test(formData.availableTo)) {
      alert('Invalid "Available To" time. Please use format HH:MM (e.g., 17:00)');
      setLoading(false);
      return;
    }

    try {
      // Prepare update data (exclude password if empty)
      const updateData = {
        specialization: formData.specialization,
        qualification: formData.qualification,
        experience: formData.experience,
        consultationFee: formData.consultationFee,
        availableFrom: formData.availableFrom,
        availableTo: formData.availableTo,
        languages: formData.languages,
        phone: formData.phone,
      };

      await api.put(`/doctors/${editingDoctor._id}`, updateData);
      
      alert('Doctor updated successfully!');
      setShowEditForm(false);
      setEditingDoctor(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        specialization: '',
        qualification: '',
        experience: '',
        consultationFee: '',
        availableFrom: '',
        availableTo: '',
        languages: '',
      });
      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/doctors/${doctorId}`);
      alert('Doctor deleted successfully!');
      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete doctor');
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New Doctor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Doctors List */}
        <div className="space-y-4">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <UserCheck className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-gray-600">{doctor.specialization || 'General Physician'}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📧 {doctor.email}</span>
                        <span>📱 {doctor.phone}</span>
                      </div>
                      {doctor.qualification && (
                        <p className="text-sm text-gray-500 mt-1">
                          {doctor.qualification} • {doctor.experience || '0'} years exp.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditDoctor(doctor)}
                      className="btn btn-secondary flex items-center space-x-1 text-sm"
                      title="Edit Doctor"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doctor._id)}
                      className="btn bg-red-500 hover:bg-red-600 text-white flex items-center space-x-1 text-sm"
                      title="Delete Doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Doctors Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search' : 'Start by adding your first doctor'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-primary inline-flex items-center space-x-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Add First Doctor</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Doctor</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Dr. John Doe"
                    />
                  </div>

                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="doctor@example.com"
                    />
                  </div>

                  <div>
                    <label className="label">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="9876543210"
                    />
                  </div>

                  <div>
                    <label className="label">Password *</label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input"
                      placeholder="Minimum 6 characters"
                    />
                  </div>

                  <div>
                    <label className="label">Specialization *</label>
                    <input
                      type="text"
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Cardiologist"
                    />
                  </div>

                  <div>
                    <label className="label">Qualification *</label>
                    <input
                      type="text"
                      name="qualification"
                      required
                      value={formData.qualification}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., MBBS, MD"
                    />
                  </div>

                  <div>
                    <label className="label">Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="input"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="label">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      className="input"
                      placeholder="500"
                    />
                  </div>

                  <div>
                    <label className="label">Available From</label>
                    <input
                      type="text"
                      name="availableFrom"
                      value={formData.availableFrom}
                      onChange={handleChange}
                      className="input"
                      placeholder="09:00"
                      pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                      title="Enter time in 24-hour format (HH:MM)"
                      maxLength="5"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      24-hour format: 09:00 (9 AM), 14:30 (2:30 PM), 17:00 (5 PM)
                    </p>
                  </div>

                  <div>
                    <label className="label">Available To</label>
                    <input
                      type="text"
                      name="availableTo"
                      value={formData.availableTo}
                      onChange={handleChange}
                      className="input"
                      placeholder="17:00"
                      pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                      title="Enter time in 24-hour format (HH:MM)"
                      maxLength="5"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      24-hour format: 09:00 (9 AM), 14:30 (2:30 PM), 17:00 (5 PM)
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">Languages Spoken</label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      className="input"
                      placeholder="English, Hindi, Tamil"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Adding Doctor...' : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditForm && editingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Doctor</h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingDoctor(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateDoctor} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      className="input bg-gray-100"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
                  </div>

                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      className="input bg-gray-100"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="label">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="1234567890"
                    />
                  </div>

                  <div>
                    <label className="label">Specialization *</label>
                    <input
                      type="text"
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Cardiology"
                    />
                  </div>

                  <div>
                    <label className="label">Qualification *</label>
                    <input
                      type="text"
                      name="qualification"
                      required
                      value={formData.qualification}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., MBBS, MD"
                    />
                  </div>

                  <div>
                    <label className="label">Experience (years) *</label>
                    <input
                      type="number"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div>
                    <label className="label">Consultation Fee (₹) *</label>
                    <input
                      type="number"
                      name="consultationFee"
                      required
                      value={formData.consultationFee}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., 500"
                    />
                  </div>

                  <div>
                    <label className="label">Available From (HH:MM) *</label>
                    <input
                      type="text"
                      name="availableFrom"
                      required
                      value={formData.availableFrom}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., 09:00"
                    />
                  </div>

                  <div>
                    <label className="label">Available To (HH:MM) *</label>
                    <input
                      type="text"
                      name="availableTo"
                      required
                      value={formData.availableTo}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., 17:00"
                    />
                  </div>

                  <div>
                    <label className="label">Languages Spoken</label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., English, Hindi"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingDoctor(null);
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Updating...' : 'Update Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
