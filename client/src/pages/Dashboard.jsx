import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HeartPulse } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'doctor':
          navigate('/doctor', { replace: true });
          break;
        case 'patient':
          navigate('/patient', { replace: true });
          break;
        case 'inventoryManager':
          navigate('/inventory-dashboard', { replace: true });
          break;
        case 'staff':
          navigate('/staff', { replace: true });
          break;
        default:
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <HeartPulse className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-semibold text-gray-900">Loading Dashboard...</h2>
      </div>
    </div>
  );
};

export default Dashboard;
