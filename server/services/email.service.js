const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendPasswordResetEmail = async (toEmail, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'LabKoTo - Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #070B20;">Password Reset Request</h2>
                <p>You are receiving this email because you requested a password reset for your LabKoTo account.</p>
                <p>Please click the button below to set a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Reset Password
                    </a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #555;">${resetUrl}</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #777;">
                    If you did not request this reset, please ignore this email. Your password will remain unchanged. 
                    This link will expire in 1 hour.
                </p>
            </div>
        `
    };

    // Send the email
    return await transporter.sendMail(mailOptions);
};

exports.sendConfirmationEmail = async (userEmail, reservationDetails) => {
    try {
        const mailOptions = {
            from: `"Lab Reservation System" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Lab Reservation Confirmed! 🚀',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1F2234;">
                    <h2 style="color: #3B82F6;">Reservation Confirmed!</h2>
                    <p>Here are the details of your upcoming laboratory session:</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <ul style="list-style-type: none; padding: 0; margin: 0;">
                            <li style="margin-bottom: 12px;"><strong>Laboratory:</strong> ${reservationDetails.laboratory}</li>
                            <li style="margin-bottom: 12px;"><strong>Date:</strong> ${reservationDetails.rawDate}</li>
                            <li style="margin-bottom: 12px;"><strong>Time:</strong> ${reservationDetails.reservationTime}</li>
                            <li><strong>🪑 Seats:</strong> ${reservationDetails.seats}</li>
                        </ul>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 14px; color: #666;">
                        Please ensure you arrive on time. You can manage or cancel this booking directly from your My Reservations dashboard.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        //console.log('Confirmation email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return false;
    }
};

exports.sendUpdateEmail = async (userEmail, reservationDetails) => {
    try {
        const mailOptions = {
            from: `"Lab Reservation System" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Reservation Updated 🔄',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1F2234;">
                    <h2 style="color: #F59E0B;">Reservation Updated!</h2>
                    <p>Your laboratory reservation has been successfully modified. Here are your updated details:</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <ul style="list-style-type: none; padding: 0; margin: 0;">
                            <li style="margin-bottom: 12px;"><strong>Laboratory:</strong> ${reservationDetails.laboratory}</li>
                            <li style="margin-bottom: 12px;"><strong>Date:</strong> ${reservationDetails.rawDate}</li>
                            <li style="margin-bottom: 12px;"><strong>Time:</strong> ${reservationDetails.reservationTime}</li>
                            <li><strong>🪑 New Seat List:</strong> ${reservationDetails.seats}</li>
                        </ul>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 14px; color: #666;">
                        If you did not make this change, please log in to your account immediately.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        //console.log('Update email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending update email:', error);
        return false;
    }
};