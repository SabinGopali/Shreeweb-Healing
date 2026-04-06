import Booking from '../models/Booking.model.js';
import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create booking from Shopify order
export const createBookingFromOrder = async (orderData) => {
  try {
    const {
      id,
      order_number,
      email,
      customer,
      line_items,
      total_price,
      currency,
      checkout_token,
    } = orderData;

    // Get first line item (assuming single product per order for bookings)
    const lineItem = line_items[0];

    const booking = new Booking({
      shopifyOrderId: String(id),
      shopifyOrderNumber: order_number,
      checkoutToken: checkout_token,
      customerEmail: email,
      customerName: customer
        ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
        : 'Customer',
      customerPhone: customer?.phone || orderData.phone,
      productTitle: lineItem.title,
      productVariant: lineItem.variant_title,
      productSku: lineItem.sku,
      orderTotal: parseFloat(total_price),
      currency: currency,
      paymentStatus: 'paid',
      paidAt: new Date(),
      bookingStatus: 'pending',
    });

    await booking.save();
    console.log('✅ Booking created:', booking._id);

    return booking;
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    throw error;
  }
};

// Get booking by order ID
export const getBookingByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const booking = await Booking.findOne({
      $or: [
        { shopifyOrderId: orderId },
        { shopifyOrderNumber: parseInt(orderId) || 0 },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message,
    });
  }
};

// Update booking with calendar selection
export const updateBookingSchedule = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { bookingDate, bookingTime, bookingTimezone, bookingNotes } = req.body;

    const booking = await Booking.findOne({
      $or: [
        { shopifyOrderId: orderId },
        { shopifyOrderNumber: parseInt(orderId) || 0 },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update booking details
    booking.bookingDate = bookingDate;
    booking.bookingTime = bookingTime;
    booking.bookingTimezone = bookingTimezone;
    booking.bookingNotes = bookingNotes;
    booking.bookingStatus = 'confirmed';

    await booking.save();

    // Send confirmation email
    await sendBookingConfirmationEmail(booking);

    res.status(200).json({
      success: true,
      message: 'Booking scheduled successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message,
    });
  }
};

// Send booking confirmation email
async function sendBookingConfirmationEmail(booking) {
  try {
    const formattedDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f7f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Your Session is Confirmed!</h1>
    </div>

    <div style="background: white; padding: 32px 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #1c1917;">Hello ${booking.customerName},</h2>
        <p style="margin: 0; color: #44403c; line-height: 1.6;">
          Your ${booking.productTitle} has been confirmed! We're looking forward to connecting with you.
        </p>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #F59E0B; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
        <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #92400E;">Session Details</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 14px;">Date:</td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: 500;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 14px;">Time:</td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: 500;">${booking.bookingTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 14px;">Timezone:</td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: 500;">${booking.bookingTimezone || 'Your local time'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 14px;">Session Type:</td>
            <td style="padding: 8px 0; color: #1c1917; font-weight: 500;">${booking.productTitle}</td>
          </tr>
        </table>
      </div>

      ${
        booking.bookingNotes
          ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1c1917; margin: 0 0 8px 0;">Your Notes</h3>
        <p style="color: #44403c; line-height: 1.6; margin: 0;">${booking.bookingNotes}</p>
      </div>
      `
          : ''
      }

      <div style="background: #f5f5f4; padding: 20px; border-radius: 8px; margin-top: 24px;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1c1917;">What to Expect</h3>
        <ul style="margin: 0; padding-left: 20px; color: #44403c; line-height: 1.8;">
          <li>You'll receive a reminder email 24 hours before your session</li>
          <li>Please be in a quiet, comfortable space</li>
          <li>Have a glass of water nearby</li>
          <li>Allow yourself time to rest after the session</li>
        </ul>
      </div>

      <div style="background: #f5f5f4; padding: 20px; border-radius: 8px; margin-top: 16px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1c1917;">Need to Reschedule?</h3>
        <p style="margin: 0; color: #44403c; font-size: 14px; line-height: 1.6;">
          Please contact us at least 24 hours in advance at 
          <a href="mailto:${process.env.EMAIL_FROM}" style="color: #D97706; text-decoration: none;">${process.env.EMAIL_FROM}</a>
        </p>
      </div>
    </div>

    <div style="text-align: center; padding: 24px; color: #78716c; font-size: 12px;">
      <p style="margin: 0 0 8px 0;">OMSHREEGUIDANCE - Energetic Alignment</p>
      <p style="margin: 0;">© ${new Date().getFullYear()} All rights reserved</p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"OMSHREEGUIDANCE" <${process.env.EMAIL_FROM}>`,
      to: booking.customerEmail,
      subject: `Session Confirmed - ${formattedDate} at ${booking.bookingTime}`,
      html: emailHtml,
      text: `Your ${booking.productTitle} has been confirmed for ${formattedDate} at ${booking.bookingTime}.`,
    });

    booking.confirmationEmailSent = true;
    await booking.save();

    console.log('✅ Booking confirmation email sent to:', booking.customerEmail);
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
  }
}

// Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const { status, email, startDate, endDate } = req.query;
    const query = {};

    if (status) query.bookingStatus = status;
    if (email) query.customerEmail = email.toLowerCase();
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) query.bookingDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
};

// Delete booking (admin)
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message,
    });
  }
};
