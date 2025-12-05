// Email template for 24-hour appointment reminder
const dayBeforeReminderTemplate = (patientName, doctorName, appointmentDate, appointmentTime, reason) => {
  return `
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
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
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
    .reminder-box {
      background: white;
      border-left: 4px solid #6366f1;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .appointment-details {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .detail-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: bold;
      color: #6366f1;
      width: 150px;
    }
    .detail-value {
      color: #4b5563;
    }
    .tips {
      background: #fef3c7;
      border: 1px solid #fbbf24;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .tips h3 {
      margin-top: 0;
      color: #92400e;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background: #6366f1;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔔 Appointment Reminder</h1>
    <p>Your appointment is tomorrow!</p>
  </div>
  
  <div class="content">
    <p>Dear ${patientName},</p>
    
    <div class="reminder-box">
      <h2 style="color: #6366f1; margin-top: 0;">⏰ Your appointment is in 24 hours!</h2>
      <p>This is a friendly reminder about your upcoming appointment with <strong>Dr. ${doctorName}</strong>.</p>
    </div>
    
    <div class="appointment-details">
      <h3 style="color: #4b5563; margin-top: 0;">📋 Appointment Details</h3>
      <div class="detail-row">
        <span class="detail-label">👨‍⚕️ Doctor:</span>
        <span class="detail-value">Dr. ${doctorName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">📅 Date:</span>
        <span class="detail-value">${appointmentDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">🕐 Time:</span>
        <span class="detail-value">${appointmentTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">📝 Reason:</span>
        <span class="detail-value">${reason}</span>
      </div>
    </div>
    
    <div class="tips">
      <h3>💡 Important Reminders:</h3>
      <ul>
        <li>Please arrive 10 minutes before your appointment time</li>
        <li>Bring any previous medical reports or prescriptions</li>
        <li>Carry a valid ID proof</li>
        <li>If you need to cancel or reschedule, please inform us at least 4 hours in advance</li>
      </ul>
    </div>
    
    <center>
      <a href="http://localhost:5173/patient/appointments" class="button">View Appointment Details</a>
    </center>
    
    <p style="margin-top: 30px;">If you have any questions or need to reschedule, please contact us.</p>
    
    <p>We look forward to seeing you!</p>
    
    <p style="margin-top: 20px;">
      Best regards,<br>
      <strong>ChikitsaMitra Hospitals</strong><br>
      Your Health is Our Priority
    </p>
  </div>
  
  <div class="footer">
    <p>© 2024 ChikitsaMitra Hospitals. All rights reserved.</p>
    <p>This is an automated reminder email. Please do not reply to this email.</p>
  </div>
</body>
</html>
  `;
};

// Email template for 1-hour appointment reminder
const hourBeforeReminderTemplate = (patientName, doctorName, appointmentDate, appointmentTime, reason) => {
  return `
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
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
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
    .urgent-reminder {
      background: #fef3c7;
      border: 3px solid #f59e0b;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
    }
    .urgent-reminder h2 {
      color: #92400e;
      margin-top: 0;
      font-size: 24px;
    }
    .countdown {
      background: white;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
      font-size: 20px;
      font-weight: bold;
      color: #f59e0b;
    }
    .appointment-details {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .detail-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: bold;
      color: #f59e0b;
      width: 150px;
    }
    .detail-value {
      color: #4b5563;
    }
    .action-box {
      background: #fef2f2;
      border: 2px solid #ef4444;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .action-box h3 {
      margin-top: 0;
      color: #991b1b;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background: #f59e0b;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚡ URGENT REMINDER</h1>
    <p>Your appointment is in 1 hour!</p>
  </div>
  
  <div class="content">
    <p>Dear ${patientName},</p>
    
    <div class="urgent-reminder">
      <h2>🚨 Your appointment is starting soon!</h2>
      <div class="countdown">⏰ In approximately 1 hour</div>
      <p style="margin: 0; font-size: 16px;">Please start getting ready!</p>
    </div>
    
    <div class="appointment-details">
      <h3 style="color: #4b5563; margin-top: 0;">📋 Appointment Details</h3>
      <div class="detail-row">
        <span class="detail-label">👨‍⚕️ Doctor:</span>
        <span class="detail-value">Dr. ${doctorName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">📅 Date:</span>
        <span class="detail-value">${appointmentDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">🕐 Time:</span>
        <span class="detail-value">${appointmentTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">📝 Reason:</span>
        <span class="detail-value">${reason}</span>
      </div>
    </div>
    
    <div class="action-box">
      <h3>✅ Before You Leave:</h3>
      <ul style="margin: 10px 0;">
        <li>Gather all relevant medical documents</li>
        <li>Bring your ID proof</li>
        <li>Check traffic/route to the hospital</li>
        <li>Arrive 10 minutes early</li>
      </ul>
    </div>
    
    <center>
      <a href="http://localhost:5173/patient/appointments" class="button">View Full Details</a>
    </center>
    
    <p style="margin-top: 30px; font-weight: bold; color: #dc2626;">
      ⚠️ If you cannot make it, please call us immediately to avoid no-show charges.
    </p>
    
    <p style="margin-top: 20px;">
      Best regards,<br>
      <strong>ChikitsaMitra Hospitals</strong><br>
      Your Health is Our Priority
    </p>
  </div>
  
  <div class="footer">
    <p>© 2024 ChikitsaMitra Hospitals. All rights reserved.</p>
    <p>This is an automated reminder email. Please do not reply to this email.</p>
  </div>
</body>
</html>
  `;
};

module.exports = {
  dayBeforeReminderTemplate,
  hourBeforeReminderTemplate
};
