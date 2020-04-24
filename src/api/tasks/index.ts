import Router from 'koa-router';
import { checkAuth } from '../../lib/checkAuth';
import * as tasksCtrl from './tasks.ctrl';

const tasks = new Router();
tasks.get('/', tasksCtrl.list);

const task = new Router();

task.get('/', tasksCtrl.taskInfo);
task.post('/', tasksCtrl.write);
task.delete('/', tasksCtrl.secession);
task.patch('/', tasksCtrl.updateTask);

//tasks.use('/:id', checkAuth, tasksCtrl.isExisted, tasks.routes());

export default tasks;