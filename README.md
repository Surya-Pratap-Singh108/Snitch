# Snitch 🛍️

A full-stack e-commerce platform built with the MERN stack, supporting both **sellers** and **buyers** in a single application — with multi-variant products, cart management, secure payments, and email-verified authentication.

**Live Demo:** [snitch-tawny.vercel.app](https://snitch-tawny.vercel.app)

---

## Features

### Authentication
- Email/password signup with **OTP-based email verification** (Resend)
- **Google OAuth 2.0** login
- JWT-based sessions via secure, httpOnly cookies (cross-origin safe)
- Role-based access control — **Seller** vs **Buyer**

### For Sellers
- Register as a seller and manage a personal dashboard
- Create products with multiple **variants** (size, color, etc.), each with its own price, stock, and images
- Image uploads handled via ImageKit

### For Buyers
- Browse products and view detailed variant options
- Add items to cart with quantity management (increment/decrement)
- Secure checkout with **Razorpay** payment gateway integration
- Order confirmation flow

---

## Tech Stack

**Frontend**
- React + Vite
- Redux Toolkit (state management)
- React Router
- Tailwind CSS

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- Passport.js (Google OAuth strategy)
- JWT for authentication
- Resend (transactional email for OTP)
- Razorpay (payments)
- ImageKit (image hosting/CDN)

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Architecture Highlights

A few things worth calling out from a backend/deployment perspective:

- **Secure auth flow**: JWTs stored in httpOnly, `SameSite=None`, `Secure` cookies — configured to work correctly across the cross-origin Vercel ↔ Render deployment.
- **OTP verification**: Users must verify their email via a time-limited OTP before their account is activated; unverified accounts cannot log in.
- **Role-gated routes**: Middleware distinguishes between authenticated buyers and sellers, protecting seller-only routes (product creation, dashboard, etc.).
- **SPA routing on Vercel**: Configured rewrites so client-side routes (e.g. `/seller/dashboard`, `/login`) resolve correctly on direct load/refresh.

---

## Getting Started Locally

### Prerequisites
- Node.js
- MongoDB (local or Atlas)

### Backend
```bash
cd Backend
npm install
# add a .env file (see below)
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Environment Variables (Backend `.env`)
```
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NODE_ENV=development
IMAGEKIT_PRIVATE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RESEND_API_KEY=
```

---

## Project Structure

```
Snitch/
├── Backend/
│   ├── src/
│   │   ├── config/        # env config, db connection
│   │   ├── controllers/    # route handlers
│   │   ├── middlewares/    # auth middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   ├── services/       # email, payment, storage services
│   │   └── validator/      # request validation
│   └── server.js
└── Frontend/
    └── src/
        ├── app/             # routing, store, layout
        └── features/
            ├── auth/
            ├── cart/
            └── products/
```

---

## Author

**Surya Pratap Singh**
Full Stack Developer (MERN)
