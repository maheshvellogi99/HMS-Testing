import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  LogOut,
  HeartPulse,
  Package
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch patients count
      const patientsRes = await api.get('/users?role=patient');
      const patients = patientsRes.data.data || [];
      
      // Fetch doctors count
      const doctorsRes = await api.get('/doctors');
      const doctors = doctorsRes.data.data || [];
      
      // Fetch appointments count
      const appointmentsRes = await api.get('/appointments');
      const appointments = appointmentsRes.data.data || [];
      
      // Calculate revenue based on actual amount paid (supports partial payments)
      const revenue = appointments.reduce((sum, apt) => {
        if (apt.billing) {
          // Prefer paidAmount if present (supports 50% advance + full payment)
          if (typeof apt.billing.paidAmount === 'number') {
            return sum + apt.billing.paidAmount;
          }
          // Fallback to old logic for legacy records
          if (apt.billing.isPaid) {
            return sum + (apt.billing.consultationFee || 0);
          }
        }
        return sum;
      }, 0);
      
      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalAppointments: appointments.length,
        revenue: revenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
          <p className="text-gray-600 mt-2">Admin Dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => navigate('/admin/patients')}
            className="card hover:shadow-xl transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalPatients}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/admin/doctors')}
            className="card hover:shadow-xl transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Doctors</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalDoctors}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/admin/appointments')}
            className="card hover:shadow-xl transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Appointments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalAppointments}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/admin/revenue')}
            className="card hover:shadow-xl transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : `₹${stats.revenue.toLocaleString()}`}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Appointments</h2>
            <div className="card">
              <p className="text-gray-600 text-center py-8">
                No recent appointments.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="card space-y-3">
              <button 
                onClick={() => navigate('/admin/manage-doctors')}
                className="w-full btn btn-primary py-3"
              >
                Manage Doctors
              </button>
              <button 
                onClick={() => navigate('/admin/inventory')}
                className="w-full btn btn-primary py-3 flex items-center justify-center space-x-2"
              >
                <Package className="w-5 h-5" />
                <span>View Inventory</span>
              </button>
              <button 
                onClick={() => navigate('/admin/departments')}
                className="w-full btn btn-secondary py-3"
              >
                Manage Departments
              </button>
              <button className="w-full btn btn-secondary py-3">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
