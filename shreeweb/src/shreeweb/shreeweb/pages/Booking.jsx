import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import BookingCalendar from '../components/BookingCalendar.jsx';
import EmailCapture from '../components/EmailCapture';
import ShopifyCheckout from '../components/ShopifyCheckout';
import { resolveOfferingFromPlanParam } from '../utils/bookingPlan';

const PLAN_LABELS = {
  discovery: 'Discovery Call',
  session: 'Single Session',
  'single-session': 'Single Session',
  'extended-session': 'Extended Session',
  'monthly-support': 'Monthly Support',
  'realignment-program': 'Realignment Program',
  'transformation-program': 'Transformation Program',
};

export default function Booking() {
  const [params] = useSearchParams();
  const [offerings, setOfferings] = useState([]);
  const [paid, setPaid] = useState(false);
  const planId = params.get('plan') || 'discovery';

  const selectedOffering = useMemo(
    () => resolveOfferingFromPlanParam(offerings, planId),
    [offerings, planId]
  );

  const planLabel =
    selectedOffering?.title ||
    PLAN_LABELS[planId] ||
    PLAN_LABELS[String(planId).toLowerCase()] ||
    'Session';

  useEffect(() => {
    fetchOfferings();
    // Check if payment is confirmed via URL parameter
    const paidParam = params.get('paid');
    if (paidParam === '1' || paidParam === 'true') {
      setPaid(true);
    }
  }, [params]);

  const fetchOfferings = async () => {
    try {
      const response = await fetch('/backend/shreeweb-offerings/public');
      const data = await response.json();
      
      if (data.success) {
        const allOfferings = [
          ...data.offerings.introductory,
          ...data.offerings.single,
          ...data.offerings.recurring,
          ...data.offerings.program
        ];
        setOfferings(allOfferings);
      }
    } catch (error) {
      console.error('Error fetching offerings:', error);
    }
  };

  return (
    <div className="space-y-6 pb-10 overflow-x-hidden bg-[#F4EFE6] min-h-screen sm:space-y-8">
      <div className="max-w-6xl mx-auto px-4 pt-8 sm:pt-12">
        <SectionHeading
          eyebrow="Booking"
          title="Book your session"
          subtitle={paid ? `Schedule your ${planLabel}` : `Complete payment to unlock booking`}
        />

        <div className="grid gap-4 mt-8 sm:gap-6 sm:mt-12 lg:grid-cols-3">
          {/* Main Booking Area */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            {/* Selected Offering Details */}
            {selectedOffering && (
              <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur p-6 shadow-lg sm:rounded-3xl sm:p-8">
                <div className="flex flex-col items-start justify-between mb-4 gap-3 sm:flex-row sm:items-start sm:mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-serif text-stone-800 mb-2 sm:text-2xl">{selectedOffering.title}</h2>
                    <p className="text-sm text-stone-600 sm:text-base">{selectedOffering.duration}</p>
                  </div>
                  <div className="text-2xl font-serif text-stone-800 shrink-0 sm:text-3xl">
                    {selectedOffering.price}
                  </div>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed mb-4 sm:text-base sm:mb-6">{selectedOffering.description}</p>
                {selectedOffering.features && selectedOffering.features.length > 0 && (
                  <div className="border-t border-stone-200 pt-4 sm:pt-6">
                    <h3 className="text-xs font-semibold text-stone-800 mb-3 uppercase tracking-wide sm:text-sm">What's Included</h3>
                    <ul className="space-y-2">
                      {selectedOffering.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-stone-700 sm:text-sm">
                          <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Payment or Booking Calendar */}
            {paid ? (
              <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur p-6 shadow-lg sm:rounded-3xl sm:p-8">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <svg className="w-5 h-5 text-green-600 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-serif text-stone-800 sm:text-xl">Payment Confirmed</h3>
                </div>
                <p className="text-sm text-stone-600 mb-4 sm:text-base sm:mb-6">Select your preferred date and time below.</p>
                <BookingCalendar />
              </div>
            ) : (
              <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur p-6 shadow-lg sm:rounded-3xl sm:p-8">
                <h3 className="text-xl font-serif text-stone-800 mb-2 sm:text-2xl">Complete Your Booking</h3>
                <p className="text-sm text-stone-600 mb-6 sm:text-base sm:mb-8">
                  Secure your session with a simple checkout. After payment, you'll be able to select your preferred date and time.
                </p>
                
                {/* Shopify Checkout */}
                <ShopifyCheckout offering={selectedOffering} />

                <p className="text-xs text-stone-500 text-center mt-4 max-w-lg mx-auto">
                  Complete payment using the button above in this browser. Checkout links expire and do not keep your
                  cart if opened later or in another device.
                </p>

                {/* Security Badge */}
                <div className="mt-4 pt-4 border-t border-stone-200 sm:mt-6 sm:pt-6">
                  <div className="flex items-center justify-center gap-2 text-xs text-stone-600 sm:text-sm">
                    <svg className="w-4 h-4 text-green-600 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure checkout powered by Shopify</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 sm:space-y-6">
            {/* Email Capture */}
            <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur p-5 shadow-lg sm:rounded-3xl sm:p-6">
              <h3 className="text-base font-serif text-stone-800 mb-2 sm:text-lg">Stay Updated</h3>
              <p className="text-xs text-stone-600 mb-3 sm:text-sm sm:mb-4">Get gentle updates and availability reminders.</p>
              <EmailCapture context={planLabel} />
            </div>

            {/* Change Offering */}
            <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur p-5 shadow-lg sm:rounded-3xl sm:p-6">
              <h3 className="text-base font-serif text-stone-800 mb-2 sm:text-lg">Different Session?</h3>
              <p className="text-xs text-stone-600 mb-3 sm:text-sm sm:mb-4">Explore other offerings that might suit your needs.</p>
              <Link
                to="/offers"
                className="inline-flex w-full items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2.5 text-xs font-semibold text-orange-800 hover:bg-orange-100 transition-colors sm:text-sm sm:py-3"
              >
                View All Offerings
              </Link>
            </div>

            {/* Help */}
            <div className="rounded-2xl border border-stone-200 bg-white/80 backdrop-blur p-5 shadow-lg sm:rounded-3xl sm:p-6">
              <h3 className="text-base font-serif text-stone-800 mb-2 sm:text-lg">Need Help?</h3>
              <p className="text-xs text-stone-600 mb-3 sm:text-sm sm:mb-4">Contact us if you have questions before booking.</p>
              <Link
                to="/contact"
                className="inline-flex w-full items-center justify-center rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-100 transition-colors sm:text-sm sm:py-3"
              >
                Contact Us
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

