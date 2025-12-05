import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { departments } from '../../data/departments';
import { getDepartmentIcon } from '../../utils/departmentIcons';

const ViewAllDepartments = () => {
  const navigate = useNavigate();

  const handleDepartmentClick = (dept) => {
    // Navigate to ManageDoctors with specialization filter
    navigate(`/admin/manage-doctors?specialization=${encodeURIComponent(dept.name)}`);
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Manage Departments</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Select a department to view its doctors and add new ones.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const IconComponent = getDepartmentIcon(dept.name);
            const colorClass = dept.color || 'from-indigo-50 to-indigo-100 border-indigo-200';

            return (
              <div
                key={dept.id}
                onClick={() => handleDepartmentClick(dept)}
                className={`
                  group cursor-pointer
                  bg-gradient-to-br ${colorClass}
                  border-2 rounded-2xl p-6
                  hover:shadow-xl hover:scale-105
                  transition-all duration-300
                `}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className="
                    w-16 h-16 rounded-full
                    bg-white/80 backdrop-blur-sm
                    flex items-center justify-center
                    group-hover:bg-white group-hover:rotate-6
                    transition-all duration-300
                    shadow-md
                  ">
                    <IconComponent 
                      className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" 
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Department Name */}
                  <h3 className="
                    text-base font-semibold text-gray-800
                    group-hover:text-indigo-700
                    transition-colors duration-300
                  ">
                    {dept.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {dept.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewAllDepartments;
