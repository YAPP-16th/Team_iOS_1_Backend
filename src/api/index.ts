import Router from 'koa-router';
import users from './users';
import frequents from './frequents';

const api = new Router();

api.use('/users', users.routes());
api.use('/frequents', frequents.routes());

export default api;
