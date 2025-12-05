import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CreditCard, User, DollarSign, Search } from 'lucide-react';
import api from '../../services/api';

const RevenueDetails = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data.data || []);
    } catch (error) {
      console.error('Error fetching revenue appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBillingInfo = (apt) => {
    const fee = apt.billing?.consultationFee || 0;
    const paid = typeof apt.billing?.paidAmount === 'number'
      ? apt.billing.paidAmount
      : (apt.billing?.isPaid ? fee : 0);
    const remaining = Math.max(fee - paid, 0);
    const isFullyPaid = fee > 0 && paid >= fee && apt.billing?.isPaid;
    const hasAdvance = paid > 0 && !isFullyPaid;
    return { fee, paid, remaining, isFullyPaid, hasAdvance };
  };

  const filtered = appointments.filter((apt) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      apt.patient?.name?.toLowerCase().includes(term) ||
      apt.patient?.email?.toLowerCase().includes(term) ||
      apt.doctor?.name?.toLowerCase().includes(term);

    const hasAnyPayment = apt.billing && (apt.billing.paidAmount > 0 || apt.billing.isPaid);
    return matchesSearch && hasAnyPayment;
  });

  const totalPaid = filtered.reduce((sum, apt) => {
    const { paid } = getBillingInfo(apt);
    return sum + paid;
  }, 0);

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Revenue Details</h1>
                <p className="text-sm text-gray-600">Breakdown of all appointment payments</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Collected</p>
              <p className="text-2xl font-bold text-gray-900 flex items-center justify-end">
                <DollarSign className="w-5 h-5 mr-1 text-green-600" />
                <span>₹{totalPaid.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient, email, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">Loading revenue details...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-600">No appointment payments have been recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt) => {
              const { fee, paid, remaining, isFullyPaid, hasAdvance } = getBillingInfo(apt);
              return (
                <div key={apt._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                          <User className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {apt.patient?.name || 'Unknown Patient'}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">{apt.patient?.email}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            with Dr. {apt.doctor?.name || 'Unknown Doctor'}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{apt.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{apt.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:text-right space-y-1 min-w-[220px]">
                      <div className="text-sm text-gray-600">Consultation Fee</div>
                      <div className="text-xl font-bold text-gray-900">₹{fee}</div>
                      <div className="text-sm text-green-700 flex items-center justify-end">
                        <CreditCard className="w-4 h-4 mr-1" />
                        <span>Paid: ₹{paid}</span>
                      </div>
                      {hasAdvance && (
                        <div className="text-xs text-orange-600">Remaining at hospital: ₹{remaining}</div>
                      )}
                      {isFullyPaid && (
                        <div className="text-xs text-green-600">Fully paid</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueDetails;
