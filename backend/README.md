# Backend - Campus Event Management System

Node.js + Express.js + MySQL + JWT

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Create `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=campus_events
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

## Project Structure

```
├── controllers/      # Business logic
├── routes/          # API routes
├── middleware/      # Auth middleware
├── config/          # Database config
├── uploads/         # Uploaded files
├── server.js        # Server entry
└── package.json
```

## API Endpoints

### Auth
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- POST /api/auth/login-admin - Login admin
- GET /api/auth/verify - Verify token

### Events
- GET /api/events - All events
- GET /api/events/:id - Event detail
- POST /api/events - Create event
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event

### Registrations
- POST /api/registrations - Register for event
- GET /api/my-registrations - My registrations
- DELETE /api/registrations/:id - Cancel

### Users
- GET /api/users/profile - Get profile
- PUT /api/users/profile - Update profile
- POST /api/users/upload-photo - Upload photo

### Admin
- GET /api/admin/stats - Dashboard stats
- GET /api/admin/events/:eventId/registrations - Get registrations
- PUT /api/admin/registrations/:id - Update status
- GET /api/admin/events/:eventId/schedules - Get schedules
- POST /api/admin/events/:eventId/schedules - Create schedule
- PUT /api/admin/schedules/:id - Update schedule
- DELETE /api/admin/schedules/:id - Delete schedule

## Database

MySQL schema includes:
- admins - Admin accounts
- users - User accounts
- events - Event details
- schedules - Event schedules
- registrations - User registrations
- event_categories - Event types
- participant_status - Registration status

## Middleware

- **authMiddleware** - Verify JWT token
- **adminMiddleware** - Check admin role

## Controllers

- authController - Authentication
- eventController - Event CRUD
- registrationController - Registrations
- userController - User profile
- categoryController - Categories
- adminController - Admin operations

## Development

```bash
npm run dev      # Start with nodemon
npm start        # Start production
```

## Key Features

- JWT authentication
- Password hashing with bcryptjs
- CORS enabled
- File uploads support
- Comprehensive error handling
- Role-based access control
- Proper status codes and validation

## Tips

1. Always include Authorization header with token
2. Use middleware for protected routes
3. Validate input in controllers
4. Handle errors gracefully
5. Log important events
6. Use transactions for critical operations
