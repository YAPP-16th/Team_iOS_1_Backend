import { TaskDocument } from './../../models/task';
import { Context } from 'koa';
import Task from '../../models/task';

export const isExisted = async (ctx: Context, next: () => void) => {
  const { id } = ctx.params;

  try {
    const task = await Task.findById(id).exec();

    if (!task) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found task',
      };
      return;
    }

    ctx.state.id = id;
    ctx.state.task = task;
  } catch (e) {
    ctx.throw(500, e);
  }

  return next();
};

/* Task 목록 리스트
GET /api/tasks
*/
export const list = async (ctx: Context) => {
  const user = ctx.state.user;
  const taskIds = user.taskIds;

  try {
    const tasks = await Task.find({ _id: { $in: taskIds } }).exec();
    ctx.status = 200;
    ctx.body = {
      description: 'Successed get task list',
      tasks: tasks,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
/* 특정 Task 정보 읽기
GET /api/tasks/:id
*/
export const taskInfo = async (ctx: Context) => {
  const { task } = ctx.state;

  ctx.status = 200;
  ctx.body = {
    description: 'Successed get Task',
    task: task,
  };
};

/* 특정 Task 작성
POST /api/tasks
{ title, coordinates, tags, memo, iconURL, isFinished, dueDate}
*/
export const write = async (ctx: Context) => {
  const user = ctx.state.user;
  const task = new Task({ ...ctx.request.body });

  //task Document 추가
  try {
    await task.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  //User Document에서 Task ObjectId 참조
  const taskObjectId = task._id;
  user.taskIds.push(taskObjectId);

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 200;
  ctx.body = {
    description: 'Successed write Task',
    user: user,
  };
};

/* 특정 Task 삭제
DELETE /api/tasks/:id
*/
export const remove = async (ctx: Context) => {
  const { user, id } = ctx.state;

  user.taskIds.pull({ _id: id });

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  try {
    await Task.findByIdAndRemove({ _id: id });
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 204;
  ctx.body = {
    description: 'Successed remove Task',
  };
};

/* 특정 Task 업데이트
PATCH /api/tasks/:id
{ 수정할필드1, 수정할필드2, ... }
*/
export const updateTask = async (ctx: Context) => {
  const { id } = ctx.state;

  try {
    await Task.findByIdAndUpdate(id, ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 204;
};
