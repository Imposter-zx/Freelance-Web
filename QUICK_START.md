# ZORD Freelance Platform - Quick Start Guide

## 🎯 Project Status

✅ **Phase 1 Complete**: Full-stack development with frontend and backend infrastructure  
📊 **Completion**: ~70% (Core features built, ready for integration)  
🚀 **Ready for**: API integration, payment setup, file uploads

---

## 📁 Project Structure

```
freelances/
├── freelance-react/           # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/            # All application pages
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API service layer (NEW!)
│   │   ├── context/          # Global state management
│   │   ├── utils/            # Helpers & validation (NEW!)
│   │   └── locales/          # Translations
│   ├── .env                  # Environment config (NEW!)
│   └── package.json
│
├── freelance-backend/        # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth, errors, logging
│   │   ├── db/               # Database schema
│   │   ├── utils/            # JWT, helpers
│   │   └── services/         # Business logic
│   ├── server.js             # Express setup
│   ├── .env                  # Backend config
│   ├── package.json
│   └── scripts/              # Database init
│
├── DEVELOPMENT.md            # Detailed development guide (NEW!)
├── CHANGELOG.md              # Version history
└── ROADMAP.md                # Future plans
```

---

## 🚀 Quick Start

### Frontend Setup

```bash
# Navigate to frontend
cd freelance-react

# Install dependencies
npm install

# Start development server
npm run dev
```

Access at: `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend
cd freelance-backend

# Install dependencies
npm install

# Set up PostgreSQL database
# Make sure PostgreSQL is running on localhost:5432

# Initialize database schema
npm run migrate

# Start backend server
npm run dev
```

Access at: `http://localhost:3000`

---

## 🔑 Key Features Implemented

### ✅ Frontend
- React 19 with modern hooks
- Responsive Tailwind CSS design
- Smooth Framer Motion animations
- React Router v7 navigation
- Form validation with React Hook Form + Zod
- Error boundaries and error handling
- Multi-language support (5 languages)
- Service layer abstraction
- Admin dashboard

### ✅ Backend
- Express.js REST API
- PostgreSQL database
- JWT authentication
- Role-based access control
- 12+ API endpoints
- Comprehensive error handling
- Request logging
- CORS support

---

## 📚 Service Layer (NEW)

All API calls go through service layer for flexibility:

```javascript
// Use in any component
import { authService } from '../services/authService';

const user = await authService.login(email, password);
const freelancers = await userService.searchFreelancers(query);
const projects = await projectService.getProjects(filters);
```

**Benefits**:
- Switch between mock data and real APIs via `.env`
- Consistent error handling
- Automatic token management
- Easy testing

---

## 🔐 Environment Configuration

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MOCK_MODE=true  # Use mock data during dev
VITE_AUTH_TOKEN_KEY=auth_token
```

### Backend (`.env`)
```
PORT=3000
DB_HOST=localhost
DB_NAME=zord_freelance
DB_USER=postgres
JWT_SECRET=your_secret_key
```

---

## 🔌 API Integration

Services are ready to connect to real APIs. Current flow:

1. **Development**: Mock mode ON → Uses local data
2. **Testing**: Set `VITE_ENABLE_MOCK_MODE=false` → Calls backend
3. **Production**: Real API endpoints → Production database

To switch to real backend:
```
VITE_ENABLE_MOCK_MODE=false
VITE_API_BASE_URL=https://your-api.com/api
```

---

## 📊 API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login  
- `GET /api/auth/me` - Current user
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users` - List/search freelancers
- `GET /api/users/:id` - Get profile
- `PUT /api/users/:id` - Update profile
- `GET /api/users/:id/reviews` - Get reviews

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/bids` - Place bid

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages/:conversationId/messages` - Send message

---

## ✨ Form Validation

All forms now have validation using Zod schemas:

```javascript
// Example: Login form validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
```

Supported validations:
- Login/Register
- Project creation
- Bids
- Profile updates
- Messages
- Settings

---

## 🎨 UI/UX Improvements

- Form error messages displayed inline
- Loading spinners on all forms
- Alert notifications (success/error/warning)
- Error boundary catches global errors
- Consistent design system
- Smooth animations throughout

---

## 🧪 Testing the Platform

### Test Accounts (Mock Mode)
```
Client:
  Email: client@example.com
  Password: Test123

Freelancer:
  Email: freelancer@example.com
  Password: Test123
```

### Test Flows
1. Register new account
2. Create a project
3. Browse freelancers
4. Place a bid
5. Send messages
6. Update profile

---

## 📈 Performance & Optimization

Frontend:
- Code splitting with React Router
- Image optimization (Lucide icons)
- CSS-in-JS with Tailwind
- Smooth 60fps animations

Backend:
- Indexed database queries
- Connection pooling
- Request compression
- Error handling

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection refused
- Check PostgreSQL is running
- Verify .env database credentials
- Check port 3000 is available

### API calls failing
- Check CORS in backend
- Verify API_BASE_URL in .env
- Check authentication token

---

## 📦 Package Versions

**Frontend**:
- React 19.2.0
- Vite 7.3.1
- Tailwind CSS 3.4.19
- Framer Motion 12.35.0
- React Hook Form 7.48.0
- Zod (latest)

**Backend**:
- Express 4.18.2
- PostgreSQL 8.11.3
- JWT 9.1.2
- bcryptjs 2.4.3

---

## 🚀 Next Steps

### IMMEDIATE (This Week)
1. ✅ Form validation
2. ✅ Service layer
3. ✅ Error handling
4. ✅ Admin dashboard
5. Next: Database connection testing

### NEXT (Next Week)
1. Stripe payment integration
2. File upload system
3. Email notifications
4. Real WebSocket messaging

### FUTURE
1. Advanced search
2. Analytics dashboard
3. Mobile app
4. AI recommendations
5. Admin moderation tools

---

## 📞 Need Help?

1. **Check Logs**: Look at browser console and terminal
2. **Read DEVELOPMENT.md**: Detailed architecture guide
3. **Check .env**: Verify configuration
4. **Review README**: In each directory
5. **API Docs**: See freelance-backend/README.md

---

## ✅ Checklist Before Going Live

- [ ] Database migrations tested
- [ ] API endpoints tested
- [ ] Frontend-backend integrated
- [ ] Forms validated
- [ ] Error handling working
- [ ] Admin dashboard accessible
- [ ] Performance optimized
- [ ] Security review done
- [ ] Deployment configured
- [ ] Monitoring set up

---

**Last Updated**: April 14, 2026  
**Current Phase**: Frontend + Backend Development ✅  
**Next Phase**: Payment Integration 🔄
