import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { ApiError, asyncHandler } from '../utils/http.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new ApiError(401, 'Authentication required');
  const token = header.slice(7);
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { throw new ApiError(401, 'Invalid or expired token'); }

  const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, name: true, email: true, role: true, avatar: true, active: true } });
  if (!user?.active) throw new ApiError(401, 'Account is unavailable');
  req.user = user;
  next();
});

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(new ApiError(403, 'You do not have permission for this action'));
  next();
};
