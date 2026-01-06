# Salon Booking System - Backend

## Project Description
This is the backend application for the **Salon Booking System**.  
The system allows users to book salon services online before visiting the salon by selecting the required service, preferred date, available time slot, and completing the payment process.  

The backend handles:
- User authentication and authorization (JWT-based security)
- Booking management
- Staff and service management
- Payment processing via Stripe
- Email notifications after registration, login, or booking
- Admin features for managing users and bookings

MongoDB Atlas is used as the database.

---

## Technologies
- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB (Atlas)**
- **JWT** for authentication
- **Stripe** for payment processing
- **Nodemailer / Email notifications**

---

## API Features
- **Authentication**
  - User registration
  - User login
  - JWT token security
- **CRUD Operations**
  - Users, Profiles, Staff, Services, Bookings
- **Advanced Features**
  - Stripe payment integration with webhook handling
  - Email notifications
  - Admin-specific routes for user and booking management

---

## How to Run Backend Locally

1. **Clone the Repository**
```bash
git clone https://github.com/IreshChathuranga/Salon-Boking-System-BE.git
cd Salon-Boking-System-BE
```
2. **Install Dependencies**
```bash
npm install
```
3. **Create a .env File**
Create a .env file in the root directory with the following variables (replace the placeholder values):
```bash
SERVER_PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_password
```
4. **Run the Server**
```bash
nom run dev
```
The server should start on the port defined in .env (e.g., http://localhost:5000).

---

Deployed Backend URL

https://salon-boking-system-be.vercel.app
