import { ShareDocument } from './../../models/share';
import { Context } from 'koa';
import Joi from 'joi';
import Task from '../../models/task';
import Share from '../../models/share';
import mongoose from 'mongoose';
import Frequent from '../../models/frequent';
import Tag from '../../models/tag';

/* local db 와 server db 동기화
POST /api/synchronize
{ frequents, tags, tasks }
*/
export const synchronize = async (ctx: Context) => {
  const schema = Joi.object().keys({
    frequents: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          address: Joi.string().required(),
          coordinates: Joi.array().items(Joi.number()).required(),
        }),
      )
      .required(),
    tags: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          color: Joi.string().required(),
          taskIds: Joi.array().items(Joi.string()),
          creator: Joi.object()
            .keys({
              userId: Joi.string().required(),
              nickname: Joi.string().required(),
            })
            .required(),
        }),
      )
      .required(),
    tasks: Joi.array()
      .items(
        Joi.object().keys({
          title: Joi.string().required(),
          coordinates: Joi.array().items(Joi.number()).required(),
          address: Joi.string().required(),
          tagName: Joi.string().allow(''),
          iconURL: Joi.string().allow(''),
          isFinished: Joi.boolean(),
          isCheckedArrive: Joi.boolean().required(),
          isCheckedLeave: Joi.boolean().required(),
          isCheckedDueDate: Joi.boolean().required(),
          arriveMessage: Joi.string().allow(''),
          leaveMessage: Joi.string().allow(''),
          createdDate: Joi.string().required(),
          dueDate: Joi.string().allow(''),
        }),
      )
      .required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const user = ctx.state.user;

  const { frequents, tags, tasks } = ctx.request.body;

  const frequentsArray = [];
  const tagsArray = [];
  const tasksArray = [];

  for (const frequent of frequents) {
    const newFrequent = new Frequent({
      ...frequent,
    });

    try {
      await newFrequent.save();
    } catch (e) {
      ctx.throw(500, e);
    }

    user.frequentIds.push(newFrequent._id);

    frequentsArray.push(newFrequent);
  }

  for (const tag of tags) {
    const newTag = new Tag({
      ...tag,
    });

    try {
      await newTag.save();
    } catch (e) {
      ctx.throw(500, e);
    }

    user.tagIds.push(newTag._id);

    tagsArray.push(newTag);
  }

  for (const task of tasks) {
    const foundedTag = tagsArray.find((tag) => tag.name == task.tagName);

    let newTaskObject;
    if (foundedTag) {
      const foundedTagObjectId = mongoose.Types.ObjectId(foundedTag._id);

      newTaskObject = {
        ...task,
        tag: foundedTagObjectId,
      };
    } else {
      newTaskObject = {
        ...task,
        tag: null,
      };
    }

    const newTask = new Task(newTaskObject);

    if (foundedTag) {
      foundedTag.taskIds.push(newTask._id);
    }

    try {
      await newTask.save();
    } catch (e) {
      ctx.throw(500, e);
    }

    user.taskIds.push(newTask._id);

    tasksArray.push(newTask);
  }

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 200;
  ctx.body = {
    description: 'Successed synchronize',
    user: {
      _id: user._id,
      userId: user.userId,
      nickname: user.nickname,
      tagIds: user.tagIds,
      taskIds: user.taskIds,
    },
    frequents: frequentsArray,
    tags: tagsArray,
    tasks: tasksArray,
  };
};
