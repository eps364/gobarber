import jwt from 'jsonwebtoken';
import { promisify } from 'util';

require('dotenv');

export default async (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader)
    return response.status(401).json({ error: 'Token not provider' });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
    request.userId = decoded.id;
    request.userName = decoded.name;
    request.userEmail = decoded.email;
    return next();
  } catch (err) {
    return response.status(401).json({ error: 'Token invalid' });
  }
};
