# 🔧 FixItNow — Frontend Application

Welcome to **FixItNow**, a modern, full-featured home services marketplace built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Shadcn UI**. 

---

## 🌐 Live Deployment & Project Links

| Resource | URL Link |
| :--- | :--- |
| **🌐 Live Frontend App** | [https://fixitnow-frontend-070.vercel.app](https://fixitnow-frontend-070.vercel.app/) |
| **⚡ Live Backend API** | [https://fixitnow-api-gh7m.onrender.com](https://fixitnow-api-gh7m.onrender.com/) |
| **💻 Frontend GitHub Repo** | [fixitnow-frontend-assignment-5](https://github.com/arafathussen/fixitnow-frontend-assignment-5) |
| **🛠️ Backend GitHub Repo** | [fixitnow-backend-assignment-4](https://github.com/arafathussen/fixitnow-backend-assignment-4) |

---

## 🚀 Key Features

### 👨‍💼 Customer Portal
- **Service Discovery & Search:** Browse top technicians and services with zero-page-reload category, sorting, and price range filtering.
- **Booking Flow:** Interactive technician booking with slot selection.
- **Real Stripe Payment:** Seamless Checkout redirect and post-payment status management (`PAID`).
- **Interactive Review System:** Strict service-filtered reviews for completed bookings.

### 👨‍🔧 Technician Dashboard
- **Job Action Workflow:** Accept, Decline, Start Job (`IN_PROGRESS`), and Complete Job (`COMPLETED`).
- **Service Management:** Add new service offerings with client-side character length validation.
- **Availability Toggle:** Switch service availability status (Online / Offline).

### 👑 Admin Control Center
- **Executive Oversight:** Platform statistics for total users, active listings, and bookings.
- **User Moderation:** Ban/Unban user access control with real-time server security.
- **Category & Service Manager:** Create new categories and delete outdated listings with confirmation modal.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Shadcn UI
- **Notifications:** Sonner Toast
- **Payment Gateway:** Stripe Checkout API
- **State & Data Fetching:** React Server Components, Client State Hook Optimization

---

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://fixitnow-api-gh7m.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51TqRGQ...
JWT_ACCESS_SECRET=supersecretjwtkeyforfixitnowbackend2026
JWT_REFRESH_SECRET=supersecretjwtkeyforfixitnowbackend2026
```

---

## 🏃 Getting Started

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
