# Nexus CRM + Learning Management System

I built Nexus as a full-stack customer relationship management (CRM) and learning management system (LMS) for teams that want to manage customer relationships, sales work, and employee learning in one place.

The application brings together lead and deal tracking, contact management, team tasks, role-based access, and course delivery in a responsive web experience. This README describes the product, its capabilities, and how to run it locally.

## Features

### CRM
- Dashboard with KPI cards, pipeline analytics, and recent activity
- Lead management with statuses, values, sources, owners, and CRUD operations
- Deal pipeline with stage updates, probability, values, and expected close dates
- Contact directory with company, role, phone, email, and location data
- Task management with due dates, priorities, owners, and workflow statuses
- Activity timeline

### LMS
- Course catalog inside the CRM
- Course creation for Admin and SuperAdmin
- Lesson creation and course content management
- Learner enrollment
- Learning progress tracking
- Completed / active enrollment states
- Enrollment overview for administrators

### Roles and permissions

| Role | Access |
| --- | --- |
| `SUPERADMIN` | Full CRM access, LMS management, user creation, role changes, account activation/deactivation |
| `ADMIN` | Full operational CRM visibility, LMS course/lesson/enrollment management, team visibility |
| `SALES` | Own leads, deals and tasks, shared contacts, published courses, own learning progress |

## Tech stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Recharts
- Lucide React
- Responsive custom CSS design system

### Backend
- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing
- Zod validation
- Helmet / CORS / Morgan

## Project structure

```text
Nexus-CRM/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── styles/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
├── package.json
└── README.md
```

## Quick start

### 1. Requirements

Install:
- Node.js 20+
- npm 10+
- Docker Desktop, or a local PostgreSQL 15/16 instance

### 2. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

The included Docker setup creates:

```text
Database: crm_lms
User: crm_user
Password: crm_password
Port: 5432
```

### 3. Configure environment files

Create `server/.env` from `server/.env.example`:

```env
PORT=4000
DATABASE_URL="postgresql://crm_user:crm_password@localhost:5432/crm_lms?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
CLIENT_URL="http://localhost:5173"
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Install dependencies

From the root:

```bash
npm install
npm run install:all
```

### 5. Create the database schema

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Seed demo data

Still inside `server`:

```bash
npm run prisma:seed
```

The seed is intentionally rich enough to make the dashboard useful immediately. It creates users, contacts, leads, deals, tasks, activities, courses, lessons, and enrollments.

### 7. Run the application

From the project root:

```bash
npm run dev
```

Open:

```text
Frontend: http://localhost:5173
API:      http://localhost:4000/api
Health:   http://localhost:4000/api/health
```

## Demo accounts

All seeded accounts use this password:

```text
Password@123
```

| Role | Email |
| --- | --- |
| SuperAdmin | `superadmin@nexus.dev` |
| Admin | `admin@nexus.dev` |
| Sales | `sales@nexus.dev` |
| Sales | `sales2@nexus.dev` |

## Main API routes

| Route | Purpose |
| --- | --- |
| `POST /api/auth/login` | Sign in and receive JWT |
| `GET /api/auth/me` | Current authenticated user |
| `GET /api/dashboard` | KPI, pipeline, and activity data |
| `/api/leads` | Lead CRUD |
| `/api/contacts` | Contact CRUD |
| `/api/deals` | Deal CRUD and stage updates |
| `/api/tasks` | Task CRUD and status updates |
| `/api/users` | Team administration |
| `/api/courses` | Course and lesson management |
| `/api/enrollments` | LMS enrollment and progress |

## Seed data overview

The seed script creates realistic example data including:
- 4 users across SuperAdmin, Admin, and Sales roles
- 6 leads across multiple sources and statuses
- 4 customer contacts
- 5 deals across the complete sales pipeline
- 5 operational sales/admin tasks
- 3 LMS courses
- 5 course lessons
- 5 learner enrollments
- Recent CRM and LMS activity events

Seed file:

```text
server/prisma/seed.js
```

## Security notes

I built in several security measures to protect accounts and control access:
- Passwords are hashed with bcrypt
- APIs are protected by JWT middleware
- Server-side role checks protect privileged actions
- Sales data is scoped to the logged-in salesperson where relevant
- Zod validates request payloads
- Helmet adds common HTTP security headers
- Prisma prevents raw SQL interpolation in normal application operations

For a production deployment, also add refresh-token rotation or a secure session strategy, rate limiting, audit logs, CSRF protections if using cookies, secret management, automated tests, backups, monitoring, and a production authorization review.

## Useful commands

```bash
# Start frontend + backend
npm run dev

# Build frontend
npm run build

# Generate Prisma client
cd server && npm run prisma:generate

# Create/apply a development migration
cd server && npm run prisma:migrate

# Seed PostgreSQL
cd server && npm run prisma:seed

# Open Prisma Studio
cd server && npx prisma studio
```

## Project highlights

I designed and implemented the application across the frontend, backend, and database, including:
- Full-stack React + Node architecture
- Relational PostgreSQL schema design
- Authentication and RBAC
- Multi-user SaaS-style behavior
- CRM pipeline modelling
- LMS domain modelling
- Responsive UI architecture
- Data visualization
- API validation and security middleware
- Reproducible seed data and Docker-based local setup

## License

MIT — you may use, modify, and distribute this software under the terms of the license.
