# TICKEX - Event Ticketing Platform

A modern MERN-stack event-ticketing and social event-discovery platform.

## Features

### User Features
- Event discovery (trending, recommended, nearby)
- Secure ticket purchases (M-Pesa, Card, Airtel Money)
- QR-based e-tickets
- Location-based event search
- Save events and manage tickets

### Organizer Features
- Create and manage events
- Real-time ticket sales tracking
- QR code verification
- Event analytics dashboard

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Socket.IO
- **Frontend**: React, React Router, Axios
- **Payments**: M-Pesa Daraja API, Stripe
- **Storage**: Cloudinary (images)

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
   - MongoDB URI
   - M-Pesa API credentials
   - Stripe API key
   - Cloudinary credentials
   - JWT secret

5. Start the server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend/tickex
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### User Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/save-event/:eventId` - Save event

### Event Routes
- `POST /api/events` - Create event (organizer only)
- `GET /api/events` - Get all events
- `GET /api/events/trending` - Get trending events
- `GET /api/events/recommended` - Get recommended events
- `GET /api/events/nearby` - Get nearby events
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Ticket Routes
- `POST /api/tickets/purchase` - Purchase ticket
- `GET /api/tickets/my-tickets` - Get user's tickets
- `POST /api/tickets/validate/:id` - Validate ticket (organizer only)

### Payment Routes
- `POST /api/mpesa/initiate` - Initiate M-Pesa payment
- `POST /api/mpesa/callback` - M-Pesa callback handler

## Database Schema

### User
- username, email, password, phone
- role (user/organizer/admin)
- preferences, location
- purchasedTickets, savedEvents

### Event
- title, description, category
- organizer, date, time, venue
- location (coordinates)
- ticketTiers, posterUrl
- status, verified, attendees

### Ticket
- event, buyer, tier, price
- qrCode, paymentMethod
- paymentStatus, transactionId
- scanned, scannedAt

## Development Roadmap

### Phase 1 - MVP ✅
- User authentication
- Event listing
- M-Pesa payments
- QR ticket system
- Basic organizer dashboard

### Phase 2 (Coming Soon)
- Recommendations engine
- Reviews & ratings
- Organizer verification
- Paid promotions

### Phase 3 (Future)
- AI-driven suggestions
- Live-streaming events
- Wallet & payouts
- Social feed

## License

MIT
