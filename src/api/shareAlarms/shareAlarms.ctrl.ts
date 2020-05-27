import { Context } from 'koa';
import Joi from 'joi';
import ShareAlarm from '../../models/shareAlarm';

export const isExisted = async (ctx: Context, next: () => void) => {
  const { id } = ctx.params;

  try {
    const shareAlarm = await ShareAlarm.findById(id).exec();

    if (!shareAlarm) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found shareAlarm',
      };
      return;
    }

    ctx.state.id = id;
    ctx.state.shareAlarm = shareAlarm;
  } catch (e) {
    ctx.throw(500, e);
  }

  return next();
};

/* 공유 알림 리스트
GET /api/shareAlarms
*/
export const list = async (ctx: Context) => {
  const user = ctx.state.user;
  const shareAlarmIds = user.shareAlarmIds;

  try {
    const shareAlarms = await ShareAlarm.find({
      _id: { $in: shareAlarmIds },
    }).exec();

    ctx.status = 200;
    ctx.body = {
      description: 'Successed get shareAlarm list',
      shareAlarms: shareAlarms,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 공유 알림 생성
POST /api/shareAlarms
{ tag: { name, color }, shareId, creator: { userId, nickname } }
*/
export const write = async (ctx: Context) => {
  const schema = Joi.object().keys({
    tag: Joi.object()
      .keys({
        name: Joi.string().required(),
        color: Joi.string().required(),
      })
      .required(),
    shareId: Joi.string().required(),
    creator: Joi.object()
      .keys({
        userId: Joi.string().required(),
        nickname: Joi.string().required(),
      })
      .required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const user = ctx.state.user;
  const shareAlarm = new ShareAlarm({ ...ctx.request.body });

  try {
    await shareAlarm.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  const shareAlarmObjectId = shareAlarm._id;
  user.shareAlarmIds.push(shareAlarmObjectId);

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 200;
  ctx.body = {
    description: 'Successed write ShareAlarm',
    user: {
      _id: user._id,
      userId: user.userId,
      nickname: user.nickname,
      shareAlarmIds: user.shareAlarmIds,
    },
    shareAlarm: shareAlarm,
  };
};

/* 공유 알림 삭제
DELETE /api/shareAlarms/:shareAlarmId
*/
export const remove = async (ctx: Context) => {
  const { user, id } = ctx.state;

  try {
    await ShareAlarm.findByIdAndRemove(id);
  } catch (e) {
    ctx.throw(500, e);
  }

  user.shareAlarmIds.pull({ _id: id });

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 204;
  ctx.body = {
    description: 'Successed remove ShareAlarm',
  };
};
