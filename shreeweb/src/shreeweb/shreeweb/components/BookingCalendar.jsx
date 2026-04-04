import React, { useEffect, useState } from 'react';
import { SHREEWEB_CMS_EMBEDS_KEY, readJsonStorage } from '../lib/shreewebStorage';

const BOOKING_CALENDAR_DEFAULT = `
<!-- Paste booking calendar embed in CMS → Shopify & calendar -->
`;

export default function BookingCalendar() {
  const [html, setHtml] = useState(BOOKING_CALENDAR_DEFAULT);

  useEffect(() => {
    const e = readJsonStorage(SHREEWEB_CMS_EMBEDS_KEY, null);
    if (e && typeof e.calendarHtml === 'string' && e.calendarHtml.trim()) {
      setHtml(e.calendarHtml);
    }
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur">
      <h3 className="text-sm font-bold text-slate-900">Booking calendar</h3>
      <p className="mt-1 text-sm text-slate-600">
        Choose a time that feels aligned. Once you submit the booking, you’ll receive confirmation.
      </p>
      <div className="mt-4">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

