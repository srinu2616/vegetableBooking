const transporter = require('../config/email');

const sendOrderConfirmation = async (order, user) => {
    try {
        const mailOptions = {
            from: `"HarvestHub" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: `Order Confirmation - Order #${order._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #16a34a;">Order Confirmed!</h1>
                        <p style="color: #555;">Thank you for your purchase, ${user.name}.</p>
                    </div>

                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        <p><strong>Shipping Address:</strong><br/>
                        ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
                    </div>

                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${order.items.map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px 0;">
                                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                                </td>
                                <td style="padding: 10px;">
                                    <strong>${item.name}</strong><br/>
                                    <span style="color: #777;">₹${item.price} x ${item.quantity}</span>
                                </td>
                                <td style="padding: 10px; text-align: right;">
                                    <strong>₹${(item.price * item.quantity).toFixed(2)}</strong>
                                </td>
                            </tr>
                        `).join('')}
                    </table>

                    <div style="text-align: right; margin-top: 20px;">
                        <p style="font-size: 18px;"><strong>Total: <span style="color: #16a34a;">₹${order.totalPrice.toFixed(2)}</span></strong></p>
                    </div>

                    <div style="text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #888; font-size: 12px;">
                        <p>&copy; ${new Date().getFullYear()} HarvestHub. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        console.log(`Attempting to send email to ${user.email} from ${process.env.SENDER_EMAIL}`);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: %s', info.messageId);
        return true;
    } catch (error) {
        console.error("FAILED to send email: ", error);
        return false;
    }
};

module.exports = sendOrderConfirmation;
