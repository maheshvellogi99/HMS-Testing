import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Clock, User, FileText, CreditCard } from 'lucide-react';
import api from '../../services/api';

const ViewAllAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || appointment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

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
              <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
            </div>
            <div className="text-sm text-gray-600">
              Total Appointments: <span className="font-semibold text-primary-600">{appointments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-6 grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient, doctor, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  {/* Left Side - Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.patient?.name || 'Unknown Patient'}
                        </h3>
                        <p className="text-gray-600">
                          with Dr. {appointment.doctor?.name || 'Unknown Doctor'}
                        </p>
                        {appointment.doctor?.specialization && (
                          <p className="text-sm text-gray-500">
                            {appointment.doctor.specialization}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>

                        {appointment.reason && (
                          <p className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Status and Details */}
                  <div className="md:text-right space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>

                    {appointment.prescription && appointment.prescription.diagnosis && (
                      <div className="flex items-center justify-end text-sm text-green-600">
                        <FileText className="w-4 h-4 mr-1" />
                        <span>Prescription Available</span>
                      </div>
                    )}

                    {appointment.billing && (
                      <div className="flex items-center justify-end text-sm">
                        <CreditCard className="w-4 h-4 mr-1" />
                        <span className={appointment.billing.isPaid ? 'text-green-600' : 'text-orange-600'}>
                          ₹{appointment.billing.consultationFee || 0} -{' '}
                          {appointment.billing.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    )}

                    {appointment.createdAt && (
                      <p className="text-xs text-gray-500">
                        Booked {new Date(appointment.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No appointments have been scheduled yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllAppointments;
