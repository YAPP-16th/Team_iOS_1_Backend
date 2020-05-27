import { ShareDocument } from './../../models/share';
import { Context } from 'koa';
import Joi from 'joi';
import Task from '../../models/task';
import Share from '../../models/share';
import mongoose from 'mongoose';

export const isExisted = async (ctx: Context, next: () => void) => {
  const { id } = ctx.params;

  try {
    const share = await Share.findById(id).exec();

    if (!share) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found share',
      };
      return;
    }

    ctx.state.id = id;
    ctx.state.share = share;
  } catch (e) {
    ctx.throw(500, e);
  }

  return next();
};

/* 내가 공유한 리스트
GET /api/shares
*/
export const list = async (ctx: Context) => {
  const user = ctx.state.user;
  const shareIds = user.shareIds;

  try {
    const shares = await Share.find({
      _id: { $in: shareIds },
    }).exec();

    ctx.status = 200;
    ctx.body = {
      description: 'Successed get share list',
      shares: shares,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 공유 보내기
POST /api/shares
{ tagId }
*/
export const sendShare = async (ctx: Context) => {
  const schema = Joi.object().keys({
    tagId: Joi.string().required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

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

    user.shareIds.push(newShare._id);
    await user.save();

    ctx.status = 200;
    ctx.body = {
      description: 'Successed send share',
      user: {
        _id: user._id,
        userId: user.userId,
        nickname: user.nickname,
        shareAlarmIds: user.shareAlarmIds,
      },
      share: newShare,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 공유 받기
POST /api/shares/:shareId
{ tagId }
*/
export const receiveShare = async (ctx: Context) => {
  const schema = Joi.object().keys({
    tagId: Joi.string().required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

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
    user: {
      _id: user._id,
      userId: user.userId,
      nickname: user.nickname,
      tagIds: user.tagIds,
      taskIds: user.taskIds,
    },
  };
};

/* 공유 삭제
DELETE /api/shares/:shareId
*/
export const remove = async (ctx: Context) => {
  const { user, id } = ctx.state;

  try {
    await Share.findByIdAndRemove(id);
  } catch (e) {
    ctx.throw(500, e);
  }

  user.shareIds.pull({ _id: id });

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 204;
  ctx.body = {
    description: 'Successed remove Share',
  };
};
