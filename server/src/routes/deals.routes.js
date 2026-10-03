import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { ApiError, asyncHandler } from '../utils/http.js';

const router=Router(); router.use(authenticate);
const stages=['PROSPECTING','QUALIFICATION','PROPOSAL','NEGOTIATION','WON','LOST'];
const schema=z.object({title:z.string().min(2),company:z.string().optional(),value:z.coerce.number().nonnegative(),stage:z.enum(stages).optional(),probability:z.coerce.number().min(0).max(100).optional(),closeDate:z.string().optional().nullable(),notes:z.string().optional(),contactId:z.string().optional().nullable(),ownerId:z.string().optional()});
const scope=(req)=>req.user.role==='SALES'?{ownerId:req.user.id}:{};
router.get('/',asyncHandler(async(req,res)=>res.json({deals:await prisma.deal.findMany({where:scope(req),orderBy:{updatedAt:'desc'},include:{owner:{select:{id:true,name:true,avatar:true}},contact:true}})})));
router.post('/',asyncHandler(async(req,res)=>{const p=schema.safeParse(req.body);if(!p.success)throw new ApiError(400,p.error.issues[0].message);const ownerId=req.user.role==='SALES'?req.user.id:p.data.ownerId||req.user.id;const data={...p.data,ownerId,closeDate:p.data.closeDate?new Date(p.data.closeDate):null};const deal=await prisma.deal.create({data});await prisma.activity.create({data:{type:'DEAL',message:`Created deal ${deal.title}`,userId:req.user.id,dealId:deal.id}});res.status(201).json({deal});}));
router.put('/:id',asyncHandler(async(req,res)=>{const current=await prisma.deal.findFirst({where:{id:req.params.id,...scope(req)}});if(!current)throw new ApiError(404,'Deal not found');const p=schema.partial().safeParse(req.body);if(!p.success)throw new ApiError(400,p.error.issues[0].message);const data={...p.data};if(req.user.role==='SALES')delete data.ownerId;if(data.closeDate)data.closeDate=new Date(data.closeDate);const deal=await prisma.deal.update({where:{id:current.id},data});res.json({deal});}));
router.delete('/:id',asyncHandler(async(req,res)=>{const current=await prisma.deal.findFirst({where:{id:req.params.id,...scope(req)}});if(!current)throw new ApiError(404,'Deal not found');await prisma.deal.delete({where:{id:current.id}});res.status(204).end();}));
export default router;
