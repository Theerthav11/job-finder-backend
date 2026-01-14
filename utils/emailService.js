const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email utility
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send application shortlist email
 */
const sendShortlistEmail = async (employee, job) => {
  const subject = 'Application Shortlisted';
  const html = `
    <p>Hi ${employee.fullname},</p>
    <p>Your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been shortlisted.</p>
    <br/>
    <p>For further information, please contact:</p>
    <p>
      <strong>Phone:</strong> ${job.phone}<br/>
      <strong>WhatsApp:</strong> ${job.whatsapp}
    </p>
    <br/>
    <p>Best regards,<br/>Job Finder Team</p>
  `;

  return await sendEmail(employee.email, subject, html);
};

/**
 * Verify transporter configuration
 */
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendShortlistEmail,
  verifyEmailConfig,
  transporter
};
