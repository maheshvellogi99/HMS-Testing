import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, ArrowLeft, Calendar, User } from 'lucide-react';
import jsPDF from 'jspdf';
import api from '../../services/api';

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get('/appointments');
        const appointments = response.data.data || [];

        const prescriptionRecords = appointments
          .filter(
            (apt) =>
              apt.status === 'completed' &&
              apt.prescription &&
              apt.prescription.diagnosis &&
              apt.billing &&
              apt.billing.isPaid
          )
          .map((apt) => ({
            id: apt._id,
            type: 'Prescription',
            title: `Prescription from ${apt.doctor?.name || 'Doctor'}`,
            doctor: apt.doctor?.name || 'Doctor',
            date: apt.date,
            description: apt.prescription.diagnosis || 'Prescription details',
            appointment: apt,
          }));

        setRecords(prescriptionRecords);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Lab Report':
        return 'bg-blue-100 text-blue-800';
      case 'Prescription':
        return 'bg-green-100 text-green-800';
      case 'Imaging':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (record) => {
    try {
      const doc = new jsPDF();

      const appointment = record.appointment || {};
      const prescription = appointment.prescription || {};
      const medicines = prescription.medicines || [];

      const patientName = appointment.patient?.name || 'Patient';
      const doctorName = appointment.doctor?.name || record.doctor || 'Doctor';

      const dateSource = appointment.date || record.date;
      const dateObj = dateSource ? new Date(dateSource) : null;
      const dateStr = dateObj ? dateObj.toLocaleDateString() : 'N/A';
      const timeStr = appointment.time || 'N/A';

      let y = 20;

      // Header
      doc.setFontSize(18);
      doc.text('Chikitsamitra Hospital', 105, y, { align: 'center' });
      y += 10;

      doc.setFontSize(14);
      doc.text('Prescription', 105, y, { align: 'center' });
      y += 15;

      // Patient & doctor details
      doc.setFontSize(11);
      doc.text(`Patient: ${patientName}`, 20, y);
      y += 7;
      doc.text(`Doctor: ${doctorName}`, 20, y);
      y += 7;
      doc.text(`Date: ${dateStr}   Time: ${timeStr}`, 20, y);
      y += 12;

      // Diagnosis
      doc.setFontSize(12);
      doc.text('Diagnosis:', 20, y);
      y += 7;

      const diagnosisText = prescription.diagnosis || record.description || 'N/A';
      const diagnosisLines = doc.splitTextToSize(diagnosisText, 170);
      doc.text(diagnosisLines, 20, y);
      y += diagnosisLines.length * 7 + 5;

      // Medicines
      doc.text('Medicines:', 20, y);
      y += 7;

      if (!medicines.length) {
        doc.text('- No medicines specified', 25, y);
        y += 7;
      } else {
        medicines.forEach((med) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }

          const line = `${med.name || ''} | Dosage: ${med.dosage || ''} | Frequency: ${
            med.frequency || ''
          } | Duration: ${med.duration || ''}`;
          doc.text(`• ${line}`, 25, y);
          y += 6;

          if (med.instructions) {
            const instLines = doc.splitTextToSize(`Instructions: ${med.instructions}`, 160);
            doc.text(instLines, 30, y);
            y += instLines.length * 6;
          }
        });
      }

      // Footer
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.text('Generated from Chikitsamitra Patient Portal', 105, y + 10, { align: 'center' });

      const safePatient = patientName.replace(/[^a-z0-9]/gi, '_');
      const safeDate = dateStr.replace(/[^0-9]/g, '-');
      const fileName = `Prescription_${safePatient || 'patient'}_${safeDate || 'date'}.pdf`;

      doc.save(fileName);
    } catch (error) {
      console.error('Error generating prescription PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/patient')}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{records.length}</p>
              </div>
              <FileText className="w-10 h-10 text-primary-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Lab Reports</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {records.filter((r) => r.type === 'Lab Report').length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {records.filter((r) => r.type === 'Prescription').length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Records</h2>
          {loading ? (
            <div className="card text-center py-12">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Loading your medical records...</p>
            </div>
          ) : records.length > 0 ? (
            records.map((record) => (
              <div key={record.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {record.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            record.type
                          )}`}
                        >
                          {record.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{record.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{record.doctor}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(record)}
                      className="btn btn-secondary flex items-center space-x-1 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Medical Records
              </h3>
              <p className="text-gray-600">
                Your medical records will appear here once you have consultations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
