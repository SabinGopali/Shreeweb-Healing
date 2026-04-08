import React, { useEffect, useState } from 'react';

const resolveImage = (image) => {
  if (!image) return '';
  if (image.startsWith('blob:') || image.startsWith('data:')) return image;
  if (/^https?:\/\//i.test(image)) return image;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  return image.startsWith('/') ? `${backendUrl}${image}` : `${backendUrl}/${image}`;
};

export default function Contact() {
  const [content, setContent] = useState({
    isActive: true,
    logo: {
      text: 'OMSHREEGUIDANCE',
      subtext: 'Energetic Alignment',
      letter: 'J',
      imageUrl: '',
    },
    hero: {
      tag: 'CONTACT',
      title: "We'd love to hear from you",
      description: "Send a message and we'll get back to you as soon as possible.",
    },
    form: { heading: 'Send us a message' },
    connect: {
      heading: 'Other ways to connect',
      description:
        'Prefer a direct message? Connect with us on social media or reach out through the contact details below.',
    },
    location: {
      line1: 'Kathmandu, Nepal',
      line2: '(Online sessions available worldwide)',
    },
    contactInfo: { email: 'info@OMSHREEGUIDANCE.example', phone: '+977-98XXXXXXXX' },
    follow: {
      description:
        'Stay connected and get updates on our latest offerings and insights.',
      socials: {
        facebookUrl: '#',
        instagramUrl: '#',
        tiktokUrl: '#',
        youtubeUrl: '#',
      },
    },
    callToAction: {
      heading: 'Ready to start your journey?',
      description:
        "Book a complimentary Discovery Call to explore what's possible for you.",
      buttonText: 'Schedule Discovery Call',
      buttonLink: '/shreeweb/booking?plan=discovery',
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Inquiry',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('/backend/shreeweb-contact-page/public');
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.success && data?.contactPageContent) {
          setContent(data.contactPageContent);
        }
      } catch (e) {
        console.error('Failed to load contact page content:', e);
      }
    };

    loadContent();
  }, []);

  const validate = () => {
    const e = [];
    if (!formData.name.trim()) e.push('Name is required.');
    if (!formData.email.trim()) e.push('Email is required.');
    if (!/^\S+@\S+\.\S+$/.test(String(formData.email || '').trim())) e.push('Email is invalid.');
    if (!String(formData.phone || '').trim()) e.push('Phone is required.');
    if (!formData.subject.trim()) e.push('Subject is required.');
    if (!formData.message.trim()) e.push('Message is required.');
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (errors.length) {
      setErrorMessage(errors.join(' '));
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await fetch('/backend/contact/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setSuccessMessage('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: 'Inquiry', message: '' });
      } else {
        setErrorMessage(data?.message || 'Failed to send message. Please try again.');
      }
    } catch {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="py-16 px-4 text-center sm:py-20"
        data-aos="fade-in"
        data-aos-duration="300"
      >
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div 
            className="flex items-center justify-center gap-2 mb-6 sm:gap-3 sm:mb-8"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="100"
          >
            {content.logo?.imageUrl ? (
              <img 
                src={resolveImage(content.logo.imageUrl)} 
                alt={content.logo.text}
                className="h-16 w-16 flex-shrink-0 object-contain sm:h-20 sm:w-20"
                onError={(e) => {
                  console.error('Contact logo failed to load:', content.logo.imageUrl);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-stone-800 text-white sm:h-20 sm:w-20">
                <span className="text-xl font-bold tracking-widest sm:text-2xl">{content.logo?.letter || 'J'}</span>
              </div>
            )}
            <div className="min-w-0 leading-tight">
              <div className="truncate text-xl font-serif tracking-wide text-stone-800 sm:text-2xl">{content.logo?.text || 'OMSHREEGUIDANCE'}</div>
              <div className="truncate text-xs text-stone-600 sm:text-sm">{content.logo?.subtext || 'Energetic Alignment'}</div>
            </div>
          </div>
          
          <div 
            className="text-xs font-medium text-stone-600 mb-3 tracking-wider sm:text-sm sm:mb-4"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            {content.hero.tag}
          </div>
          <h1 
            className="text-3xl font-serif text-stone-800 mb-4 sm:text-4xl md:text-5xl sm:mb-6"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="300"
          >
            {content.hero.title}
          </h1>
          <p 
            className="text-lg text-stone-600 leading-relaxed sm:text-xl"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="400"
          >
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section 
        className="py-12 px-4 sm:py-16"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div 
              className="bg-white rounded-2xl p-6 shadow-sm sm:rounded-3xl sm:p-8"
              data-aos="fade-right"
              data-aos-duration="200"
              data-aos-delay="200"
            >
              <h2 className="text-xl font-serif text-stone-800 mb-6 sm:text-2xl sm:mb-8">{content.form.heading}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-stone-700 font-medium mb-2 block">Name</span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400 text-sm sm:rounded-2xl sm:py-3 sm:text-base"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-stone-700 font-medium mb-2 block">Phone</span>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400 text-sm sm:rounded-2xl sm:py-3 sm:text-base"
                      placeholder="Your phone number"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-stone-700 font-medium mb-2 block">Email</span>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400 text-sm sm:rounded-2xl sm:py-3 sm:text-base"
                      placeholder="your@email.com"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-stone-700 font-medium mb-2 block">Subject</span>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400 text-sm sm:rounded-2xl sm:py-3 sm:text-base"
                      placeholder="What's this about?"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm text-stone-700 font-medium mb-2 block">Message</span>
                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400 text-sm sm:rounded-2xl sm:py-3 sm:text-base"
                    placeholder="Tell us more about what you're looking for..."
                  />
                </label>

                {errorMessage && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm sm:rounded-2xl sm:p-4">
                    {errorMessage}
                  </div>
                )}
                
                {successMessage && (
                  <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-green-700 text-sm sm:rounded-2xl sm:p-4">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-orange-100 px-6 py-3 text-orange-800 font-medium hover:bg-orange-200 disabled:opacity-60 transition-colors text-sm sm:rounded-2xl sm:py-4 sm:text-base"
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div 
              className="space-y-6 sm:space-y-8"
              data-aos="fade-left"
              data-aos-duration="200"
              data-aos-delay="300"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm sm:rounded-3xl sm:p-8">
                <h2 className="text-xl font-serif text-stone-800 mb-4 sm:text-2xl sm:mb-6">{content.connect.heading}</h2>
                <p className="text-sm text-stone-600 mb-6 leading-relaxed sm:text-base sm:mb-8">{content.connect.description}</p>

                <div className="space-y-4 sm:space-y-6">
                  <div 
                    className="flex items-start space-x-4"
                    data-aos="fade-up"
                    data-aos-duration="200"
                    data-aos-delay="400"
                  >
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-stone-800">Location</h3>
                      <p className="text-stone-600">{content.location.line1}</p>
                      <p className="text-sm text-stone-500">{content.location.line2}</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-start space-x-4"
                    data-aos="fade-up"
                    data-aos-duration="200"
                    data-aos-delay="500"
                  >
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-stone-800">Email</h3>
                      <p className="text-stone-600">{content.contactInfo.email}</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-start space-x-4"
                    data-aos="fade-up"
                    data-aos-duration="200"
                    data-aos-delay="600"
                  >
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-stone-800">Phone</h3>
                      <p className="text-stone-600">{content.contactInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div 
                className="bg-stone-100 rounded-2xl p-6 sm:rounded-3xl sm:p-8"
                data-aos="fade-up"
                data-aos-duration="200"
                data-aos-delay="700"
              >
                <h3 className="text-lg font-serif text-stone-800 mb-3 sm:text-xl sm:mb-4">Follow us</h3>
                <p className="text-sm text-stone-600 mb-4 sm:text-base sm:mb-6">{content.follow.description}</p>
                <div className="flex space-x-3 sm:space-x-4">
                  <a
                    href={content.follow.socials.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href={content.follow.socials.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href={content.follow.socials.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                  </a>
                  {content.follow.socials.youtubeUrl ? (
                    <a
                      href={content.follow.socials.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="py-16 px-4 bg-gradient-to-br from-amber-200 to-orange-200 text-stone-800 sm:py-20"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-2xl font-serif mb-4 sm:text-3xl sm:mb-6"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="100"
          >
            {content.callToAction.heading}
          </h2>
          <p 
            className="text-base mb-6 opacity-90 sm:text-lg sm:mb-8"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            {content.callToAction.description}
          </p>
          <a
            href={content.callToAction.buttonLink}
            className="inline-block px-6 py-3 bg-white text-stone-800 rounded-full hover:bg-stone-50 transition-colors font-medium shadow-sm text-sm sm:px-8 sm:py-4 sm:text-base"
            data-aos="zoom-in"
            data-aos-duration="200"
            data-aos-delay="300"
          >
            {content.callToAction.buttonText}
          </a>
        </div>
      </section>
    </div>
  );
}