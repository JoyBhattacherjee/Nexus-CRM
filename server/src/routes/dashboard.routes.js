import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/http.js';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req, res) => {
  const salesOnly = req.user.role === 'SALES';
  const ownerFilter = salesOnly ? { ownerId: req.user.id } : {};
  const taskFilter = salesOnly ? { assigneeId: req.user.id } : {};

  const [leads, deals, tasks, courses, users, wonDeals, recentActivities, stageRows] = await Promise.all([
    prisma.lead.count({ where: ownerFilter }),
    prisma.deal.count({ where: ownerFilter }),
    prisma.task.count({ where: { ...taskFilter, status: { not: 'DONE' } } }),
    prisma.course.count({ where: { published: true } }),
    prisma.user.count({ where: { active: true } }),
    prisma.deal.aggregate({ where: { ...ownerFilter, stage: 'WON' }, _sum: { value: true } }),
    prisma.activity.findMany({ where: salesOnly ? { userId: req.user.id } : {}, orderBy: { createdAt: 'desc' }, take: 6, include: { user: { select: { name: true, avatar: true } } } }),
    prisma.deal.groupBy({ by: ['stage'], where: ownerFilter, _sum: { value: true }, _count: { _all: true } })
  ]);

  res.json({
    stats: { leads, deals, openTasks: tasks, courses, teamMembers: users, wonRevenue: Number(wonDeals._sum.value || 0) },
    pipeline: stageRows.map((row) => ({ stage: row.stage, value: Number(row._sum.value || 0), deals: row._count._all })),
    activities: recentActivities
  });
}));
export default router;
