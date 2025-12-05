import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Clock, DollarSign, Award, Languages, MapPin } from 'lucide-react';
import api from '../../services/api';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: '',
  });

  const getAdvanceAmount = (doctor) => {
    if (!doctor?.consultationFee) return 0;
    return Math.round(doctor.consultationFee * 0.5);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialty, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data.data || []);
      setFilteredDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(
        (doctor) => doctor.specialization === selectedSpecialty
      );
    }

    setFilteredDoctors(filtered);
  };

  const specialties = [...new Set(doctors.map((d) => d.specialization).filter(Boolean))];

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleTimeChange = (e) => {
    let value = e.target.value;
    
    // Auto-format time input
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
    
    setBookingData({ ...bookingData, time: value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (bookingData.time && !timeRegex.test(bookingData.time)) {
      alert('Invalid time format. Please use 24-hour format (HH:MM), e.g., 14:30');
      setLoading(false);
      return;
    }

    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor.user,  // Use user ID from doctor object
        date: bookingData.date,
        time: bookingData.time,
        reason: bookingData.reason,
      });

      alert('Appointment booked successfully!');
      setShowBookingForm(false);
      setBookingData({ date: '', time: '', reason: '' });
      navigate('/patient/appointments');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/patient')}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find A Doctor</h1>
              <p className="text-gray-600 mt-1">
                Connect with Trusted Healthcare Experts for Personalized Care
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for Doctors & Specialities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="input"
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="card hover:shadow-xl transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Doctor Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary-600">
                        {doctor.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {doctor.name}
                    </h3>
                    <p className="text-lg text-primary-600 mb-3">
                      {doctor.specialization || 'General Physician'}
                    </p>

                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      {doctor.experience && (
                        <div className="flex items-center text-gray-600">
                          <Award className="w-4 h-4 mr-2" />
                          <span>{doctor.experience}+ Years experience</span>
                        </div>
                      )}
                      {doctor.qualification && (
                        <div className="flex items-center text-gray-600">
                          <Award className="w-4 h-4 mr-2" />
                          <span>{doctor.qualification}</span>
                        </div>
                      )}
                      {doctor.languages && (
                        <div className="flex items-center text-gray-600">
                          <Languages className="w-4 h-4 mr-2" />
                          <span>{doctor.languages}</span>
                        </div>
                      )}
                      {doctor.availableFrom && doctor.availableTo && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>
                            {doctor.availableFrom} - {doctor.availableTo}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {doctor.consultationFee && (
                        <div className="flex items-center text-lg font-semibold text-gray-900">
                          <DollarSign className="w-5 h-5 mr-1" />
                          <span>₹{doctor.consultationFee}</span>
                          <span className="text-sm text-gray-500 ml-2">Consultation Fee</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleBookAppointment(doctor)}
                        className="btn btn-primary"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Doctors Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Doctor Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900">{selectedDoctor.name}</h3>
                <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                {selectedDoctor.consultationFee && (
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Consultation Fee:</span>
                      <span className="ml-1">₹{selectedDoctor.consultationFee}</span>
                    </p>
                    <p className="text-primary-700">
                      <span className="font-medium">To Pay Now (50% Advance):</span>
                      <span className="ml-1">₹{getAdvanceAmount(selectedDoctor)}</span>
                    </p>
                    <p className="text-gray-600 text-xs">
                      Remaining ₹{selectedDoctor.consultationFee - getAdvanceAmount(selectedDoctor)} to be paid at the hospital after consultation.
                    </p>
                  </div>
                )}
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="label">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Select Date *</span>
                    </div>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.date}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, date: e.target.value })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Select Time *</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.time}
                    onChange={handleTimeChange}
                    className="input"
                    placeholder="14:30"
                    maxLength="5"
                    pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                    title="Enter time in 24-hour format (HH:MM)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use 24-hour format: 09:00 (9 AM), 14:30 (2:30 PM), 17:00 (5 PM)
                  </p>
                </div>

                <div>
                  <label className="label">Reason for Visit</label>
                  <textarea
                    rows="3"
                    value={bookingData.reason}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, reason: e.target.value })
                    }
                    className="input"
                    placeholder="Describe your symptoms or reason for consultation"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Processing...' : 'Pay & Confirm Booking'}
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

export default BookAppointment;
