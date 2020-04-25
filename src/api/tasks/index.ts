import Router from 'koa-router';
import { checkAuth } from '../../lib/checkAuth';
import * as tasksCtrl from './tasks.ctrl';

const tasks = new Router();
tasks.get('/',checkAuth ,tasksCtrl.list);
tasks.post('/',checkAuth, tasksCtrl.write);

const task = new Router();

task.get('/', tasksCtrl.taskInfo);
task.delete('/', tasksCtrl.remove);
task.patch('/', tasksCtrl.updateTask);

tasks.use('/:id', checkAuth, tasksCtrl.isExisted ,task.routes());

export default tasks;