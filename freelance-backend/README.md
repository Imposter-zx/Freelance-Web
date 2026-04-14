# ZORD Freelance Backend API

Backend service for the ZORD Freelance Platform built with Node.js, Express, and PostgreSQL.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run migrate

# Start development server
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Search/list freelancers
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `GET /api/users/:userId/reviews` - Get user reviews
- `POST /api/users/:userId/reviews` - Add review

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project
- `GET /api/projects/:projectId/bids` - Get project bids
- `POST /api/projects/:projectId/bids` - Place bid

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `POST /api/messages/conversations` - Create/get conversation
- `GET /api/messages/:conversationId/messages` - Get messages
- `POST /api/messages/:conversationId/messages` - Send message
- `PUT /api/messages/:conversationId/read` - Mark as read

## 🔐 Authentication

All protected endpoints require Bearer token in Authorization header:

```
Authorization: Bearer <token>
```

## 🗄️ Database Schema

- `users` - User profiles and authentication
- `projects` - Project listings
- `bids` - Project bids from freelancers
- `conversations` - Message conversations
- `messages` - Individual messages
- `reviews` - Freelancer reviews
- `transactions` - Payment transactions

## 📝 Environment Variables

See `.env.example` for all required variables.

## 🧪 Testing

```bash
npm test
```

## 📦 Technologies

- Express.js - Web framework
- PostgreSQL - Database
- JWT - Authentication
- Bcryptjs - Password hashing
- Multer - File uploads
- Stripe - Payment processing
- Nodemailer - Email service

## 📄 License

MIT
