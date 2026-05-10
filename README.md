# Campus Event Management System

Sistem untuk manage event kampus. Users bisa daftar event, lihat status registrasi. Admin bisa buat event, terima/tolak peserta, manage jadwal.

## Fitur

**User:**
- Daftar akun & login
- Cari & filter event
- Lihat detail event
- Daftar event
- Lihat registrasi saya
- Edit profil & upload foto

**Admin:**
- Login admin
- Dashboard (statistik)
- Buat/edit/hapus event
- Lihat peserta event
- Terima/tolak registrasi
- Manage jadwal event

## Tech

Frontend: React, Vite, Tailwind CSS, Framer Motion
Backend: Node.js, Express, MySQL
DB: MySQL

## Database

Tables:
- admins, users, events, event_categories, schedules, registrations, participant_status

## Setup

### 1. Database

```bash
# Buka MySQL
mysql -u root -p

# Buat database
CREATE DATABASE campus_events;

# Exit dan run schema
mysql -u root -p campus_events < database_schema.sql

# Optional: import sample data
mysql -u root -p campus_events < sample_data.sql
```

### 2. Backend

```bash
cd backend
npm install
# Edit .env file dengan database credentials
npm run dev
```

Bakalan running di http://localhost:5000

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Bakalan running di http://localhost:5173

## Test

**Admin:**
- Email: admin@campus.com
- Password: password

**User test:**
- alice@student.com / password
- bob@student.com / password

## Folder Structure

```
.
├── frontend/          (React app)
├── backend/           (Express app)
├── database_schema.sql
├── sample_data.sql
└── setup.bat/sh       (run ini untuk auto setup)
```
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment (.env):
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=campus_events
   JWT_SECRET=your_secret_key_here
   ```

4. Start server:
   ```bash
   npm run dev
   ```

   Server will run at: http://localhost:5000

### 3. Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment (.env):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

   App will open at: http://localhost:5173

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/login-admin` - Login admin
- `GET /api/auth/verify` - Verify token

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/my-registrations` - Get my registrations
- `DELETE /api/registrations/:id` - Cancel registration

### Categories
- `GET /api/categories` - Get all categories

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-photo` - Upload profile photo

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/events/:eventId/registrations` - Get registrations
- `PUT /api/admin/registrations/:id` - Update registration status
- `GET /api/admin/events/:eventId/schedules` - Get schedules
- `POST /api/admin/events/:eventId/schedules` - Create schedule
- `PUT /api/admin/schedules/:id` - Update schedule
- `DELETE /api/admin/schedules/:id` - Delete schedule

## 📁 Project Structure

```
Sistem Manajemen Event/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── layouts/          # Layout wrappers
│   │   ├── services/         # API services
│   │   ├── context/          # React context (auth)
│   │   ├── assets/           # Static assets
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
├── backend/
│   ├── controllers/          # Business logic
│   ├── routes/               # API routes
│   ├── middleware/           # Auth middleware
│   ├── config/               # Database config
│   ├── uploads/              # Uploaded files
│   ├── server.js             # Server entry
│   ├── package.json
│   └── .env
│
└── database_schema.sql       # Database setup
```

## Akun Test

Admin: admin@campus.com / password
User: alice@student.com / password

## API Endpoints

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/verify

Events:
- GET /api/events
- POST /api/events (admin)
- PUT/DELETE /api/events/:id (admin)

Registrations:
- POST /api/registrations
- GET /api/my-registrations
- DELETE /api/registrations/:id

Users:
- GET /api/users/profile
- PUT /api/users/profile
- POST /api/users/upload-photo

Admin:
- GET /api/admin/stats
- GET/PUT /api/admin/events/:id/registrations
- GET/POST/PUT/DELETE /api/admin/schedules

## Masalah?

**Database error?**
- Pastiin MySQL running
- Cek .env (DB_USER, DB_PASSWORD, DB_NAME)

**Gak bisa login?**
- Pastiin backend & frontend jalan
- Cek console browser (F12)

**CORS error?**
- Pastiin backend di 5000
- Pastiin frontend .env ada VITE_API_URL

**Port udah terpakai?**
- Windows: `netstat -ano | findstr :5000`
- Mac/Linux: `lsof -ti:5000 | xargs kill -9`

## Help

- Baca SETUP.md untuk detail setup
- Baca ARCHITECTURE.md untuk tau cara kerjanya
- QUICK_REFERENCE.md ada command-command sering dipake
