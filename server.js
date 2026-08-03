// ============================================================
//  server.js — Prajwal Subedi Portfolio Backend
//  Stack: Node.js + Express + Nodemailer
//  Run: node server.js  |  or:  nodemon server.js
// ============================================================
const open = require('open').default;
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
// const nodemailer = require('nodemailer');
const rateLimit  = require('express-rate-limit');
require('dotenv').config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const app  = express();
app.set("trust proxy", 1);


// ── MIDDLEWARE ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend (put index.html in /public)
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter for contact form (max 5 per 15 min per IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages sent. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── NODEMAILER SETUP ────────────────────────────────────────
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   connectionTimeout: 30000,
//   greetingTimeout: 30000,
//   socketTimeout: 30000,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((err) => {
//   if (err) console.error(err);
//   else      console.log('✅ Mail transporter ready');
// });

// ── PORTFOLIO DATA ──────────────────────────────────────────
const portfolioData = {
  profile: {
    name:     'Prajwal Subedi',
    title:    'Aspiring Data Scientist & Creative Technologist',
    email:    'prajwalsubedi7b@email.com',
    location: 'Nepal',
    bio:      'Turning raw data into insight and ideas into stories. Passionate about machine learning, data visualization, and creative content.',
    socials: {
      linkedin: 'https://linkedin.com/in/prajwalsubedi',
      github:   'https://github.com/prajwalsubedi',
      youtube:  'https://youtube.com/@prajwalsubedi',
      blog:     'https://curioverse.blog',
    },
  },
  skills: [
    {
      category: 'Data Science',
      items: ['Python', 'Pandas', 'NumPy', 'EDA', 'Machine Learning', 'Data Visualization', 'Statistics'],
    },
    {
      category: 'Tools',
      items: ['GitHub', 'Jupyter Notebook', 'Google Colab', 'VS Code', 'Excel'],
    },
    {
      category: 'Creative',
      items: ['DaVinci Resolve', 'Video Editing', 'Storytelling', 'Blogging'],
    },
    {
      category: 'Soft Skills',
      items: ['Problem Solving', 'Communication', 'Curiosity', 'Self-Learning'],
    },
  ],
  projects: [
    {
      id:          1,
      title:       'Telco Customer Churn Analysis',
      category:    'Data Science',
      description: 'Analyzed telecom customer data to identify churn patterns using Python, Pandas and ML classification models.',
      stack:       ['Python', 'Pandas', 'Scikit-learn', 'Seaborn'],
      github:      'https://github.com/prajwalsubedi',
      demo:        null,
    },
    {
      id:          2,
      title:       'Exploratory Data Analysis Projects',
      category:    'EDA',
      description: 'A series of EDA projects exploring real-world datasets with rich visualizations using Matplotlib and Seaborn.',
      stack:       ['Python', 'NumPy', 'Matplotlib', 'Pandas'],
      github:      'https://github.com/prajwalsubedi',
      demo:        null,
    },
    {
      id:          3,
      title:       'Video Editing & Content Creation',
      category:    'Creative',
      description: 'Educational and creative video content produced with DaVinci Resolve — storytelling meets motion design.',
      stack:       ['DaVinci Resolve', 'Storytelling'],
      github:      null,
      demo:        'https://youtube.com/@prajwalsubedi',
    },
    {
      id:          4,
      title:       'Curioverse — Learning in Public',
      category:    'Blog',
      description: 'Personal blog documenting the journey through data science, technology, and intellectual curiosity.',
      stack:       ['Writing', 'Data Science', 'Tech'],
      github:      null,
      demo:        'https://curioverse.blog',
    },
  ],
  journey: [
    {
      date:        '2024 – Present',
      title:       'Learning Data Science & Machine Learning',
      description: 'Deep dive into Python, Pandas, NumPy, ML algorithms and data visualization. Building a real project portfolio.',
      active:      true,
    },
    {
      date:        '2023 – Present',
      title:       'Started Curioverse Blog',
      description: 'Launched a blog dedicated to learning in public — sharing data science, tech, and intellectual curiosity.',
      active:      true,
    },
    {
      date:        '2025 – Present',
      title:       'Learning DaVinci Resolve Video Editing',
      description: 'Expanding into video production and creative storytelling for digital platforms.',
      active:      false,
    },
    {
      date:        '2024',
      title:       'Telco Churn Analysis Project',
      description: 'Completed first major data science project — a key milestone in the learning journey.',
      active:      false,
    },
  ],
};

// ── API ROUTES ──────────────────────────────────────────────

// GET /api/portfolio  — all portfolio data
app.get('/api/portfolio', (req, res) => {
  res.json({ success: true, data: portfolioData });
});

// GET /api/portfolio/projects
app.get('/api/portfolio/projects', (req, res) => {
  const { category } = req.query;
  const projects = category
    ? portfolioData.projects.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : portfolioData.projects;
  res.json({ success: true, data: projects });
});

// GET /api/portfolio/skills
app.get('/api/portfolio/skills', (req, res) => {
  res.json({ success: true, data: portfolioData.skills });
});

// POST /api/contact  — contact form handler
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long (max 2000 characters).' });
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });

  // Email to Prajwal
  const mailToOwner = {
    from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_USER,
    replyTo: email,
    subject: `📬 Portfolio Message: ${subject || '(no subject)'}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b1120;color:#e8ecf4;border-radius:12px;overflow:hidden">
        <div style="background:#6378ff;padding:24px 32px">
          <h2 style="margin:0;color:#fff;font-size:1.3rem">New Portfolio Message</h2>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:0.85rem">${timestamp}</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#8892a4;width:100px">From</td><td style="padding:8px 0"><strong>${name}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#8892a4">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#6378ff">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8892a4">Subject</td><td style="padding:8px 0">${subject || '—'}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid rgba(99,120,255,0.2);margin:20px 0"/>
          <h3 style="color:#a78bfa;margin:0 0 12px">Message</h3>
          <p style="line-height:1.8;white-space:pre-wrap;background:#111827;padding:16px;border-radius:8px;border-left:3px solid #6378ff">${message}</p>
        </div>
      </div>
    `,
  };

//   // Auto-reply to sender
  const mailToSender = {
    from:    `"Prajwal Subedi" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: 'Thanks for reaching out! — Prajwal Subedi',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b1120;color:#e8ecf4;border-radius:12px;overflow:hidden">
        <div style="background:#6378ff;padding:24px 32px">
          <h2 style="margin:0;color:#fff">Thanks for getting in touch, ${name}!</h2>
        </div>
        <div style="padding:32px">
          <p style="line-height:1.8;color:#8892a4">I received your message and will get back to you as soon as possible — usually within 24–48 hours.</p>
          <p style="line-height:1.8;color:#8892a4">In the meantime, feel free to explore my work:</p>
          <div style="margin:20px 0;display:flex;flex-direction:column;gap:8px">
            <a href="https://github.com/prajwalsubedi" style="color:#6378ff;text-decoration:none">🐙 GitHub Projects</a>
            <a href="https://curioverse.blog" style="color:#6378ff;text-decoration:none">✍️ Curioverse Blog</a>
            <a href="https://youtube.com/@prajwalsubedi" style="color:#6378ff;text-decoration:none">🎬 YouTube Channel</a>
          </div>
          <p style="color:#8892a4;line-height:1.8;margin-top:24px">Best regards,<br/><strong style="color:#e8ecf4">Prajwal Subedi</strong><br/><span style="color:#6378ff;font-size:0.85rem">Data Scientist &amp; Creative Technologist</span></p>
        </div>
      </div>
    `,
  };

  try {
    await resend.emails.send(mailToOwner);
    // console.log("EMAIL_USER:", process.env.EMAIL_USER);
    // console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    // console.log("Starting email send...");
    await resend.emails.send(mailToSender);
    console.log(`📬 Contact form: ${name} <${email}> — ${new Date().toISOString()}`);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error("Mail error:", err);;
    // Still return success if email not configured (dev mode)
    if (process.env.NODE_ENV !== 'production') {
      console.log('📝 [DEV] Form data received:', { name, email, subject, message });
      return res.json({ success: true, message: 'Message logged (email not configured in dev mode).' });
    }
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Prajwal Subedi Portfolio API' });
});

// Catch-all: serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const PORT = process.env.PORT || 3000;
// ── START ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET  /api/portfolio`);
  console.log(`   GET  /api/portfolio/projects`);
  console.log(`   GET  /api/portfolio/skills`);
  console.log(`   POST /api/contact`);
  console.log(`   GET  /api/health\n`);


});
