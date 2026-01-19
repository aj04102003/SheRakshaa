
# She Raksha - Setup Guide

This application consists of a high-security frontend and a Node.js cloud backend for reliable SOS dispatching via Twilio.

## 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- A [Twilio Account](https://www.twilio.com/) (Get a SID, Auth Token, and Twilio Phone Number).

## 2. Local Setup
1. Open your terminal in the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `env.sample` to `.env` and fill the values (Twilio keys are required; Gemini key is optional for the AI guardian):
   ```bash
   cp env.sample .env   # or copy manually on Windows
   ```
   Then set:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - (optional) `GEMINI_API_KEY`
   - (optional) `BACKEND_URL` if your frontend is served separately from the backend
4. Start the backend:
   ```bash
   npm start
   ```
5. Run the frontend (using your preferred live server or dev tool).

## 3. GitHub Deployment (Vercel/Render/Railway)
To host the backend publicly:
1. Push this code to a GitHub repository.
2. Connect your repo to a hosting service like **Railway.app** or **Render.com**.
3. In the Hosting Dashboard, add the following **Environment Variables**:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
4. The frontend is configured to automatically point to the same host if deployed together, or you can update `BACKEND_URL` in `index.tsx`.

## 4. How it Works
- **Primary Method**: Double-tap the SOS button. It attempts to send SMS silently via your She Raksha Cloud Backend.
- **Fail-Safe**: If the cloud dispatch fails (e.g., no internet or server down), the app automatically triggers the native `sms:` URI to open the user's messaging app with pre-filled details.
- **Helpline**: Long-press (3s) the SOS button or tap 5 times rapidly to trigger a direct voice call to `112`.
