import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserCheck, Mail, Phone, Stethoscope, Award, Clock, DollarSign } from 'lucide-react';
import api from '../../services/api';

const ViewAllDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
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
              <h1 className="text-2xl font-bold text-gray-900">All Doctors</h1>
            </div>
            <div className="text-sm text-gray-600">
              Total Doctors: <span className="font-semibold text-primary-600">{doctors.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
        {loading ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                    <UserCheck className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                    
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span className="truncate">{doctor.qualification}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Stethoscope className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span>{doctor.experience || 0} years exp.</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span className="truncate">{doctor.email}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span>{doctor.phone}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span>{doctor.availableFrom} - {doctor.availableTo}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                        <span className="font-medium">₹{doctor.consultationFee}</span>
                      </div>
                    </div>

                    {doctor.languages && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Languages:</span> {doctor.languages}
                      </div>
                    )}

                    <div className="mt-3 flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doctor.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doctor.active ? 'Active' : 'Inactive'}
                      </span>
                      {doctor.totalAppointments > 0 && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {doctor.totalAppointments} appointments
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'No doctors registered yet'}
            </p>
            <button
              onClick={() => navigate('/admin/manage-doctors')}
              className="btn btn-primary"
            >
              Add First Doctor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllDoctors;
