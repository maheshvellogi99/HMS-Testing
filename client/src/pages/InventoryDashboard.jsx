import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import api from '../services/api';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Package,
  Bed,
  Activity,
  Droplet,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  LogOut
} from 'lucide-react';

const InventoryDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    occupiedBeds: 0,
    occupiedICU: 0,
    occupiedEmergencyWards: 0,
    inUseOxygenCylinders: 0
  });

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory');
      setInventory(response.data.data);
      
      // Update form with current values
      setFormData({
        occupiedBeds: response.data.data.occupiedBeds,
        occupiedICU: response.data.data.occupiedICU,
        occupiedEmergencyWards: response.data.data.occupiedEmergencyWards,
        inUseOxygenCylinders: response.data.data.inUseOxygenCylinders
      });
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Update inventory
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const response = await api.put('/inventory', formData);

      setInventory(response.data.data);
      setSuccess('Inventory updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update inventory');
    } finally {
      setUpdating(false);
    }
  };

  // Chart colors
  const COLORS = {
    beds: ['#3B82F6', '#DBEAFE'],
    icu: ['#EF4444', '#FEE2E2'],
    emergency: ['#F97316', '#FFEDD5'],
    oxygen: ['#06B6D4', '#CFFAFE']
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">No inventory data available</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const bedsData = [
    { name: 'Occupied', value: inventory.occupiedBeds },
    { name: 'Available', value: inventory.availableBeds }
  ];

  const icuData = [
    { name: 'Occupied', value: inventory.occupiedICU },
    { name: 'Available', value: inventory.availableICU }
  ];

  const emergencyData = [
    { name: 'Occupied', value: inventory.occupiedEmergencyWards },
    { name: 'Available', value: inventory.availableEmergencyWards }
  ];

  const oxygenData = [
    { name: 'In Use', value: inventory.inUseOxygenCylinders },
    { name: 'Available', value: inventory.availableOxygenCylinders }
  ];

  const comparisonData = [
    { name: 'Beds', occupancy: parseFloat(inventory.bedOccupancyPercentage) },
    { name: 'ICU', occupancy: parseFloat(inventory.icuOccupancyPercentage) },
    { name: 'Emergency', occupancy: parseFloat(inventory.emergencyWardOccupancyPercentage) },
    { name: 'Oxygen', occupancy: parseFloat(inventory.oxygenCylinderUsagePercentage) }
  ];

  const isManager = user?.role === 'inventoryManager' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <Package className="w-8 h-8 text-indigo-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(inventory.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchInventory}
                className="flex items-center space-x-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Beds Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-md border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <Bed className="w-10 h-10 text-blue-600" />
              <span className="text-3xl font-bold text-blue-900">
                {inventory.occupiedBeds}/{inventory.totalBeds}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-1">Beds</h3>
            <p className="text-sm text-blue-700">
              {inventory.bedOccupancyPercentage}% Occupied
            </p>
            <div className="mt-3 bg-white rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${inventory.bedOccupancyPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* ICU Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-md border border-red-200">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-10 h-10 text-red-600" />
              <span className="text-3xl font-bold text-red-900">
                {inventory.occupiedICU}/{inventory.totalICU}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-1">ICU</h3>
            <p className="text-sm text-red-700">
              {inventory.icuOccupancyPercentage}% Occupied
            </p>
            <div className="mt-3 bg-white rounded-full h-2 overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-300"
                style={{ width: `${inventory.icuOccupancyPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Emergency Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-md border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-10 h-10 text-orange-600" />
              <span className="text-3xl font-bold text-orange-900">
                {inventory.occupiedEmergencyWards}/{inventory.totalEmergencyWards}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-orange-900 mb-1">Emergency</h3>
            <p className="text-sm text-orange-700">
              {inventory.emergencyWardOccupancyPercentage}% Occupied
            </p>
            <div className="mt-3 bg-white rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-600 h-full transition-all duration-300"
                style={{ width: `${inventory.emergencyWardOccupancyPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Oxygen Card */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 shadow-md border border-cyan-200">
            <div className="flex items-center justify-between mb-4">
              <Droplet className="w-10 h-10 text-cyan-600" />
              <span className="text-3xl font-bold text-cyan-900">
                {inventory.inUseOxygenCylinders}/{inventory.totalOxygenCylinders}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-cyan-900 mb-1">Oxygen</h3>
            <p className="text-sm text-cyan-700">
              {inventory.oxygenCylinderUsagePercentage}% In Use
            </p>
            <div className="mt-3 bg-white rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-600 h-full transition-all duration-300"
                style={{ width: `${inventory.oxygenCylinderUsagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Beds Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Beds Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bedsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label
                >
                  {bedsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.beds[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ICU Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">ICU Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={icuData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label
                >
                  {icuData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.icu[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Emergency Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Emergency Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={emergencyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label
                >
                  {emergencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.emergency[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Oxygen Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Oxygen Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={oxygenData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label
                >
                  {oxygenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.oxygen[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Overall Occupancy Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupancy" fill="#6366F1" name="Occupancy %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Update Form (Inventory Manager Only) */}
        {isManager && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Update Inventory</h3>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupied Beds (Max: {inventory.totalBeds})
                </label>
                <input
                  type="number"
                  min="0"
                  max={inventory.totalBeds}
                  value={formData.occupiedBeds}
                  onChange={(e) => setFormData({ ...formData, occupiedBeds: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupied ICU (Max: {inventory.totalICU})
                </label>
                <input
                  type="number"
                  min="0"
                  max={inventory.totalICU}
                  value={formData.occupiedICU}
                  onChange={(e) => setFormData({ ...formData, occupiedICU: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupied Emergency (Max: {inventory.totalEmergencyWards})
                </label>
                <input
                  type="number"
                  min="0"
                  max={inventory.totalEmergencyWards}
                  value={formData.occupiedEmergencyWards}
                  onChange={(e) => setFormData({ ...formData, occupiedEmergencyWards: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oxygen in Use (Max: {inventory.totalOxygenCylinders})
                </label>
                <input
                  type="number"
                  min="0"
                  max={inventory.totalOxygenCylinders}
                  value={formData.inUseOxygenCylinders}
                  onChange={(e) => setFormData({ ...formData, inUseOxygenCylinders: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Update Inventory
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
