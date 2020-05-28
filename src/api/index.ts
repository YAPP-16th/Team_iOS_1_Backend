import Router from 'koa-router';
import users from './users';
import frequents from './frequents';
import tasks from './tasks';
import tags from './tags';
import shares from './shares';
import shareAlarms from './shareAlarms';
import synchronizes from './synchronizes';

const api = new Router();

api.use('/users', users.routes());
api.use('/frequents', frequents.routes());
api.use('/tasks', tasks.routes());
api.use('/tags', tags.routes());
api.use('/shares', shares.routes());
api.use('/shareAlarms', shareAlarms.routes());
api.use('/synchronizes', synchronizes.routes());

export default api;
