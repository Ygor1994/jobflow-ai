
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
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```

## 💰 Stripe Configuration (Critical for Revenue)

To start receiving the €9.90/month subscription:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/payment-links).
2. Create a Payment Link for your product.
3. **IMPORTANT**: Set the "After payment" redirect URL to: `https://your-site.com/?payment_success=true`.
4. Open `components/PaymentModal.tsx`.
5. Paste the link in the `STRIPE_PAYMENT_LINK` constant.

## 🌍 Deployment (Vercel)

This project is optimized for Vercel deployment.

1. **Push to GitHub**: Commit your code and push it to a repository.
2. **Import in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import your repository.
3. **Configure Environment Variables**:
   - In the Vercel project deployment screen, find the **Environment Variables** section.
   - Add a new variable:
     - Name: `API_KEY`
     - Value: `your_actual_google_api_key`
4. **Deploy**: Click "Deploy". Vercel will automatically detect Vite and build the project.

**Note:** The app relies on the `API_KEY` to access Google Gemini AI. Ensure this key is valid and has credits (or is a free tier key) in Google AI Studio.

## ✨ Features

- **AI Resume Builder**: Optimized for Benelux (Photo, DOB, Driving License).
- **AI Headhunter**: Matches CV to jobs via Google Search Grounding.
- **Premium Subscription**: €9.90/month via Stripe.
- **Multi-language**: Full English (EN), Dutch (NL), Spanish (ES), and Portuguese (PT) support.
