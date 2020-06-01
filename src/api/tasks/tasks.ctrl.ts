import { TaskDocument } from './../../models/task';
import { Context } from 'koa';
import Task from '../../models/task';
import Joi from 'joi';
import mongoose from 'mongoose';
import Tag from '../../models/tag';

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
{ title, coordinates, address, tag, iconURL, 
  isFinished, isCheckedArrive, isCheckedLeave, 
  arriveMessage, leaveMessage,
  createdDate, dueDate }
*/
export const write = async (ctx: Context) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).required(),
    address: Joi.string().required(),
    tag: Joi.string().allow(''),
    iconURL: Joi.string().allow(''),
    isFinished: Joi.boolean(),
    isCheckedArrive: Joi.boolean().required(),
    isCheckedLeave: Joi.boolean().required(),
    arriveMessage: Joi.string().allow(''),
    leaveMessage: Joi.string().allow(''),
    createdDate: Joi.date(),
    dueDate: Joi.date(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  let tagId;
  if (ctx.request.body.tag && ctx.request.body.tag.length !== 0) {
    tagId = mongoose.Types.ObjectId(ctx.request.body.tag);
    ctx.request.body = {
      ...ctx.request.body,
      tag: tagId,
    };
  }

  const user = ctx.state.user;
  const task = new Task({ ...ctx.request.body });

  //task Document 추가
  try {
    await task.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  if (tagId) {
    try {
      const tag = await Tag.findById({ _id: tagId }).exec();

      if (!tag) {
        ctx.status = 404;
        ctx.body = {
          description: 'Not found tag',
        };
        return;
      }

      tag.taskIds.push(task._id);
      await tag.save();
    } catch (e) {
      ctx.throw(500, e);
    }
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
    user: {
      _id: user._id,
      userId: user.userId,
      nickname: user.nickname,
      taskIds: user.taskIds,
    },
    task: task,
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
  const schema = Joi.object().keys({
    title: Joi.string().allow(''),
    coordinates: Joi.array().items(Joi.number()),
    address: Joi.string().allow(''),
    tag: Joi.string().allow(''),
    iconURL: Joi.string().allow(''),
    isFinished: Joi.boolean(),
    isCheckedArrive: Joi.boolean(),
    isCheckedLeave: Joi.boolean(),
    arriveMessage: Joi.string().allow(''),
    leaveMessage: Joi.string().allow(''),
    createdDate: Joi.date(),
    dueDate: Joi.date(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { id, task } = ctx.state;

  let tagId;
  if (ctx.request.body.tag) {
    tagId = mongoose.Types.ObjectId(ctx.request.body.tag);

    ctx.request.body = {
      ...ctx.request.body,
      tag: tagId,
    };
  }

  const prevTagId = task.tag;

  try {
    await Task.findByIdAndUpdate(id, ctx.request.body).exec();
  } catch (e) {
    ctx.throw(500, e);
  }

  if (tagId) {
    try {
      const tag = await Tag.findById({ _id: tagId }).exec();

      if (!tag) {
        ctx.status = 404;
        ctx.body = {
          description: 'Not found tag',
        };
        return;
      }

      tag.taskIds.push(id);
      await tag.save();
    } catch (e) {
      ctx.throw(500, e);
    }
  }

  if (prevTagId) {
    try {
      const tag: any = await Tag.findById({ _id: prevTagId }).exec();

      if (!tag) {
        ctx.status = 404;
        ctx.body = {
          description: 'Not found tag',
        };
        return;
      }

      tag.taskIds.pull(id);
      await tag.save();
    } catch (e) {
      ctx.throw(500, e);
    }
  }

  ctx.status = 204;
};

/* 태스크 전부 삭제
POST /api/tasks/all
*/
export const removeAll = async (ctx: Context) => {
  const { user } = ctx.state;
  const taskIds = user.taskIds;

  for (const taskId of taskIds) {
    try {
      await Task.findByIdAndRemove({ _id: taskId });
    } catch (e) {
      ctx.throw(500, e);
    }
  }

  user.taskIds = [];

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 204;
  ctx.body = {
    description: 'Successed remove all task',
  };
};
