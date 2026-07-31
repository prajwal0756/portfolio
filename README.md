# 🚀 Prajwal Subedi — Portfolio

A professional portfolio website with a dark tech theme, built with HTML/CSS/JS (frontend) and Node.js/Express (backend).

---

## 📁 File Structure

```
portfolio/
├── public/
│   └── index.html       ← Frontend (copy here)
├── server.js            ← Backend API server
├── package.json
├── .env.example
└── .env                 ← Create this (copy .env.example)
```

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Open .env and fill in your Gmail credentials
```

### 3. Place frontend in public folder
```bash
mkdir public
# Copy index.html into the public/ folder
```

### 4. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Visit: **http://localhost:3000**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | All portfolio data |
| GET | `/api/portfolio/projects` | Projects list |
| GET | `/api/portfolio/skills` | Skills list |
| POST | `/api/contact` | Send contact message |
| GET | `/api/health` | Health check |

### Contact Form POST body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Collaboration",
  "message": "Hi Prajwal..."
}
```

---

## 📧 Email Setup (Gmail)

1. Enable 2-Step Verification on your Google Account
2. Go to **Google Account → Security → App Passwords**
3. Create an App Password for "Mail"
4. Copy the 16-character password into `.env` as `EMAIL_PASS`

---

## 🌐 Deployment Options

### Vercel (Free, recommended for frontend)
```bash
npm install -g vercel
vercel
```

### Railway / Render (Full backend deployment)
- Connect your GitHub repo
- Set environment variables in the dashboard
- Deploy!

### VPS (DigitalOcean / Linode)
```bash
# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name "portfolio"
pm2 save
pm2 startup
```

---

## 🎨 Customization

- **Update your info**: Edit the `portfolioData` object in `server.js`
- **Add projects**: Push new objects to the `projects` array
- **Change social links**: Update `href` values in `index.html`
- **Update email**: Change `prajwal@email.com` to your real email in `index.html`

---

Built with ❤️ and curiosity by Prajwal Subedi
