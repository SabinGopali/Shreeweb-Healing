import React, { useEffect, useState } from 'react';

export default function Contact() {
  const [content, setContent] = useState({
    isActive: true,
    logo: {
      text: 'JAPANDI',
      subtext: 'Energetic Alignment',
      letter: 'J',
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
    contactInfo: { email: 'info@japandi.example', phone: '+977-98XXXXXXXX' },
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
        className="py-20 px-4 text-center"
        data-aos="fade-in"
        data-aos-duration="300"
      >
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div 
            className="flex items-center justify-center gap-3 mb-8"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="100"
          >
            <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-stone-800 text-white">
              <span className="text-xl font-bold tracking-widest">{content.logo?.letter || 'J'}</span>
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-2xl font-serif tracking-wide text-stone-800">{content.logo?.text || 'JAPANDI'}</div>
              <div className="truncate text-sm text-stone-600">{content.logo?.subtext || 'Energetic Alignment'}</div>
            </div>
          </div>
          
          <div 
            className="text-sm font-medium text-stone-600 mb-4 tracking-wider"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            {content.hero.tag}
          </div>
          <h1 
            className="text-5xl font-serif text-stone-800 mb-6"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="300"
          >
            {content.hero.title}
          </h1>
          <p 
            className="text-xl text-stone-600 leading-relaxed"
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
        className="py-16 px-4"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div 
              className="bg-white rounded-3xl p-8 shadow-sm"
              data-aos="fade-right"
              data-aos-duration="200"
              data-aos-delay="200"
            >
              <h2 className="text-2xl font-serif text-stone-800 mb-8">{content.form.heading}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-stone-700 font-medium mb-2 block">Name</span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-stone-700 font-medium mb-2 block">Phone</span>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400"
                      placeholder="Your phone number"
                    />
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-stone-700 font-medium mb-2 block">Email</span>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400"
                      placeholder="your@email.com"
                    />
                  </label>
                  <label className="block">
                    <span className="text-stone-700 font-medium mb-2 block">Subject</span>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400"
                      placeholder="What's this about?"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-stone-700 font-medium mb-2 block">Message</span>
                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400"
                    placeholder="Tell us more about what you're looking for..."
                  />
                </label>

                {errorMessage && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
                    {errorMessage}
                  </div>
                )}
                
                {successMessage && (
                  <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-green-700">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-orange-100 px-6 py-4 text-orange-800 font-medium hover:bg-orange-200 disabled:opacity-60 transition-colors"
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div 
              className="space-y-8"
              data-aos="fade-left"
              data-aos-duration="200"
              data-aos-delay="300"
            >
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-serif text-stone-800 mb-6">{content.connect.heading}</h2>
                <p className="text-stone-600 mb-8 leading-relaxed">{content.connect.description}</p>

                <div className="space-y-6">
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
                className="bg-stone-100 rounded-3xl p-8"
                data-aos="fade-up"
                data-aos-duration="200"
                data-aos-delay="700"
              >
                <h3 className="text-xl font-serif text-stone-800 mb-4">Follow us</h3>
                <p className="text-stone-600 mb-6">{content.follow.description}</p>
                <div className="flex space-x-4">
                  <a
                    href={content.follow.socials.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href={content.follow.socials.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                  >
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.928-.875 2.026-1.365 3.323-1.365s2.448.49 3.323 1.365c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.244c-.875.928-2.026 1.297-3.323 1.297zm7.83-9.605c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.315.315.49.753.49 1.243 0 .49-.175.928-.49 1.243-.369.315-.807.49-1.297.49zm3.323 9.605c-1.297 0-2.448-.49-3.323-1.297-.875-.807-1.365-1.958-1.365-3.244s.49-2.448 1.365-3.323c.875-.875 2.026-1.365 3.323-1.365s2.448.49 3.323 1.365c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.244c-.875.928-2.026 1.297-3.323 1.297z"/>
                    </svg>
                  </a>
                  <a
                    href={content.follow.socials.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                  {content.follow.socials.youtubeUrl ? (
                    <a
                      href={content.follow.socials.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
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
        className="py-20 px-4 bg-gradient-to-br from-amber-200 to-orange-200 text-stone-800"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl font-serif mb-6"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="100"
          >
            {content.callToAction.heading}
          </h2>
          <p 
            className="text-lg mb-8 opacity-90"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            {content.callToAction.description}
          </p>
          <a
            href={content.callToAction.buttonLink}
            className="inline-block px-8 py-4 bg-white text-stone-800 rounded-full hover:bg-stone-50 transition-colors font-medium shadow-sm"
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