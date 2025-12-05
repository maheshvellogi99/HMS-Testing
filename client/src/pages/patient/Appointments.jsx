import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Plus, FileText, CreditCard, X } from 'lucide-react';
import api from '../../services/api';

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

  const getBillingInfo = (appointment) => {
    const fee = appointment.billing?.consultationFee || 0;
    const paid = typeof appointment.billing?.paidAmount === 'number'
      ? appointment.billing.paidAmount
      : (appointment.billing?.isPaid ? fee : 0);
    const remaining = Math.max(fee - paid, 0);
    const isFullyPaid = fee > 0 && paid >= fee && appointment.billing?.isPaid;
    const hasAdvance = paid > 0 && !isFullyPaid;
    return { fee, paid, remaining, isFullyPaid, hasAdvance };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handlePayment = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/payment`, {
        paymentMethod: 'online'
      });
      alert('Payment successful!');
      fetchAppointments();
      setShowDetailsModal(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Payment failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/patient')}
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
            </div>
            <button 
              onClick={() => navigate('/patient/book-appointment')}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.doctor?.name || 'Unknown Doctor'}
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
                      {/* Show "Prescription Available" only if payment is completed */}
                      {appointment.prescription && appointment.prescription.diagnosis && appointment.billing && appointment.billing.isPaid && (
                        <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                          <FileText className="w-4 h-4" />
                          <span>Prescription Available</span>
                        </div>
                      )}
                      {/* Show payment information when prescription exists and payment is pending/partial */}
                      {appointment.prescription && appointment.prescription.diagnosis && appointment.billing && !appointment.billing.isPaid && (
                        <div className="mt-2 flex flex-col text-sm text-orange-600">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4" />
                            {(() => {
                              const { fee, paid, remaining } = getBillingInfo(appointment);
                              return (
                                <span>
                                  Advance Paid: ₹{paid || 0} &nbsp;|&nbsp; Remaining: ₹{remaining}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                    <button 
                      onClick={() => handleViewDetails(appointment)}
                      className="btn btn-secondary text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Appointments Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't booked any appointments. Start by booking your first consultation.
              </p>
              <button 
                onClick={() => navigate('/patient/book-appointment')}
                className="btn btn-primary"
              >
                Book Your First Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Doctor Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Doctor Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 font-medium">{selectedAppointment.doctor?.name}</p>
                  <p className="text-gray-600">{selectedAppointment.doctor?.specialization}</p>
                  <p className="text-gray-500 text-sm mt-1">{selectedAppointment.doctor?.email}</p>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900 font-medium">{selectedAppointment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="text-gray-900 font-medium">{selectedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="text-gray-900">{selectedAppointment.reason}</span>
                  </div>
                </div>
              </div>

              {/* Prescription - Only visible after payment */}
              {selectedAppointment.prescription && selectedAppointment.prescription.diagnosis && selectedAppointment.billing && selectedAppointment.billing.isPaid && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Prescription
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Diagnosis:</p>
                      <p className="text-gray-900 font-medium">{selectedAppointment.prescription.diagnosis}</p>
                    </div>
                    {selectedAppointment.prescription.medicines && selectedAppointment.prescription.medicines.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Medicines:</p>
                        <div className="space-y-2">
                          {selectedAppointment.prescription.medicines.map((med, index) => (
                            <div key={index} className="bg-white p-3 rounded border border-green-200">
                              <p className="font-medium text-gray-900">{med.name}</p>
                              <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                              <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                              <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                              {med.instructions && (
                                <p className="text-sm text-gray-500 mt-1">Instructions: {med.instructions}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedAppointment.prescription.prescribedAt && (
                      <p className="text-xs text-gray-500 mt-3">
                        Prescribed on {new Date(selectedAppointment.prescription.prescribedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Required to View Prescription Message */}
              {selectedAppointment.prescription && selectedAppointment.prescription.diagnosis && selectedAppointment.billing && !selectedAppointment.billing.isPaid && (
                <div className="mb-6">
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <div className="flex items-center justify-center text-orange-800">
                      <CreditCard className="w-5 h-5 mr-2" />
                      <p className="font-medium">
                        Payment Required to View Prescription
                      </p>
                    </div>
                    <p className="text-sm text-orange-700 text-center mt-2">
                      Complete the consultation fee payment below to access your prescription and receive it via email.
                    </p>
                  </div>
                </div>
              )}

              {/* Waiting for Prescription Message */}
              {(!selectedAppointment.prescription || !selectedAppointment.prescription.diagnosis) && selectedAppointment.status === 'scheduled' && (
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-blue-800 text-center">
                      <FileText className="w-5 h-5 inline mr-2" />
                      Waiting for doctor to prescribe medicines
                    </p>
                  </div>
                </div>
              )}

              {/* Billing */}
              {selectedAppointment.prescription && selectedAppointment.prescription.diagnosis && selectedAppointment.billing && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                    Billing Information
                  </h3>
                  {(() => {
                    const { fee, paid, remaining, isFullyPaid, hasAdvance } = getBillingInfo(selectedAppointment);
                    return (
                      <div className={`p-4 rounded-lg ${isFullyPaid ? 'bg-green-50' : 'bg-orange-50'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-600">Consultation Fee:</p>
                            <p className="text-2xl font-bold text-gray-900">₹{fee}</p>
                            {hasAdvance && (
                              <p className="text-sm text-gray-700 mt-1">
                                Advance Paid: <span className="font-semibold">₹{paid}</span>
                              </p>
                            )}
                            {!isFullyPaid && remaining > 0 && (
                              <p className="text-sm text-orange-700 mt-1">
                                Remaining to Pay: <span className="font-semibold">₹{remaining}</span>
                              </p>
                            )}
                          </div>
                          <div>
                            {isFullyPaid ? (
                              <div className="text-right">
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                  Paid
                                </span>
                                {selectedAppointment.billing.paidAt && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    on {new Date(selectedAppointment.billing.paidAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => handlePayment(selectedAppointment._id)}
                                className="btn btn-primary"
                              >
                                Pay Remaining ₹{remaining}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
