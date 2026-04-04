import ShreeWebContactPageContent from '../models/ShreeWebContactPageContent.model.js';
import ShreeWebOffering from '../models/ShreeWebOffering.model.js';
import ShreeWebTestimonialsEnhanced from '../models/ShreeWebTestimonialsEnhanced.model.js';
import ShreeWebSocialServices from '../models/ShreeWebSocialServices.model.js';
import Contact from '../models/contact.model.js';
import EmailCapture from '../models/EmailCapture.model.js';

// Helper function to get date range for analytics
const getDateRange = (days = 14) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return { startDate, endDate };
};

// Helper function to build daily activity data
const buildDailyActivity = (contacts, emailCaptures, windowDays = 14) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = windowDays - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    days.push({ iso, label, captures: 0, messages: 0 });
  }
  
  const idx = Object.fromEntries(days.map((x, i) => [x.iso, i]));
  
  // Count email captures by day
  emailCaptures.forEach((capture) => {
    const iso = capture.createdAt ? capture.createdAt.toISOString().slice(0, 10) : null;
    if (iso && idx[iso] !== undefined) {
      days[idx[iso]].captures += 1;
    }
  });
  
  // Count contact messages by day
  contacts.forEach((contact) => {
    const iso = contact.createdAt ? contact.createdAt.toISOString().slice(0, 10) : null;
    if (iso && idx[iso] !== undefined) {
      days[idx[iso]].messages += 1;
    }
  });
  
  return days;
};

export const getOverviewData = async (req, res, next) => {
  try {
    // Get counts for various content types
    const [
      offeringsCount,
      testimonialsCount,
      socialServicesCount,
      contactsCount,
      emailCapturesCount,
      recentContacts,
      recentEmailCaptures
    ] = await Promise.all([
      ShreeWebOffering.countDocuments(),
      ShreeWebTestimonialsEnhanced.countDocuments(),
      ShreeWebSocialServices.countDocuments(),
      Contact.countDocuments(),
      EmailCapture.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(10).select('name email subject createdAt'),
      EmailCapture.find().sort({ createdAt: -1 }).limit(10).select('name email createdAt')
    ]);

    // Get date range for analytics
    const { startDate, endDate } = getDateRange(14);
    
    // Get recent activity data
    const [recentContactsInRange, recentEmailCapturesInRange] = await Promise.all([
      Contact.find({ 
        createdAt: { $gte: startDate, $lte: endDate } 
      }).sort({ createdAt: -1 }),
      EmailCapture.find({ 
        createdAt: { $gte: startDate, $lte: endDate } 
      }).sort({ createdAt: -1 })
    ]);

    // Build daily activity chart data
    const dailyActivity = buildDailyActivity(recentContactsInRange, recentEmailCapturesInRange, 14);
    
    // Calculate totals for the last 14 days
    const audienceLast14 = dailyActivity.reduce((acc, d) => acc + d.captures + d.messages, 0);
    
    // Build content inventory for charts
    const contentInventory = [
      { name: 'Testimonials', value: testimonialsCount },
      { name: 'Offerings', value: offeringsCount },
      { name: 'Social Services', value: socialServicesCount },
      { name: 'Captures', value: emailCapturesCount },
      { name: 'Inbox', value: contactsCount }
    ];

    // Build pie chart data (only non-zero values)
    const pieData = contentInventory.filter(item => item.value > 0);
    
    // Build recent activity feed
    const recentActivity = [
      ...recentEmailCaptures.map(capture => ({
        kind: 'Email capture',
        detail: capture.email || capture.name || '—',
        at: capture.createdAt,
        to: '/shreeweb/cms/leads'
      })),
      ...recentContacts.map(contact => ({
        kind: 'Contact',
        detail: contact.email || contact.subject || '—',
        at: contact.createdAt,
        to: '/shreeweb/cms/contacts'
      }))
    ]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 10);

    // Calculate KPI metrics
    const stats = {
      testimonials: testimonialsCount,
      offerings: offeringsCount,
      socialServices: socialServicesCount,
      contacts: contactsCount,
      emailCaptures: emailCapturesCount,
      contentVolume: testimonialsCount + offeringsCount + socialServicesCount,
      audienceTotal: contactsCount + emailCapturesCount,
      audienceLast14
    };

    // Build content cards data
    const contentCards = [
      { label: 'Hero Section', value: '1 section', to: '/shreeweb/cms/hero-section', hint: 'Main hero with background & CTA' },
      { label: 'Video Section', value: '1 section', to: '/shreeweb/cms/video-section', hint: 'YouTube embed with overlay' },
      { label: 'Process Section', value: '1 section', to: '/shreeweb/cms/process-section', hint: 'Energetic alignment steps' },
      { label: 'Target Audience', value: '1 section', to: '/shreeweb/cms/target-audience', hint: 'Audience segments & CTA' },
      { label: 'Hidden Cost Section', value: '1 section', to: '/shreeweb/cms/hidden-cost-section', hint: 'High performance costs' },
      { label: 'Growth Section', value: '1 section', to: '/shreeweb/cms/growth-section', hint: 'When growth feels heavy' },
      { label: 'Clarity Section', value: '1 section', to: '/shreeweb/cms/clarity-section', hint: 'Clarity and alignment' },
      { label: 'Social Services', value: socialServicesCount, to: '/shreeweb/cms/social-services', hint: 'Social media services' },
      { label: 'Email Capture', value: '1 section', to: '/shreeweb/cms/email-capture', hint: 'Stay Connected signup' },
      { label: 'Testimonial entries', value: testimonialsCount, to: '/shreeweb/cms/testimonials-enhanced', hint: 'CMS-managed quotes' },
      { label: 'Offerings', value: offeringsCount, to: '/shreeweb/cms/offerings', hint: 'Programs & containers' },
      { label: 'Email captures', value: emailCapturesCount, to: '/shreeweb/cms/leads', hint: 'From site signup forms' },
      { label: 'Contact inbox', value: contactsCount, to: '/shreeweb/cms/contacts', hint: 'Form submissions' }
    ];

    // Build KPI cards
    const kpiCards = [
      {
        title: 'Content volume',
        value: stats.contentVolume,
        sub: `${testimonialsCount + offeringsCount} listed items + ${socialServicesCount} social services`,
        to: '/shreeweb/cms/offerings'
      },
      {
        title: 'Audience',
        value: stats.audienceTotal,
        sub: `${emailCapturesCount} captures · ${contactsCount} inbox · ${audienceLast14} in last 14 days`,
        to: '/shreeweb/cms/leads'
      },
      {
        title: 'Social Services',
        value: `${socialServicesCount} services`,
        sub: 'Social media management offerings',
        to: '/shreeweb/cms/social-services'
      }
    ];

    return res.status(200).json({
      success: true,
      data: {
        stats,
        contentInventory,
        pieData,
        dailyActivity,
        recentActivity,
        contentCards,
        kpiCards,
        audienceLast14
      }
    });

  } catch (error) {
    console.error('Error fetching overview data:', error);
    next(error);
  }
};