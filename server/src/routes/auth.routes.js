import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { ApiError, asyncHandler } from '../utils/http.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/login', asyncHandler(async (req, res) => {
  const input = loginSchema.safeParse(req.body);
  if (!input.success) throw new ApiError(400, 'Enter a valid email and password');
  const user = await prisma.user.findUnique({ where: { email: input.data.email.toLowerCase() } });
  if (!user || !user.active || !(await bcrypt.compare(input.data.password, user.password))) throw new ApiError(401, 'Invalid email or password');
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
}));

router.get('/me', authenticate, (req, res) => res.json({ user: req.user }));
export default router;
