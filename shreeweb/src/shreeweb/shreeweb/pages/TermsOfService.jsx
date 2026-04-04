import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center bg-gradient-to-br from-[#F4EFE6] via-amber-50 to-orange-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 left-16 w-40 h-40 border border-amber-300 rounded-full"></div>
          <div className="absolute bottom-16 right-16 w-28 h-28 border border-stone-300 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-orange-300 rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-sm font-medium text-stone-600 mb-6 tracking-[0.2em] uppercase">Terms of Service</div>
          <h1 className="text-6xl md:text-7xl font-serif text-stone-800 mb-8 leading-tight">
            Clear expectations 
            <span className="block text-stone-600 italic font-light mt-2">for your journey</span>
          </h1>
          <div className="w-32 h-0.5 bg-amber-400 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-stone-700 leading-relaxed max-w-4xl mx-auto font-light">
            Establishing mutual understanding and clear boundaries for our energetic alignment sessions and services.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 bg-[#F4EFE6]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-stone-200/50">
            
            {/* Last Updated */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-sm text-amber-800 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last Updated: March 2026 | Effective: Immediately
              </div>
            </div>
            <div className="space-y-12">
              {/* Agreement */}
              <div className="border-l-4 border-amber-400 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Agreement to Terms</h2>
                
                <div className="bg-amber-50 rounded-2xl p-8 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-stone-800 mb-3">Your Acceptance</h3>
                      <p className="text-base text-stone-700 leading-relaxed">
                        By accessing and using this website, booking sessions, or engaging with our services, you agree to be bound by these Terms of Service. 
                        If you do not agree to these terms, please do not use our services.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-stone-50 rounded-2xl p-6">
                    <h3 className="text-lg font-serif text-stone-800 mb-3">Legal Capacity</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      You must be at least 18 years old or have parental consent to use our services. 
                      By agreeing to these terms, you represent that you have the legal capacity to enter into this agreement.
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-6">
                    <h3 className="text-lg font-serif text-stone-800 mb-3">Modifications</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      We reserve the right to modify these terms at any time. Changes will be posted on this page 
                      with an updated effective date. Continued use constitutes acceptance of modified terms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Nature of Services */}
              <div className="border-l-4 border-stone-400 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Nature of Our Services</h2>
                
                <div className="bg-stone-50 rounded-2xl p-8 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-stone-800 mb-3">Wellness & Energetic Alignment</h3>
                      <p className="text-base text-stone-700 leading-relaxed">
                        Our services focus on energetic alignment, wellness coaching, and holistic approaches to personal development. 
                        All sessions are complementary wellness experiences designed to support your overall well-being and personal growth.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="text-lg font-serif text-stone-800 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Not Medical Treatment
                    </h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      Our services are NOT a substitute for medical diagnosis, treatment, or professional healthcare. 
                      We do not diagnose, treat, cure, or prevent any medical conditions. Always consult qualified healthcare professionals for medical concerns.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="text-lg font-serif text-stone-800 mb-2">Complementary Approach</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      Our energetic alignment sessions are designed to complement, not replace, conventional medical care. 
                      We encourage you to maintain regular healthcare relationships and inform your healthcare providers about all wellness practices you engage in.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="text-lg font-serif text-stone-800 mb-2">Individual Results</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      Results from our services vary by individual. We make no guarantees about specific outcomes, 
                      healing, or results. Your experience and results depend on many factors including your commitment, openness, and individual circumstances.
                    </p>
                  </div>
                </div>
              </div>
              {/* Your Responsibilities */}
              <div className="border-l-4 border-orange-400 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Your Responsibilities</h2>
                
                <div className="space-y-6">
                  <div className="bg-orange-50 rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-serif text-stone-800 mb-3">Accurate Information</h3>
                        <p className="text-base text-stone-700 leading-relaxed mb-4">
                          You are responsible for providing accurate, complete, and current information during booking, 
                          intake processes, and throughout our professional relationship.
                        </p>
                        <ul className="text-sm text-stone-600 space-y-1">
                          <li>• Complete intake forms honestly and thoroughly</li>
                          <li>• Update us on any changes in your health or circumstances</li>
                          <li>• Provide accurate contact and payment information</li>
                          <li>• Inform us of any medications or treatments you're receiving</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-serif text-stone-800 mb-3">Open Communication</h3>
                        <p className="text-base text-stone-700 leading-relaxed mb-4">
                          Effective sessions require honest, open communication. Please share any concerns, questions, 
                          or changes that may affect your experience.
                        </p>
                        <ul className="text-sm text-stone-600 space-y-1">
                          <li>• Communicate comfort levels and boundaries</li>
                          <li>• Ask questions when you need clarification</li>
                          <li>• Provide feedback about your experience</li>
                          <li>• Report any concerns or adverse reactions immediately</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-serif text-stone-800 mb-3">Professional Boundaries</h3>
                        <p className="text-base text-stone-700 leading-relaxed mb-4">
                          We maintain a professional environment built on mutual respect, clear boundaries, and ethical conduct.
                        </p>
                        <ul className="text-sm text-stone-600 space-y-1">
                          <li>• Respect appointment times and scheduling policies</li>
                          <li>• Maintain appropriate professional boundaries</li>
                          <li>• Treat all staff and practitioners with respect</li>
                          <li>• Follow facility guidelines and policies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking & Payment */}
              <div className="border-l-4 border-amber-600 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Booking, Payment & Cancellation Terms</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-amber-50 rounded-2xl p-6">
                    <h3 className="text-xl font-serif text-stone-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Booking Confirmation
                    </h3>
                    <p className="text-base text-stone-700 leading-relaxed mb-3">
                      Bookings are confirmed upon payment completion and receipt of confirmation email.
                    </p>
                    <ul className="text-sm text-stone-600 space-y-1">
                      <li>• Payment required to secure appointment</li>
                      <li>• Confirmation email serves as appointment receipt</li>
                      <li>• Session details and preparation instructions included</li>
                    </ul>
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-6">
                    <h3 className="text-xl font-serif text-stone-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Payment Terms
                    </h3>
                    <p className="text-base text-stone-700 leading-relaxed mb-3">
                      All payments are processed securely through trusted third-party payment processors.
                    </p>
                    <ul className="text-sm text-stone-600 space-y-1">
                      <li>• Payment due at time of booking</li>
                      <li>• Secure payment processing</li>
                      <li>• Receipts provided for all transactions</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-stone-200">
                  <h3 className="text-xl font-serif text-stone-800 mb-4">Cancellation & Rescheduling Policy</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-stone-800 mb-2">24+ Hours Notice</h4>
                      <p className="text-sm text-stone-600">Full refund or free rescheduling available</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-stone-800 mb-2">Less Than 24 Hours</h4>
                      <p className="text-sm text-stone-600">50% refund or rescheduling fee may apply</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-stone-800 mb-2">No-Show</h4>
                      <p className="text-sm text-stone-600">No refund, full session fee applies</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Liability & Disclaimers */}
              <div className="border-l-4 border-stone-600 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Liability & Disclaimers</h2>
                
                <div className="bg-stone-50 rounded-2xl p-8 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-stone-800 mb-3">Assumption of Risk</h3>
                      <p className="text-base text-stone-700 leading-relaxed">
                        By participating in our services, you acknowledge that you understand the nature of energetic alignment work 
                        and voluntarily assume any risks associated with participation. You participate at your own risk and discretion.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="text-lg font-serif text-stone-800 mb-2">Limitation of Liability</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, 
                      consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="text-lg font-serif text-stone-800 mb-2">Service Availability</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      We strive to provide consistent, high-quality services but cannot guarantee uninterrupted availability. 
                      Services may be temporarily unavailable due to maintenance, technical issues, or unforeseen circumstances.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="text-lg font-serif text-stone-800 mb-2">Third-Party Services</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      Our website may integrate with third-party services (payment processors, scheduling platforms). 
                      We are not responsible for the availability, accuracy, or reliability of these external services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy & Confidentiality */}
              <div className="border-l-4 border-amber-400 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Privacy & Confidentiality</h2>
                
                <div className="bg-amber-50 rounded-2xl p-8 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-stone-800 mb-3">Client Confidentiality</h3>
                      <p className="text-base text-stone-700 leading-relaxed">
                        We maintain strict confidentiality regarding your personal information, session content, and wellness journey. 
                        Information shared during sessions is kept private and secure, subject to legal and ethical obligations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="text-lg font-serif text-stone-800 mb-2">Information Protection</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      Your personal and session information is protected according to our Privacy Policy. 
                      We implement appropriate security measures to safeguard your data.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="text-lg font-serif text-stone-800 mb-2">Required Disclosures</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      Confidentiality may be limited by legal requirements, such as reporting obligations 
                      for safety concerns or as required by law enforcement or court orders.
                    </p>
                  </div>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="border-l-4 border-orange-400 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Intellectual Property & Content</h2>
                
                <div className="space-y-6">
                  <div className="bg-orange-50 rounded-2xl p-8">
                    <h3 className="text-xl font-serif text-stone-800 mb-3">Our Content</h3>
                    <p className="text-base text-stone-700 leading-relaxed mb-4">
                      All content on this website, including text, graphics, logos, images, and software, is our property 
                      or licensed to us and is protected by copyright and other intellectual property laws.
                    </p>
                    <ul className="text-sm text-stone-600 space-y-1">
                      <li>• Website content and design</li>
                      <li>• Session materials and methodologies</li>
                      <li>• Educational resources and guides</li>
                      <li>• Branding and marketing materials</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="text-lg font-serif text-stone-800 mb-2">Permitted Use</h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      You may view and use our website content for personal, non-commercial purposes. 
                      You may not reproduce, distribute, modify, or create derivative works without written permission.
                    </p>
                  </div>
                </div>
              </div>

              {/* Termination */}
              <div className="border-l-4 border-stone-400 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Termination & Suspension</h2>
                
                <div className="bg-stone-50 rounded-2xl p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-serif text-stone-800 mb-3">Your Rights</h3>
                      <p className="text-base text-stone-700 leading-relaxed mb-3">
                        You may discontinue services at any time by providing appropriate notice according to our cancellation policy.
                      </p>
                      <ul className="text-sm text-stone-600 space-y-1">
                        <li>• Cancel individual sessions with proper notice</li>
                        <li>• Discontinue ongoing programs with notice</li>
                        <li>• Request account closure and data deletion</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-serif text-stone-800 mb-3">Our Rights</h3>
                      <p className="text-base text-stone-700 leading-relaxed mb-3">
                        We reserve the right to suspend or terminate services for violations of these terms or inappropriate conduct.
                      </p>
                      <ul className="text-sm text-stone-600 space-y-1">
                        <li>• Violation of terms or policies</li>
                        <li>• Inappropriate or disruptive behavior</li>
                        <li>• Non-payment or fraudulent activity</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Governing Law */}
              <div className="border-l-4 border-amber-600 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Governing Law & Dispute Resolution</h2>
                
                <div className="bg-amber-50 rounded-2xl p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-serif text-stone-800 mb-3">Applicable Law</h3>
                      <p className="text-base text-stone-700 leading-relaxed">
                        These terms are governed by and construed in accordance with applicable local and federal laws. 
                        Any disputes will be resolved in the appropriate jurisdiction.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-serif text-stone-800 mb-3">Dispute Resolution</h3>
                      <p className="text-base text-stone-700 leading-relaxed">
                        We encourage open communication to resolve any concerns. For formal disputes, 
                        we prefer mediation or arbitration before litigation when appropriate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-l-4 border-stone-600 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">Questions & Contact Information</h2>
                
                <div className="bg-stone-50 rounded-2xl p-8">
                  <div className="text-center">
                    <h3 className="text-xl font-serif text-stone-800 mb-4">Need Clarification?</h3>
                    <p className="text-base text-stone-700 leading-relaxed mb-6 max-w-2xl mx-auto">
                      If you have questions about these Terms of Service or need clarification about any aspect of our services, 
                      we're here to help. Clear communication is fundamental to our practice.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        to="/shreeweb/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Contact Us
                      </Link>
                      <Link
                        to="/shreeweb/booking?plan=discovery"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-full hover:bg-orange-100 hover:border-orange-300 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 8.5A2 2 0 0013.5 21h-3A2 2 0 019 19.5L8.5 7m0 0V6a2 2 0 012-2h4a2 2 0 012 2v1" />
                        </svg>
                        Book Discovery Call
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="mt-12 pt-8 border-t border-stone-300/50 text-center">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8">
                <p className="text-stone-600 italic leading-relaxed max-w-3xl mx-auto">
                  "By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                  We look forward to supporting you on your journey toward energetic alignment and sustainable growth."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}