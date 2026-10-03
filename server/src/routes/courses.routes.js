import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../utils/http.js';

const router=Router();router.use(authenticate);
const schema=z.object({title:z.string().min(3),slug:z.string().min(3).regex(/^[a-z0-9-]+$/),description:z.string().min(10),category:z.string().min(2),level:z.string().min(2),published:z.boolean().optional(),thumbnail:z.string().optional().nullable()});
router.get('/',asyncHandler(async(req,res)=>{
  const courses=await prisma.course.findMany({where:req.user.role==='SALES'?{published:true}:{},orderBy:{createdAt:'desc'},include:{creator:{select:{name:true}},lessons:{orderBy:{position:'asc'}},enrollments:true}});
  res.json({courses: courses.map(c=>({...c,enrollmentCount:c.enrollments.length,enrollments:undefined}))});
}));
router.post('/',allowRoles('SUPERADMIN','ADMIN'),asyncHandler(async(req,res)=>{const p=schema.safeParse(req.body);if(!p.success)throw new ApiError(400,p.error.issues[0].message);const course=await prisma.course.create({data:{...p.data,creatorId:req.user.id}});res.status(201).json({course});}));
router.put('/:id',allowRoles('SUPERADMIN','ADMIN'),asyncHandler(async(req,res)=>{const p=schema.partial().safeParse(req.body);if(!p.success)throw new ApiError(400,p.error.issues[0].message);res.json({course:await prisma.course.update({where:{id:req.params.id},data:p.data})});}));
router.delete('/:id',allowRoles('SUPERADMIN'),asyncHandler(async(req,res)=>{await prisma.course.delete({where:{id:req.params.id}});res.status(204).end();}));
router.post('/:id/lessons',allowRoles('SUPERADMIN','ADMIN'),asyncHandler(async(req,res)=>{const p=z.object({title:z.string().min(2),content:z.string().min(5),videoUrl:z.string().url().optional().or(z.literal('')),position:z.coerce.number().int().min(1),duration:z.coerce.number().int().min(1)}).safeParse(req.body);if(!p.success)throw new ApiError(400,p.error.issues[0].message);const lesson=await prisma.lesson.create({data:{...p.data,videoUrl:p.data.videoUrl||null,courseId:req.params.id}});res.status(201).json({lesson});}));
export default router;
