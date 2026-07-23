# WorkHub

> A full-stack freelance services marketplace built on the MERN stack — where freelancers publish gigs, clients hire and pay online, and a Python-powered recommendation engine keeps users connected to the work that matters to them.

WorkHub connects freelancers (sellers) with clients (buyers). Freelancers create rich gig listings with pricing, delivery time, and media; clients browse and search gigs, place orders, pay via Khalti, chat with sellers, and leave star ratings and reviews. A separate admin dashboard provides platform-wide management, and a Flask microservice generates personalized gig recommendations from user search history.

## ✨ Features

- **User accounts & profiles** — email/password registration with OTP email verification, Google OAuth sign-in (Passport.js), JWT/session-based authentication, profile images (Multer + Sharp), seller/buyer roles, and user job-category preferences
- **Gig marketplace** — sellers create and manage gigs with cover image, gallery images/videos, category, price, delivery time, revisions, and feature lists; clients browse, filter, and search gigs
- **Orders** — clients order gigs directly; orders track pending / completed / refunded status and sales counts
- **Payments** — Khalti payment gateway integration with server-side transaction verification and persisted payment records
- **Real-time-style messaging** — buyer–seller conversations and message threads per order/gig
- **Reviews & ratings** — star ratings and written reviews on gigs, with aggregate rating computed per gig
- **Recommendation engine (Python/Flask)**
  - *Content-based*: TF-IDF + cosine similarity matches users' recent search history against newly added gigs and emails matching gig suggestions to users (triggered daily by a node-cron job in the backend)
  - *Popularity-based*: top-rated gigs endpoint (`/api/recommendations/stars`) surfaced through the Node backend
- **Admin dashboard** — React + Material UI panel with charts (Recharts) and data grids for managing users, gigs, orders, reviews, conversations, payments, refunds, and withdrawals

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), Passport.js (Google OAuth 2.0), JWT, bcrypt, Multer + Sharp (uploads), Nodemailer (OTP & notifications), node-cron |
| **Frontend** | React 18, Vite, React Router, TanStack React Query, Axios, Sass (SCSS), Khalti Checkout, SweetAlert2 |
| **Admin** | React 17 (Create React App), Material UI, MUI Data Grid, Recharts, Sass |
| **Recommendation** | Python, Flask, PyMongo, scikit-learn (TF-IDF, cosine similarity), NLTK, smtplib |
| **Database** | MongoDB (shared across backend and recommendation service) |

## 📁 Project Structure

```
WorkHub/
├── Backend/           # Express.js REST API
│   ├── config/        # Passport (Google OAuth) setup
│   ├── controllers/   # Users, gigs, orders, reviews, conversations, messages, search history
│   ├── middlewares/   # Auth & error handling
│   ├── model/         # Mongoose schemas (User, Gig, Order, Payment, Review, Conversation, Message, OTP, SearchHistory)
│   ├── routes/        # /api/user, /api/gig, /api/order, /api/payment, /api/review, ...
│   ├── utils/         # Multer config, cron scheduler for daily recommendations
│   └── server.js      # App entry point
├── Frontend/          # Client-facing React app (Vite)
│   └── src/pages/     # Home, Gigs, Gig detail, Add gig, Orders, Messages, Payment, Profile, Login/Register, OTP
├── admin/             # Admin dashboard (CRA + Material UI)
│   └── src/pages/     # Users, gigs, orders, reviews, payments, refunds, withdrawals, reports
└── recommendation/    # Flask recommendation microservice
    ├── recommendation.py
    └── requirements.txt
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended) and npm
- Python 3.8+
- A running MongoDB instance (local or Atlas)

### 1. Backend (Express API)

```bash
cd Backend
npm install
npm start        # runs server.js with nodemon
```

Create a `.env` file in `Backend/` with:

```env
PORT=8800
MONGO=<your MongoDB connection string>
JWT_SECRET=<jwt secret>
Cookie_Session=<session secret>
CLIENT_ID=<Google OAuth client ID>
CLIENT_SECRET=<Google OAuth client secret>
CLIENT_URL=http://localhost:5173
EMAIL_USERNAME=<gmail address for OTP/notifications>
EMAIL_PASSWORD=<gmail app password>
private_key=<Khalti secret key>
```

### 2. Frontend (client app)

```bash
cd Frontend
npm install
npm run dev      # starts Vite dev server at http://localhost:5173
```

### 3. Admin dashboard

```bash
cd admin
npm install
npm start        # CRA dev server (proxies API calls to http://localhost:8800/api)
```

### 4. Recommendation service (Flask)

```bash
cd recommendation
pip install -r requirements.txt
python recommendation.py   # runs on http://localhost:5000
```

Create a `.env` file in `recommendation/` with:

```env
MONGO_URI=<your MongoDB connection string>
EMAIL_ADDRESS=<sender email>
EMAIL_PASSWORD=<email app password>
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
SITE_URL=http://localhost:5173
```

The backend's cron job calls the Flask service daily to match new gigs against users' search history and email out recommendations, so run both services together for the full experience.

## 👤 About

Final year project by **Anil Ghimire** — [github.com/Anilghimire10](https://github.com/Anilghimire10)
