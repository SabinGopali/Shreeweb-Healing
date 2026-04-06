import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BookingCalendar from '../components/BookingCalendar';

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const orderId = searchParams.get('order_id') || searchParams.get('orderId');
  const orderNumber = searchParams.get('order_number');

  useEffect(() => {
    if (orderId || orderNumber) {
      fetchBooking(orderId || orderNumber);
    } else {
      setError('No order information found. Please check your email for booking details.');
      setLoading(false);
    }
  }, [orderId, orderNumber]);

  const fetchBooking = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/backend/bookings/order/${id}`);
      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
        
        // If already scheduled, show confirmation
        if (data.data.bookingStatus === 'confirmed' && data.data.bookingDate) {
          setScheduled(true);
        }
      } else {
        setError(data.message || 'Booking not found');
      }
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleBooking = async (selectedDate, selectedTime) => {
    if (!booking) return;

    try {
      setScheduling(true);
      setError('');

      const response = await fetch(`/backend/bookings/order/${booking.shopifyOrderId}/schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          bookingTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
        setScheduled(true);
      } else {
        setError(data.message || 'Failed to schedule booking');
      }
    } catch (err) {
      console.error('Error scheduling booking:', err);
      setError('Failed to schedule booking. Please try again.');
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
          <p className="text-stone-600">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-stone-800 mb-2">Booking Not Found</h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/shreeweb/home')}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (scheduled) {
    const bookingDate = new Date(booking.bookingDate);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-2">Session Confirmed!</h1>
            <p className="text-stone-600">Your booking has been successfully scheduled</p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-serif text-stone-800 mb-4">Session Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-stone-600">Session Type:</span>
                <span className="font-medium text-stone-800">{booking.productTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Date:</span>
                <span className="font-medium text-stone-800">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Time:</span>
                <span className="font-medium text-stone-800">{booking.bookingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Order Number:</span>
                <span className="font-medium text-stone-800">#{booking.shopifyOrderNumber}</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-stone-800 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-stone-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>You'll receive a confirmation email with all the details</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>We'll send you a reminder 24 hours before your session</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Prepare a quiet, comfortable space for your session</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/shreeweb/home')}
              className="flex-1 px-6 py-3 bg-stone-200 text-stone-800 rounded-lg hover:bg-stone-300 transition-colors font-medium"
            >
              Return Home
            </button>
            <button
              onClick={() => navigate('/shreeweb/contact')}
              className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-2">Payment Successful!</h1>
          <p className="text-lg text-stone-600 mb-4">Now let's schedule your session</p>
          
          {booking && (
            <div className="inline-block bg-white rounded-lg shadow-md px-6 py-4 mt-4">
              <p className="text-sm text-stone-600 mb-1">You've purchased:</p>
              <p className="text-xl font-semibold text-stone-800">{booking.productTitle}</p>
              <p className="text-sm text-stone-500 mt-1">Order #{booking.shopifyOrderNumber}</p>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-serif text-stone-800 mb-6">Select Your Preferred Date & Time</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <BookingCalendar
            onSchedule={handleScheduleBooking}
            disabled={scheduling}
            planLabel={booking?.productTitle || 'Session'}
          />

          {scheduling && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <p className="text-stone-600 mt-2">Confirming your booking...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
