import Router from 'koa-router';
import users from './users';
import frequents from './frequents';
import tasks from './tasks';

const api = new Router();

api.use('/users', users.routes());
api.use('/frequents', frequents.routes());
api.use('/tasks', tasks.routes());

export default api;
