import { Router } from 'express';

const routes = new Router();

routes.get('/', (request, response) =>
    response.json({ message: 'Ola, Aplicação Rodando!' })
);

export default routes;
