import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../utils/http.js';

const router = Router();
router.use(authenticate);
router.use(allowRoles('SUPERADMIN','ADMIN'));

router.get('/', asyncHandler(async (_req,res)=>{
  const users = await prisma.user.findMany({ select:{id:true,name:true,email:true,role:true,avatar:true,active:true,createdAt:true}, orderBy:{createdAt:'asc'} });
  res.json({users});
}));

router.post('/', allowRoles('SUPERADMIN'), asyncHandler(async (req,res)=>{
  const schema=z.object({name:z.string().min(2),email:z.string().email(),password:z.string().min(8),role:z.enum(['SUPERADMIN','ADMIN','SALES']),active:z.boolean().optional()});
  const p=schema.safeParse(req.body);if(!p.success)throw new ApiError(400,p.error.issues[0].message);
  const password=await bcrypt.hash(p.data.password,12);
  const user=await prisma.user.create({data:{...p.data,email:p.data.email.toLowerCase(),password,avatar:p.data.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()},select:{id:true,name:true,email:true,role:true,active:true,avatar:true}});
  res.status(201).json({user});
}));

router.put('/:id', allowRoles('SUPERADMIN'), asyncHandler(async(req,res)=>{
  const schema=z.object({name:z.string().min(2).optional(),role:z.enum(['SUPERADMIN','ADMIN','SALES']).optional(),active:z.boolean().optional(),password:z.string().min(8).optional()});
  const p=schema.safeParse(req.body);if(!p.success)throw new ApiError(400,p.error.issues[0].message);
  const data={...p.data};if(data.password)data.password=await bcrypt.hash(data.password,12);
  const user=await prisma.user.update({where:{id:req.params.id},data,select:{id:true,name:true,email:true,role:true,active:true,avatar:true}});
  res.json({user});
}));
export default router;
