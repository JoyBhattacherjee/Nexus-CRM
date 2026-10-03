import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../utils/http.js';

const router=Router();router.use(authenticate);
router.get('/',asyncHandler(async(req,res)=>{
  const where=req.user.role==='SALES'?{userId:req.user.id}:{};
  const enrollments=await prisma.enrollment.findMany({where,orderBy:{enrolledAt:'desc'},include:{user:{select:{id:true,name:true,email:true,avatar:true}},course:{select:{id:true,title:true,category:true,level:true}}}});
  res.json({enrollments});
}));
router.post('/',allowRoles('SUPERADMIN','ADMIN'),asyncHandler(async(req,res)=>{const p=z.object({userId:z.string(),courseId:z.string()}).safeParse(req.body);if(!p.success)throw new ApiError(400,'userId and courseId are required');const enrollment=await prisma.enrollment.upsert({where:{userId_courseId:{userId:p.data.userId,courseId:p.data.courseId}},update:{status:'ACTIVE'},create:p.data});res.status(201).json({enrollment});}));
router.patch('/:id/progress',asyncHandler(async(req,res)=>{const p=z.object({progress:z.coerce.number().int().min(0).max(100)}).safeParse(req.body);if(!p.success)throw new ApiError(400,'Progress must be between 0 and 100');const current=await prisma.enrollment.findUnique({where:{id:req.params.id}});if(!current)throw new ApiError(404,'Enrollment not found');if(req.user.role==='SALES'&&current.userId!==req.user.id)throw new ApiError(403,'Not allowed');const progress=p.data.progress;const enrollment=await prisma.enrollment.update({where:{id:current.id},data:{progress,status:progress===100?'COMPLETED':'ACTIVE',completedAt:progress===100?new Date():null}});res.json({enrollment});}));
export default router;
