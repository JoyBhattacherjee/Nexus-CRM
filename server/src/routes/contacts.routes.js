import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../utils/http.js';

const router = Router(); router.use(authenticate);
const schema = z.object({ firstName:z.string().min(1), lastName:z.string().min(1), email:z.string().email().optional().or(z.literal('')), phone:z.string().optional(), company:z.string().optional(), jobTitle:z.string().optional(), city:z.string().optional(), country:z.string().optional(), notes:z.string().optional() });
router.get('/', asyncHandler(async (_req,res)=>res.json({ contacts: await prisma.contact.findMany({ orderBy:{createdAt:'desc'} }) })));
router.post('/', asyncHandler(async (req,res)=>{ const p=schema.safeParse(req.body); if(!p.success) throw new ApiError(400,p.error.issues[0].message); const contact=await prisma.contact.create({data:{...p.data,email:p.data.email||null}}); res.status(201).json({contact}); }));
router.put('/:id', asyncHandler(async (req,res)=>{ const p=schema.partial().safeParse(req.body); if(!p.success) throw new ApiError(400,p.error.issues[0].message); const contact=await prisma.contact.update({where:{id:req.params.id},data:p.data}); res.json({contact}); }));
router.delete('/:id', asyncHandler(async (req,res)=>{ await prisma.contact.delete({where:{id:req.params.id}}); res.status(204).end(); }));
export default router;
