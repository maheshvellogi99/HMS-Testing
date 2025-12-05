import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Phone, 
  Mail,
  Calendar,
  Stethoscope,
  Search
} from 'lucide-react';
import { getDepartmentIcon } from '../utils/departmentIcons';
import { getDepartmentById } from '../data/departments';

const DepartmentDoctors = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get department from static data
  const department = location.state?.department || getDepartmentById(departmentId);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Fetch all doctors and filter by specialization matching department name
        const response = await api.get('/doctors');
        const allDoctors = response.data.data || [];
        
        // More flexible matching: check both ways and handle variations
        const deptNameLower = department.name.toLowerCase();
        const deptKeywords = department.keywords || [deptNameLower];
        
        const filteredDoctors = allDoctors.filter(doctor => {
          if (!doctor.specialization) return false;
          
          const specLower = doctor.specialization.toLowerCase().trim();
          
          // Method 1: Check if any keyword matches the specialization
          const keywordMatch = deptKeywords.some(keyword => 
            specLower.includes(keyword.toLowerCase()) || 
            keyword.toLowerCase().includes(specLower)
          );
          
          if (keywordMatch) return true;
          
          // Method 2: Check if specialization contains department name OR vice versa
          if (specLower.includes(deptNameLower) || deptNameLower.includes(specLower)) {
            return true;
          }
          
          // Method 3: Check root words (remove common suffixes like -ist, -logy, -ology, -ics)
          const specRoot = specLower.replace(/ist$|logy$|ology$|ics$/g, '');
          const deptRoot = deptNameLower.replace(/ist$|logy$|ology$|ics$/g, '');
          
          if (specRoot && deptRoot && specRoot === deptRoot) {
            return true;
          }
          
          return false;
        });
        
        console.log(`Department: ${department.name}`);
        console.log(`Found ${filteredDoctors.length} doctors:`, filteredDoctors.map(d => d.specialization));
        
        setDoctors(filteredDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    if (department) {
      fetchDoctors();
    } else {
      setLoading(false);
    }
  }, [department]);

  // Filter doctors by search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const IconComponent = department ? getDepartmentIcon(department.name) : Stethoscope;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>

          {department && (
            <div className="flex items-center space-x-4">
              {/* Department Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-indigo-600" strokeWidth={1.5} />
              </div>

              {/* Department Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
                <p className="text-gray-600 mt-1">{department.description}</p>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{doctors.length}</div>
                  <div className="text-sm text-gray-500">Doctors</div>
                </div>
                {department.averageWaitTime && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{department.averageWaitTime}</div>
                    <div className="text-sm text-gray-500">Avg. Wait (min)</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group animate-slideInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Doctor Image/Avatar */}
                <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 h-48 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-16 h-16 text-indigo-600" />
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Dr. {doctor.name}
                  </h3>
                  
                  {doctor.specialization && (
                    <p className="text-indigo-600 font-medium mb-3">
                      {doctor.specialization}
                    </p>
                  )}

                  {doctor.qualifications && (
                    <p className="text-sm text-gray-600 mb-4">
                      {doctor.qualifications}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {doctor.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{doctor.email}</span>
                      </div>
                    )}
                    
                    {doctor.phoneNumber && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{doctor.phoneNumber}</span>
                      </div>
                    )}

                    {doctor.experience && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/register', { state: { doctor } })}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Stethoscope className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No doctors found' : 'No doctors available at the moment'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Coming soon!'
              }
            </p>
            {!searchTerm && (
              <p className="text-indigo-600 font-medium">
                We are working on bringing the best specialists to this department
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDoctors;
