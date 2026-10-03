import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import contactsRoutes from './routes/contacts.routes.js';
import dealsRoutes from './routes/deals.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import usersRoutes from './routes/users.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import enrollmentsRoutes from './routes/enrollments.routes.js';
import { errorHandler, notFound } from './middleware/error.js';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required. Copy server/.env.example to server/.env');

const app=express();
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_URL?.split(',')||'http://localhost:5173',credentials:true}));
app.use(express.json({limit:'1mb'}));
app.use(morgan('dev'));
app.get('/api/health',(_req,res)=>res.json({status:'ok',service:'nexus-crm-lms-api'}));
app.use('/api/auth',authRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/leads',leadsRoutes);
app.use('/api/contacts',contactsRoutes);
app.use('/api/deals',dealsRoutes);
app.use('/api/tasks',tasksRoutes);
app.use('/api/users',usersRoutes);
app.use('/api/courses',coursesRoutes);
app.use('/api/enrollments',enrollmentsRoutes);
app.use(notFound);
app.use(errorHandler);

const port=Number(process.env.PORT||4000);
app.listen(port,()=>console.log(`Nexus CRM API running on http://localhost:${port}`));
