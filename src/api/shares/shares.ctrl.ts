import { ShareDocument } from './../../models/share';
import { Context } from 'koa';
import Joi from 'joi';
import Task from '../../models/task';
import Share from '../../models/share';
import mongoose from 'mongoose';

/* 공유 보내기
POST /api/shares
{ tagId }
*/
export const sendShare = async (ctx: Context) => {
  const { tagId } = ctx.request.body;

  const user = ctx.state.user;
  const taskIds = user.taskIds;

  try {
    const tasks = await Task.find({
      _id: { $in: taskIds },
      tag: tagId,
    }).exec();

    tasks.map((task) => {
      task.isFinished = false;
    });

    const newShare: ShareDocument = new Share({
      tasks,
      senderId: user.userId,
    });
    await newShare.save();

    ctx.status = 200;
    ctx.body = {
      description: 'Successed send share',
      share: newShare,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 공유 알림 생성
POST /api/shares/alarm
{ tagId }
*/

/* 공유 받기
POST /api/shares/:shareId
{ tagId }
*/
export const receiveShare = async (ctx: Context) => {
  const { shareId } = ctx.params;
  const { tagId } = ctx.reqeust.body;

  let share;

  try {
    share = await Share.findById({ _id: shareId }).exec();

    if (!share) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found share',
      };
      return;
    }
  } catch (e) {
    ctx.throw(500, e);
  }

  const user = ctx.state.user;

  for (const task of share.tasks) {
    const taskJSON = task.toJSON();
    delete taskJSON._id;
    delete taskJSON.__v;

    const newTask = new Task({
      ...taskJSON,
    });

    try {
      await newTask.save();
    } catch (e) {
      ctx.throw(500, e);
    }

    user.taskIds.push(newTask._id);
  }

  user.tagIds.push(mongoose.Types.ObjectId(tagId));

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 200;
  ctx.body = {
    description: 'Successed receive share',
    user,
  };
};
