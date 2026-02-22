const transporter = require('../config/email');

const sendEmail = async ({ to, subject, message }) => {
    try {
        const mailOptions = {
            from: `"VegetablesHub" <${process.env.SENDER_EMAIL}>`,
            to,
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #16a34a;">VegetablesHub Response</h1>
                    </div>

                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="color: #333; line-height: 1.6;">
                            ${message.replace(/\n/g, '<br/>')}
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #888; font-size: 12px;">
                        <p>This is a reply to your inquiry from the HarvestHub website.</p>
                        <p>&copy; ${new Date().getFullYear()} HarvestHub. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Reply email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error("FAILED to send reply email: ", error);
        throw error;
    }
};

module.exports = sendEmail;
