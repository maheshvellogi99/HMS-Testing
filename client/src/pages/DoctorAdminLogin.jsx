import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, getCurrentUser } from '../redux/slices/authSlice';
import { HeartPulse, Mail, Lock, UserCheck, ShieldCheck, User } from 'lucide-react';

const DoctorAdminLogin = () => {
  const [loginType, setLoginType] = useState('doctor'); // 'doctor' or 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is already logged in, redirect to their dashboard
    if (user && token) {
      const userRole = user.role;
      switch (userRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
        case 'staff':
          navigate('/staff');
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, [user, token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First login to get token
      await dispatch(login(formData)).unwrap();
      
      // Then get user details
      const userResult = await dispatch(getCurrentUser()).unwrap();
      const userRole = userResult.data.role;
      
      // Verify the user has the correct role
      if (loginType === 'doctor' && userRole !== 'doctor') {
        setError('This account is not registered as a doctor. Please use patient login.');
        setLoading(false);
        return;
      }
      
      if (loginType === 'admin' && userRole !== 'admin') {
        setError('This account is not registered as an admin. Access denied.');
        setLoading(false);
        return;
      }

      if (loginType === 'staff' && userRole !== 'staff') {
        setError('This account is not registered as staff. Access denied.');
        setLoading(false);
        return;
      }

      // Successful login - redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <Link to="/" className="flex justify-center items-center space-x-2 mb-2">
            <HeartPulse className="w-12 h-12 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">Chikitsamitra</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {loginType === 'doctor'
              ? 'Doctor Login'
              : loginType === 'admin'
              ? 'Admin Login'
              : 'Staff Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {loginType === 'doctor'
              ? 'Access your doctor dashboard'
              : loginType === 'admin'
              ? 'Administrative access only'
              : 'Front desk staff can book appointments for patients'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="bg-white rounded-lg p-1 shadow-md">
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setLoginType('doctor')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                loginType === 'doctor'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span className="font-medium">Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                loginType === 'admin'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginType('staff')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                loginType === 'staff'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Staff</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>Email Address</span>
                </div>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span>Password</span>
                </div>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-base"
            >
              {loading
                ? 'Signing in...'
                : `Sign in as ${
                    loginType === 'doctor'
                      ? 'Doctor'
                      : loginType === 'admin'
                      ? 'Admin'
                      : 'Staff'
                  }`}
            </button>
          </form>

          {/* Back to Patient Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Patient Login
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {loginType === 'doctor'
              ? 'Doctor accounts are created by administrators'
              : loginType === 'admin'
              ? 'Admin access is restricted to authorized personnel only'
              : 'Staff accounts are managed by hospital administration'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorAdminLogin;
