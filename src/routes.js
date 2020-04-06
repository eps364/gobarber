import { Router, request, response } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (request, response) =>
  response.json({ message: 'Ola, Aplicação Rodando!' })
);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.get('/users/:id', UserController.show);
routes.put('/users', UserController.update);
routes.delete('/users/:id', UserController.delete);

export default routes;
