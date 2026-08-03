# 🔌 FixItNow Frontend — API Integration Documentation

> **Project Name:** FixItNow — Your Trusted Home Service Platform  
> **Backend API URL:** `https://fixitnow-api-gh7m.onrender.com`  
> **Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS v4, Shadcn UI, Sonner Toast, JWT Auth, Stripe Checkout  

---

## 🗺️ Frontend Component & Route to Backend API Mapping

| Next.js Route / Component | UI Feature / Action | HTTP Method | Backend API Endpoint | Access Level |
|---------------------------|---------------------|:-----------:|----------------------|:------------:|
| `app/(authGroup)/register/page.tsx` | User Registration (Customer / Technician) | `POST` | `/api/auth/register` | Public |
| `app/(authGroup)/login/page.tsx` | User Login & Token Verification | `POST` <br/> `GET` | `/api/auth/login` <br/> `/api/auth/me` | Public |
| `components/NavbarAuth.tsx` | User Profile & Role Info Resolution | `GET` | `/api/auth/me` | Logged In |
| `app/(publicGroup)/page.tsx` | Home Page (Featured Services & Top Techs) | `GET` <br/> `GET` | `/api/services` <br/> `/api/technicians` | Public |
| `app/(publicGroup)/services/page.tsx` | Browse Services & Zero-Reload Category Filter | `GET` <br/> `GET` | `/api/services` <br/> `/api/categories` | Public |
| `app/(publicGroup)/services/[id]/page.tsx` | Service Details, Tech Profile & Customer Reviews | `GET` <br/> `GET` | `/api/services/:id` <br/> `/api/reviews` | Public |
| `app/(publicGroup)/services/[id]/BookingForm.tsx` | Create New Service Booking Request | `POST` | `/api/bookings` | Customer Only |
| `app/(dashboardGroup)/dashboard/page.tsx` | Customer Dashboard Overview & Payments | `GET` <br/> `GET` | `/api/bookings` <br/> `/api/payments` | Customer Only |
| `components/CustomerBookingActions.tsx` | Initiate Stripe Checkout | `POST` | `/api/payments/create` | Customer Only |
| `components/CustomerBookingActions.tsx` | Cancel Pending Booking | `PATCH` | `/api/bookings/:id/cancel` | Customer Only |
| `components/CustomerBookingActions.tsx` | Submit Completed Service Review | `POST` | `/api/reviews` | Customer Only |
| `app/(dashboardGroup)/technician-dashboard/page.tsx` | Technician Overview & Bookings | `GET` <br/> `GET` <br/> `GET` | `/api/technician/bookings` <br/> `/api/technician/profile` <br/> `/api/categories` | Technician Only |
| `components/TechnicianBookingActions.tsx` | Booking Workflow (Accept/Decline/Start/Complete) | `PATCH` | `/api/technician/bookings/:id` | Technician Only |
| `components/TechnicianAvailabilityToggle.tsx` | Service Availability Switch (Online/Offline) | `PATCH` | `/api/technicians/profile` | Technician Only |
| `components/TechnicianServiceAddModal.tsx` | Publish New Service Offering | `POST` | `/api/services` | Technician / Admin |
| `app/(dashboardGroup)/admin-dashboard/page.tsx` | Admin Control Center Stats & Bookings | `GET` <br/> `GET` <br/> `GET` | `/api/admin/users` <br/> `/api/admin/bookings` <br/> `/api/services` | Admin Only |
| `components/AdminUserBanToggle.tsx` | User Account Ban & Unban Management | `PATCH` | `/api/admin/users/:id` | Admin Only |
| `components/AdminServiceManager.tsx` | Create New Service Category | `POST` | `/api/admin/categories` | Admin Only |
| `components/AdminServiceManager.tsx` | Delete Service Offering | `DELETE` | `/api/services/:id` | Admin Only |

---

## 🔒 Authentication & Security Implementation

1. **JWT Storage:** Tokens are saved in secure browser cookies upon successful login.
2. **Middleware Protection (`middleware.ts`):** Automatically protects `/dashboard`, `/technician-dashboard`, and `/admin-dashboard` routes based on user role.
3. **Login Ban Guard:** Banned users are instantly blocked at the login stage with zero cookie creation and zero page reloads.
