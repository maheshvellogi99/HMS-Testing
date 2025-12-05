// Predefined departments/specializations
// These map to doctor's specialization field in database
export const departments = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Heart and cardiovascular care specialists',
    icon: 'Heart',
    color: 'from-red-50 to-red-100 border-red-200',
    // Matching keywords for doctor specialization
    keywords: ['cardiology', 'cardiologist', 'cardiac', 'heart']
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Brain and nervous system specialists',
    icon: 'Brain',
    color: 'from-purple-50 to-purple-100 border-purple-200',
    // Matching keywords for doctor specialization
    keywords: ['neurology', 'neurologist', 'neuro', 'brain']
  },
  {
    id: 'oncology',
    name: 'Oncology',
    description: 'Cancer treatment and care specialists',
    icon: 'Activity',
    color: 'from-pink-50 to-pink-100 border-pink-200'
  },
  {
    id: 'orthopedic',
    name: 'Orthopedic',
    description: 'Bone, joint and muscle specialists',
    icon: 'Bone',
    color: 'from-blue-50 to-blue-100 border-blue-200'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Children\'s health specialists',
    icon: 'Baby',
    color: 'from-rose-50 to-rose-100 border-rose-200'
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    description: 'Digestive system specialists',
    icon: 'Stethoscope',
    color: 'from-green-50 to-green-100 border-green-200'
  },
  {
    id: 'critical-care',
    name: 'Critical Care',
    description: 'Emergency and intensive care specialists',
    icon: 'HeartPulse',
    color: 'from-orange-50 to-orange-100 border-orange-200'
  },
  {
    id: 'nephrology',
    name: 'Nephrology',
    description: 'Kidney and urinary system specialists',
    icon: 'Droplet',
    color: 'from-cyan-50 to-cyan-100 border-cyan-200'
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    description: 'Eye care specialists',
    icon: 'Eye',
    color: 'from-indigo-50 to-indigo-100 border-indigo-200'
  },
  {
    id: 'ent',
    name: 'ENT',
    description: 'Ear, Nose and Throat specialists',
    icon: 'Ear',
    color: 'from-yellow-50 to-yellow-100 border-yellow-200'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin care specialists',
    icon: 'Activity',
    color: 'from-teal-50 to-teal-100 border-teal-200'
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    description: 'Primary care physicians',
    icon: 'Stethoscope',
    color: 'from-gray-50 to-gray-100 border-gray-200'
  },
  {
    id: 'surgery',
    name: 'Surgery',
    description: 'Surgical specialists',
    icon: 'Syringe',
    color: 'from-red-50 to-red-100 border-red-200'
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    description: 'Mental health specialists',
    icon: 'Brain',
    color: 'from-violet-50 to-violet-100 border-violet-200'
  },
  {
    id: 'radiology',
    name: 'Radiology',
    description: 'Medical imaging specialists',
    icon: 'Activity',
    color: 'from-blue-50 to-blue-100 border-blue-200'
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology',
    description: 'Lung and respiratory specialists',
    icon: 'HeartPulse',
    color: 'from-sky-50 to-sky-100 border-sky-200'
  },
  {
    id: 'gynecology',
    name: 'Gynecology',
    description: 'Women\'s health specialists',
    icon: 'Baby',
    color: 'from-pink-50 to-pink-100 border-pink-200'
  },
  {
    id: 'urology',
    name: 'Urology',
    description: 'Urinary tract specialists',
    icon: 'Droplet',
    color: 'from-blue-50 to-blue-100 border-blue-200'
  }
];

// Helper to get department by ID
export const getDepartmentById = (id) => {
  return departments.find(dept => dept.id === id);
};

// Helper to get department by name (case-insensitive)
export const getDepartmentByName = (name) => {
  return departments.find(dept => 
    dept.name.toLowerCase() === name.toLowerCase()
  );
};
