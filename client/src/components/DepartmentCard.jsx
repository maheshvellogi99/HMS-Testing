import { useNavigate } from 'react-router-dom';
import { getDepartmentIcon } from '../utils/departmentIcons';

const DepartmentCard = ({ department }) => {
  const navigate = useNavigate();
  const IconComponent = getDepartmentIcon(department.name);
  const colorClass = department.color || 'from-indigo-50 to-indigo-100 border-indigo-200';

  const handleClick = () => {
    navigate(`/departments/${department.id}`, {
      state: { department }
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group cursor-pointer
        bg-gradient-to-br ${colorClass}
        border-2 rounded-2xl p-6
        min-w-[160px] max-w-[180px]
        hover:shadow-xl hover:scale-105
        transition-all duration-300
        animate-slideInUp
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
          line-clamp-2
        ">
          {department.name}
        </h3>

        {/* Doctor Count (if available) */}
        {department.doctorCount > 0 && (
          <p className="text-xs text-gray-500">
            {department.doctorCount} {department.doctorCount === 1 ? 'Doctor' : 'Doctors'}
          </p>
        )}
      </div>
    </div>
  );
};

export default DepartmentCard;
