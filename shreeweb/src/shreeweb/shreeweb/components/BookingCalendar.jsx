import React, { useState } from 'react';

function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const timeSlots = [
    '09:00 AM',
    '10:00 AM', 
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
  ];

  const dates = generateDates();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      alert(`Booking confirmed for ${formatDate(selectedDate)} at ${selectedTime}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-stone-800 mb-3 sm:text-base">Select Date</h4>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {dates.slice(0, 15).map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`p-2 text-xs rounded-lg border transition-colors sm:text-sm sm:p-3 ${
                selectedDate?.toDateString() === date.toDateString()
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h4 className="text-sm font-semibold text-stone-800 mb-3 sm:text-base">Select Time</h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {timeSlots.map((time, index) => (
              <button
                key={index}
                onClick={() => setSelectedTime(time)}
                className={`p-2 text-xs rounded-lg border transition-colors sm:text-sm sm:p-3 ${
                  selectedTime === time
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedTime && (
        <div className="pt-4 border-t border-stone-200">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800">
              <strong>Selected:</strong> {formatDate(selectedDate)} at {selectedTime}
            </p>
          </div>
          <button
            onClick={handleBooking}
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-amber-700 transition-colors text-sm sm:text-base"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingCalendar;
