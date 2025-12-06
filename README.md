
# JobFlow AI - Benelux Edition 🇳🇱🇧🇪

![CI](https://github.com/Ygor1994/jobflow-ai/actions/workflows/main.yml/badge.svg)

This is a Premium AI Resume Builder & Headhunter SaaS optimized for the Netherlands and Belgium market.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   Create a `.env` file in the root directory.
   **IMPORTANT:** In Vite, variables must start with `VITE_`.
   ```env
   VITE_API_KEY=your_google_gemini_api_key_here
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```

## 🐙 GitHub Profile Export Feature (New!)

This app helps developers stand out by generating a perfect `README.md` for their GitHub profile.

1. Create your resume in the app.
2. Go to the **Preview** step.
3. Click the **Copy MD** button (GitHub icon).
4. Paste the content into your GitHub special repository (e.g., `username/username`).

## 💰 Stripe Configuration (Critical for Revenue)

To start receiving the €9.90/month subscription:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/payment-links).
2. Create a Payment Link for your product.
3. **IMPORTANT**: Set the "After payment" redirect URL to: `https://your-site.com/?payment_success=true` (or `http://localhost:5173/?payment_success=true` for testing).
4. Open `components/PaymentModal.tsx`.
5. Paste the link in the `STRIPE_PAYMENT_LINK` constant.

## 🌍 Deployment (Vercel)

1. Push this code to GitHub.
2. Import the project in Vercel.
3. In Vercel Settings -> Environment Variables, add:
   - `VITE_API_KEY`: Your Gemini API Key.
4. Deploy!

## ✨ Features

- **AI Resume Builder**: Optimized for Benelux (Photo, DOB, Driving License).
- **AI Headhunter**: Matches CV to 500+ jobs and auto-drafts cover letters.
- **GitHub Profile Generator**: One-click export to Markdown.
- **Premium Subscription**: €9.90/month via Stripe.
- **Multi-language**: Full English (EN), Dutch (NL), Spanish (ES), and Portuguese (PT) support.
