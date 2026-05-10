# Frontend - Campus Event Management System

React + Vite + Tailwind CSS + Framer Motion

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── layouts/         # Layout wrappers
├── services/        # API services
├── context/         # Auth context
├── assets/          # Static files
├── App.jsx          # Main component
├── main.jsx         # Entry point
└── index.css        # Tailwind CSS
```

## Key Features

- Authentication (Register/Login)
- Event browsing and searching
- Event registration
- User profiles
- Admin dashboard
- Responsive design
- Smooth animations

## Technologies

- React 18
- Vite 5
- Tailwind CSS 3
- Framer Motion
- React Router
- Axios

## Development

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview build

## Components

### Pages
- HomePage - Main landing page
- EventsPage - Event listing
- EventDetailPage - Event details
- MyRegistrationsPage - User registrations
- ProfilePage - User profile
- AdminDashboardPage - Admin stats
- AdminEventsPage - Event management
- AdminParticipantsPage - Participant management

### Components
- Navbar - Top navigation
- Footer - Footer
- AdminSidebar - Admin sidebar
- EventCard - Event card
- ErrorMessage - Error display
- LoadingCard - Loading state

## Styling

Uses Tailwind CSS with custom configuration:
- Dark theme
- Custom color palette
- Glassmorphism effects
- Smooth animations

## Tips

1. Use Tailwind CSS classes for styling
2. Use Framer Motion for animations
3. All API calls through services/api.js
4. Authentication state in AuthContext
5. Protected routes use ProtectedRoute wrapper
