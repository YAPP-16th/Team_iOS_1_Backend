import Router from 'koa-router';
import users from './users';
import frequents from './frequents';
import tasks from './tasks';
import tags from './tags';

const api = new Router();

api.use('/users', users.routes());
api.use('/frequents', frequents.routes());
api.use('/tasks', tasks.routes());
api.use('/tags', tags.routes());

export default api;
