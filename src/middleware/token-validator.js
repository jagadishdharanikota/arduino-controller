import jwt from 'jsonwebtoken';

function isValidToken(req) {
  const authorizationHeader = req.headers.Authorization;
  const token = authorizationHeader && authorizationHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default function validateToken(req, res, next) {
  if (!isValidToken(req)) {
    res.sendStatus(401);
  }

  next();
}
