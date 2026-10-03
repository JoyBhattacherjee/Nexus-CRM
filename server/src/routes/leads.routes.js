import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../utils/http.js';

const router = Router();
router.use(authenticate);
const statuses = ['NEW','CONTACTED','QUALIFIED','LOST','CONVERTED'];
const schema = z.object({ firstName: z.string().min(1), lastName: z.string().min(1), email: z.string().email().optional().or(z.literal('')), phone: z.string().optional(), company: z.string().optional(), source: z.string().optional(), status: z.enum(statuses).optional(), value: z.coerce.number().nonnegative().optional(), notes: z.string().optional(), ownerId: z.string().optional() });
const visibleWhere = (req) => req.user.role === 'SALES' ? { ownerId: req.user.id } : {};

router.get('/', asyncHandler(async (req, res) => {
  const leads = await prisma.lead.findMany({ where: visibleWhere(req), orderBy: { createdAt: 'desc' }, include: { owner: { select: { id: true, name: true, avatar: true } } } });
  res.json({ leads });
}));
router.post('/', asyncHandler(async (req, res) => {
  const input = schema.safeParse(req.body); if (!input.success) throw new ApiError(400, input.error.issues[0].message);
  const ownerId = req.user.role === 'SALES' ? req.user.id : input.data.ownerId || req.user.id;
  const lead = await prisma.lead.create({ data: { ...input.data, email: input.data.email || null, ownerId } });
  await prisma.activity.create({ data: { type: 'LEAD', message: `Added lead ${lead.firstName} ${lead.lastName}`, userId: req.user.id, leadId: lead.id } });
  res.status(201).json({ lead });
}));
router.put('/:id', asyncHandler(async (req, res) => {
  const current = await prisma.lead.findFirst({ where: { id: req.params.id, ...visibleWhere(req) } }); if (!current) throw new ApiError(404, 'Lead not found');
  const input = schema.partial().safeParse(req.body); if (!input.success) throw new ApiError(400, input.error.issues[0].message);
  const data = { ...input.data }; if (req.user.role === 'SALES') delete data.ownerId;
  const lead = await prisma.lead.update({ where: { id: current.id }, data }); res.json({ lead });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
  const current = await prisma.lead.findFirst({ where: { id: req.params.id, ...visibleWhere(req) } }); if (!current) throw new ApiError(404, 'Lead not found');
  await prisma.lead.delete({ where: { id: current.id } }); res.status(204).end();
}));
export default router;
