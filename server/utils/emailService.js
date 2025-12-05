const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App Password, not regular password
    },
  });
};

// Send appointment confirmation email
const sendAppointmentConfirmation = async (appointmentData) => {
  try {
    const transporter = createTransporter();

    const {
      patientEmail,
      patientName,
      doctorName,
      date,
      time,
      reason,
      status,
      consultationFee,
      advancePaidAmount,
      remainingAmount,
    } = appointmentData;

    const fee = typeof consultationFee === 'number' ? consultationFee : null;
    const advance = typeof advancePaidAmount === 'number' ? advancePaidAmount : null;
    const remaining = typeof remainingAmount === 'number'
      ? remainingAmount
      : fee !== null && advance !== null
        ? Math.max(fee - advance, 0)
        : null;

    const mailOptions = {
      from: `"Chikitsamitra Hospital" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: '✅ Appointment Confirmation - Chikitsamitra Hospital',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .card {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #6b7280;
            }
            .value {
              color: #1f2937;
              font-weight: 500;
            }
            .status {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              background: #dbeafe;
              color: #1e40af;
              font-size: 14px;
              font-weight: 500;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
              margin-top: 20px;
            }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏥 Appointment Confirmed!</h1>
          </div>
          
          <div class="content">
            <p>Dear <strong>${patientName}</strong>,</p>
            
            <p>Your appointment has been successfully booked at <strong>Chikitsamitra Hospital</strong>.</p>
            
            <div class="card">
              <h2 style="margin-top: 0; color: #667eea;">📋 Appointment Details</h2>
              
              <div class="detail-row">
                <span class="label">Doctor:</span>
                <span class="value">${doctorName}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">📅 ${date}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">🕐 ${time}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Status:</span>
                <span class="status">${status}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Reason:</span>
                <span class="value">${reason}</span>
              </div>
            </div>

            ${
              fee !== null
                ? `
            <div class="card">
              <h2 style="margin-top: 0; color: #047857;">💳 Payment Details</h2>
              <div class="detail-row">
                <span class="label">Consultation Fee:</span>
                <span class="value">₹${fee}</span>
              </div>
              ${
                advance !== null
                  ? `<div class="detail-row">
                <span class="label">Amount Paid Now (50%):</span>
                <span class="value">₹${advance}</span>
              </div>`
                  : ''
              }
              ${
                remaining !== null
                  ? `<div class="detail-row">
                <span class="label">Remaining to Pay at Hospital:</span>
                <span class="value">₹${remaining}</span>
              </div>`
                  : ''
              }
            </div>
            `
                : ''
            }
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <strong>⚕️ Important Notes:</strong>
              <ul style="margin: 10px 0;">
                <li>Please arrive 10 minutes before your scheduled time</li>
                <li>Bring any previous medical records if available</li>
                <li>Remember to bring a valid ID</li>
              </ul>
            </div>
            
            <p style="text-align: center;">
              <a href="http://localhost:5173/patient/appointments" class="btn">View My Appointments</a>
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Chikitsamitra Hospital</strong></p>
            <p>Best Hospital in India | Expert Medical Care</p>
            <p style="font-size: 12px; color: #9ca3af;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Appointment confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending appointment confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send prescription and payment receipt email
const sendPrescriptionAndReceipt = async (appointmentData) => {
  try {
    const transporter = createTransporter();

    const {
      patientEmail,
      patientName,
      doctorName,
      doctorEmail,
      date,
      time,
      diagnosis,
      medicines,
      consultationFee,
      paymentMethod,
      paidAt,
    } = appointmentData;

    // Format medicines list
    const medicinesHtml = medicines
      .map(
        (med) => `
        <div style="background: white; padding: 15px; border-radius: 6px; margin: 10px 0; border: 1px solid #e5e7eb;">
          <div style="font-weight: bold; color: #1f2937; margin-bottom: 8px;">💊 ${med.name}</div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 14px; color: #6b7280;">
            <div><strong>Dosage:</strong> ${med.dosage}</div>
            <div><strong>Frequency:</strong> ${med.frequency}</div>
            <div><strong>Duration:</strong> ${med.duration}</div>
            ${med.instructions ? `<div style="grid-column: 1 / -1;"><strong>Instructions:</strong> ${med.instructions}</div>` : ''}
          </div>
        </div>
      `
      )
      .join('');

    const mailOptions = {
      from: `"Chikitsamitra Hospital" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: '📄 Prescription & Payment Receipt - Chikitsamitra Hospital',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .card {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #6b7280;
            }
            .value {
              color: #1f2937;
              font-weight: 500;
            }
            .section-title {
              color: #059669;
              margin-top: 0;
              font-size: 20px;
              border-bottom: 2px solid #10b981;
              padding-bottom: 10px;
            }
            .diagnosis-box {
              background: #d1fae5;
              padding: 15px;
              border-radius: 8px;
              margin: 15px 0;
              border-left: 4px solid #10b981;
            }
            .total-amount {
              background: #fef3c7;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
              border: 2px solid #f59e0b;
            }
            .paid-badge {
              display: inline-block;
              padding: 6px 16px;
              background: #10b981;
              color: white;
              border-radius: 20px;
              font-weight: bold;
              margin-left: 10px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Payment Successful!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your prescription and receipt are ready</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${patientName}</strong>,</p>
            
            <p>Thank you for your payment. Your consultation with <strong>Dr. ${doctorName}</strong> has been completed successfully.</p>
            
            <!-- Appointment Details -->
            <div class="card">
              <h2 class="section-title">📋 Appointment Information</h2>
              
              <div class="detail-row">
                <span class="label">Doctor:</span>
                <span class="value">Dr. ${doctorName}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${doctorEmail}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">📅 ${date}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">🕐 ${time}</span>
              </div>
            </div>
            
            <!-- Prescription -->
            <div class="card">
              <h2 class="section-title">💊 Prescription</h2>
              
              <div class="diagnosis-box">
                <strong style="color: #059669;">Diagnosis:</strong>
                <div style="margin-top: 8px; font-size: 16px;">${diagnosis}</div>
              </div>
              
              <h3 style="color: #6b7280; font-size: 16px; margin: 20px 0 10px 0;">Prescribed Medicines:</h3>
              ${medicinesHtml}
            </div>
            
            <!-- Billing -->
            <div class="card">
              <h2 class="section-title">💳 Payment Details</h2>
              
              <div class="total-amount">
                <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Consultation Fee</div>
                <div style="font-size: 32px; font-weight: bold; color: #1f2937;">
                  ₹${consultationFee}
                  <span class="paid-badge">PAID</span>
                </div>
              </div>
              
              <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">${paymentMethod || 'Online Payment'}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Payment Date:</span>
                <span class="value">${new Date(paidAt).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Status:</span>
                <span style="color: #10b981; font-weight: bold;">✓ Payment Successful</span>
              </div>
            </div>
            
            <!-- Important Notes -->
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <strong>⚕️ Important Instructions:</strong>
              <ul style="margin: 10px 0;">
                <li>Take medicines as prescribed by the doctor</li>
                <li>Complete the full course of medication</li>
                <li>Keep this prescription for your records</li>
                <li>Contact your doctor if you experience any side effects</li>
              </ul>
            </div>
            
            <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
              For any queries, please contact us or visit your patient portal.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Chikitsamitra Hospital</strong></p>
            <p>Best Hospital in India | Expert Medical Care</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
              This is an automated email. Please do not reply to this message.<br>
              For support, contact: support@chikitsamitra.com
            </p>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Prescription and receipt email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending prescription email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendPrescriptionAndReceipt,
};
