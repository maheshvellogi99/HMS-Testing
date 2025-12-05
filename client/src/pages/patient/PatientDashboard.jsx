import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { 
  Calendar, 
  FileText, 
  User, 
  LogOut,
  HeartPulse,
  Clock
} from 'lucide-react';
import api from '../../services/api';

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      const allAppointments = response.data.data || [];
      
      // Filter for upcoming scheduled appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcoming = allAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return apt.status === 'scheduled' && aptDate >= today;
      }).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <HeartPulse className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Chikitsamitra</span>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">Patient Dashboard</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Appointments Card */}
          <div 
            onClick={() => navigate('/patient/appointments')}
            className="card hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
                <p className="text-gray-600">View & book appointments</p>
              </div>
            </div>
          </div>

          {/* Medical Records Card */}
          <div 
            onClick={() => navigate('/patient/records')}
            className="card hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Medical Records</h3>
                <p className="text-gray-600">Access your health records</p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div 
            onClick={() => navigate('/patient/profile')}
            className="card hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <p className="text-gray-600">Manage your profile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
            <button
              onClick={() => navigate('/patient/book-appointment')}
              className="btn btn-primary text-sm"
            >
              + Book Appointment
            </button>
          </div>
          
          {loading ? (
            <div className="card">
              <p className="text-gray-600 text-center py-8">Loading...</p>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment._id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/patient/appointments')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 p-3 rounded-full">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.doctor?.name || 'Doctor'}
                        </h3>
                        <p className="text-gray-600">{appointment.doctor?.specialization || 'General'}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
              {upcomingAppointments.length > 3 && (
                <button
                  onClick={() => navigate('/patient/appointments')}
                  className="w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2"
                >
                  View all {upcomingAppointments.length} appointments →
                </button>
              )}
            </div>
          ) : (
            <div className="card">
              <p className="text-gray-600 text-center py-8">
                No upcoming appointments. Book your first appointment!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
