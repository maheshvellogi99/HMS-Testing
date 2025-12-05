import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { 
  Calendar, 
  Users, 
  FileText, 
  LogOut,
  HeartPulse,
  Clock,
  User,
  Plus,
  X,
  Trash2
} from 'lucide-react';
import api from '../../services/api';

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({
    today: 0,
    totalPatients: 0,
  });
  const [allAppointments, setAllAppointments] = useState([]);
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [showPrescriptionsModal, setShowPrescriptionsModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
  });
  const [prescribing, setPrescribing] = useState(false);

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch appointments
      const response = await api.get('/appointments');
      const allAppointmentsData = response.data.data || [];

      // All appointments for this doctor (past and future)
      const doctorAppointments = allAppointmentsData.filter(
        (apt) => apt.doctor?._id === user._id
      );

      // Filter for today's appointments for this doctor
      const todaysAppts = doctorAppointments.filter((apt) => {
        const aptDate = new Date(apt.date).toISOString().split('T')[0];
        return aptDate === today;
      });
      
      setTodayAppointments(todaysAppts);
      setAllAppointments(doctorAppointments);
      setStats({
        today: todaysAppts.length,
        totalPatients: doctorAppointments.length,
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const openPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    const existing = appointment.prescription || {};
    const medicines =
      existing.medicines && existing.medicines.length > 0
        ? existing.medicines
        : [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }];

    setPrescriptionData({
      diagnosis: existing.diagnosis || '',
      medicines,
    });
    setShowPrescriptionModal(true);
  };

  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const removeMedicine = (index) => {
    const newMedicines = prescriptionData.medicines.filter((_, i) => i !== index);
    setPrescriptionData({
      ...prescriptionData,
      medicines: newMedicines.length > 0 ? newMedicines : [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const updateMedicine = (index, field, value) => {
    const newMedicines = [...prescriptionData.medicines];
    newMedicines[index][field] = value;
    setPrescriptionData({
      ...prescriptionData,
      medicines: newMedicines
    });
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setPrescribing(true);

    try {
      await api.put(`/appointments/${selectedAppointment._id}/prescription`, prescriptionData);
      alert('Prescription added successfully!');
      setShowPrescriptionModal(false);
      fetchTodayAppointments();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add prescription');
    } finally {
      setPrescribing(false);
    }
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
            Welcome, Dr. {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">Doctor Dashboard</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
                <p className="text-3xl font-bold text-primary-600">{stats.today}</p>
              </div>
            </div>
          </div>

          <div
            className="card hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setShowPatientsModal(true)}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Patients</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
              </div>
            </div>
          </div>

          <div
            className="card hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setShowPrescriptionsModal(true)}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
                <p className="text-gray-600">Manage prescriptions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => (
                <div key={appointment._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 p-3 rounded-full">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.patient?.name || 'Patient'}
                        </h3>
                        <p className="text-gray-600">{appointment.reason || 'General Consultation'}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : appointment.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                      {appointment.status !== 'completed' && (
                        <button
                          onClick={() => openPrescriptionModal(appointment)}
                          className="btn btn-primary text-sm flex items-center space-x-1"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Add Prescription</span>
                        </button>
                      )}
                      {appointment.prescription && (
                        <span className="text-xs text-green-600">✓ Prescription Added</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card">
                <p className="text-gray-600 text-center py-8">
                  No appointments scheduled for today.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Patients Modal */}
      {showPatientsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">All Patients & Appointments</h2>
                <button
                  onClick={() => setShowPatientsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {allAppointments.length > 0 ? (
                <div className="space-y-3">
                  {allAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="border border-gray-200 rounded-lg p-4 flex items-start justify-between"
                    >
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="text-base font-semibold text-gray-900">
                          {appointment.patient?.name || 'Patient'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {appointment.reason || 'General Consultation'}
                        </p>
                      </div>
                      <div className="text-right space-y-1 text-sm text-gray-600">
                        <div className="flex items-center justify-end space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                            appointment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <p className="text-gray-600 text-center py-6">
                    No appointments found for your patients yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prescriptions Modal */}
      {showPrescriptionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
                <button
                  onClick={() => setShowPrescriptionsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {allAppointments.filter((apt) => apt.prescription && apt.prescription.diagnosis).length > 0 ? (
                <div className="space-y-3">
                  {allAppointments
                    .filter((apt) => apt.prescription && apt.prescription.diagnosis)
                    .map((appointment) => (
                      <div
                        key={appointment._id}
                        className="border border-gray-200 rounded-lg p-4 flex items-start justify-between"
                      >
                        <div>
                          <p className="text-sm text-gray-500">Patient</p>
                          <p className="text-base font-semibold text-gray-900">
                            {appointment.patient?.name || 'Patient'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {appointment.prescription?.diagnosis}
                          </p>
                        </div>
                        <div className="text-right space-y-2 text-sm text-gray-600 ml-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPrescriptionsModal(false);
                              openPrescriptionModal(appointment);
                            }}
                            className="btn btn-secondary text-xs"
                          >
                            View / Edit
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="card">
                  <p className="text-gray-600 text-center py-6">
                    No prescriptions have been added yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add Prescription</h2>
                  <p className="text-gray-600">Patient: {selectedAppointment.patient?.name}</p>
                </div>
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handlePrescriptionSubmit}>
                {/* Diagnosis */}
                <div className="mb-6">
                  <label className="label">Diagnosis *</label>
                  <textarea
                    required
                    rows="3"
                    value={prescriptionData.diagnosis}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })}
                    className="input"
                    placeholder="Enter diagnosis..."
                  />
                </div>

                {/* Medicines */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="label mb-0">Medicines</label>
                    <button
                      type="button"
                      onClick={addMedicine}
                      className="btn btn-secondary text-sm flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Medicine</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {prescriptionData.medicines.map((medicine, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                        {prescriptionData.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicine(index)}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="label text-sm">Medicine Name *</label>
                            <input
                              type="text"
                              required
                              value={medicine.name}
                              onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                              className="input"
                              placeholder="e.g., Paracetamol"
                            />
                          </div>
                          <div>
                            <label className="label text-sm">Dosage *</label>
                            <input
                              type="text"
                              required
                              value={medicine.dosage}
                              onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                              className="input"
                              placeholder="e.g., 500mg"
                            />
                          </div>
                          <div>
                            <label className="label text-sm">Frequency *</label>
                            <input
                              type="text"
                              required
                              value={medicine.frequency}
                              onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                              className="input"
                              placeholder="e.g., 3 times a day"
                            />
                          </div>
                          <div>
                            <label className="label text-sm">Duration *</label>
                            <input
                              type="text"
                              required
                              value={medicine.duration}
                              onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                              className="input"
                              placeholder="e.g., 5 days"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="label text-sm">Instructions</label>
                            <input
                              type="text"
                              value={medicine.instructions}
                              onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                              className="input"
                              placeholder="e.g., Take after meals"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={prescribing}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {prescribing ? 'Adding...' : 'Add Prescription'}
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

export default DoctorDashboard;
