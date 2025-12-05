import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { HeartPulse, LogOut, Search, Calendar, Clock, DollarSign } from 'lucide-react';
import api from '../../services/api';

const StaffDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', time: '', reason: '' });
  const [patientDetails, setPatientDetails] = useState({ name: '', dob: '', email: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        const list = res.data.data || [];
        setDoctors(list);
        setFilteredDoctors(list);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    let list = doctors;
    if (searchTerm) {
      list = list.filter((d) =>
        (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.specialization || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredDoctors(list);
  }, [doctors, searchTerm]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleTimeChange = (e) => {
    let value = e.target.value.replace(/[^\d:]/g, '');
    if (value.length === 2 && !value.includes(':')) value = value + ':';
    if (value.length > 5) value = value.slice(0, 5);
    setBookingData((prev) => ({ ...prev, time: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!patientDetails.name || !patientDetails.email) {
      alert('Please enter patient name and email');
      setLoading(false);
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (bookingData.time && !timeRegex.test(bookingData.time)) {
      alert('Invalid time format. Use HH:MM in 24-hour format.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor.user,
        date: bookingData.date,
        time: bookingData.time,
        reason: bookingData.reason || 'General Consultation',
        patientName: patientDetails.name,
        patientEmail: patientDetails.email,
        patientDOB: patientDetails.dob || undefined,
      });

      alert('Appointment booked successfully for the patient.');
      setShowBookingForm(false);
      setBookingData({ date: '', time: '', reason: '' });
      setPatientDetails({ name: '', dob: '', email: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getFee = (doctor) => doctor?.consultationFee || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <HeartPulse className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Staff Portal</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Book appointments for walk-in patients</p>
        </div>

        <div className="mb-4 flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctors or specializations"
              className="input pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="card flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialization || 'General Physician'}</p>
                {doctor.consultationFee && (
                  <div className="mt-1 flex items-center text-gray-800">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>₹{getFee(doctor)} consultation fee</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleBookClick(doctor)}
                className="btn btn-primary mt-3 md:mt-0"
              >
                Book for Patient
              </button>
            </div>
          ))}
          {filteredDoctors.length === 0 && (
            <div className="card text-center py-10 text-gray-600">No doctors found.</div>
          )}
        </div>
      </div>

      {showBookingForm && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="font-semibold text-gray-900">{selectedDoctor.name}</p>
                <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                {selectedDoctor.consultationFee && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Consultation Fee:</span> ₹{getFee(selectedDoctor)} (full amount)
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="label text-sm">Patient Name *</label>
                  <input
                    type="text"
                    value={patientDetails.name}
                    onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label text-sm">Patient Email *</label>
                  <input
                    type="email"
                    value={patientDetails.email}
                    onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label text-sm">Patient Date of Birth</label>
                  <input
                    type="date"
                    value={patientDetails.dob}
                    onChange={(e) => setPatientDetails({ ...patientDetails, dob: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label text-sm flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label text-sm flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Time *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.time}
                    onChange={handleTimeChange}
                    className="input"
                    placeholder="14:30"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="label text-sm">Reason</label>
                  <textarea
                    rows={3}
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                    className="input"
                    placeholder="Reason for consultation"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Booking...' : 'Confirm Booking'}
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

export default StaffDashboard;
