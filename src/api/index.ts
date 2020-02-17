import Router from 'koa-router';
import users from './users';

const api = new Router();

api.use('/users', users.routes());

export default api;
