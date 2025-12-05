import { 
  Heart, 
  Brain, 
  Activity, 
  Bone, 
  Baby, 
  Stethoscope,
  Droplet,
  Eye,
  Ear,
  Syringe,
  Pill,
  HeartPulse
} from 'lucide-react';

// Map department names to icons
export const departmentIcons = {
  'Cardiology': Heart,
  'Neurology': Brain,
  'Oncology': Activity,
  'Orthopedic': Bone,
  'Orthopedics': Bone,
  'Mother & Child': Baby,
  'Pediatrics': Baby,
  'Gastro': Stethoscope,
  'Gastroenterology': Stethoscope,
  'Critical Care': HeartPulse,
  'Nephrology': Droplet,
  'Ophthalmology': Eye,
  'ENT': Ear,
  'Dermatology': Activity,
  'General Medicine': Stethoscope,
  'Surgery': Syringe,
  'Pharmacy': Pill
};

// Get icon component for a department
export const getDepartmentIcon = (departmentName) => {
  const IconComponent = departmentIcons[departmentName] || Stethoscope;
  return IconComponent;
};

// Department colors for visual variety
export const departmentColors = {
  'Cardiology': 'from-red-50 to-red-100 border-red-200',
  'Neurology': 'from-purple-50 to-purple-100 border-purple-200',
  'Oncology': 'from-pink-50 to-pink-100 border-pink-200',
  'Orthopedic': 'from-blue-50 to-blue-100 border-blue-200',
  'Orthopedics': 'from-blue-50 to-blue-100 border-blue-200',
  'Mother & Child': 'from-rose-50 to-rose-100 border-rose-200',
  'Pediatrics': 'from-rose-50 to-rose-100 border-rose-200',
  'Gastro': 'from-green-50 to-green-100 border-green-200',
  'Gastroenterology': 'from-green-50 to-green-100 border-green-200',
  'Critical Care': 'from-orange-50 to-orange-100 border-orange-200',
  'Nephrology': 'from-cyan-50 to-cyan-100 border-cyan-200',
  'Ophthalmology': 'from-indigo-50 to-indigo-100 border-indigo-200',
  'ENT': 'from-yellow-50 to-yellow-100 border-yellow-200',
  'Dermatology': 'from-teal-50 to-teal-100 border-teal-200',
  'General Medicine': 'from-gray-50 to-gray-100 border-gray-200',
  'Surgery': 'from-red-50 to-red-100 border-red-200',
  'Pharmacy': 'from-green-50 to-green-100 border-green-200'
};

export const getDepartmentColor = (departmentName) => {
  return departmentColors[departmentName] || 'from-indigo-50 to-indigo-100 border-indigo-200';
};
