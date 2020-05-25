import { FrequentDocument } from './../../models/frequent';
import { Context } from 'koa';
import Frequent from '../../models/frequent';
import Joi from 'joi';

export const isExisted = async (ctx: Context, next: () => void) => {
  const { id } = ctx.params;

  try {
    const frequent = await Frequent.findById(id).exec();

    if (!frequent) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found frequent',
      };
      return;
    }

    ctx.state.id = id;
    ctx.state.frequent = frequent;

    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 자주가는 곳 등록
POST /api/frequents
{ name, address, coordinates }
*/
export const write = async (ctx: Context) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const user = ctx.state.user;

  const frequent = new Frequent({ ...ctx.request.body });

  try {
    frequent.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  user.frequentIds.push(frequent._id);

  try {
    await user.save();
  } catch (e) {
    if (e.name === 'ValidationError') {
      ctx.status = 400;
      ctx.body = {
        description: 'Frequents Exceeds the limit of 5',
      };
      return;
    } else {
      ctx.throw(500, e);
    }
  }

  ctx.status = 201;
  ctx.body = {
    description: 'Successed write frequent',
    user: {
      _id: user._id,
      userId: user.userId,
      nickname: user.nickname,
      taskIds: user.taskIds,
    },
    frequent: frequent,
  };
};

/* 특정 자주가는 곳 정보
GET /api/frequents/:id
*/
export const read = async (ctx: Context) => {
  const { frequent } = ctx.state;

  ctx.status = 200;
  ctx.body = {
    description: 'Successed get frequent info',
    frequent,
  };
};

/* 특정 자주가는 곳 업데이트
PATCH /api/frequents/:id
{ 수정할필드1, 수정할필드2, ... }
*/
export const update = async (ctx: Context) => {
  const schema = Joi.object().keys({
    name: Joi.string().allow(''),
    address: Joi.string().allow(''),
    coordinates: Joi.array().items(Joi.number()),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { user, id } = ctx.state;

  const newData = { ...ctx.request.body };

  try {
    const frequent = await Frequent.findOneAndUpdate({ _id: id }, newData, {
      new: true,
    }).exec();

    if (!frequent) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found frequent',
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      description: 'Successed modify frequent info',
      frequent: frequent,
    };
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 204;
  ctx.body = user;
};

/* 특정 자주가는 곳 삭제
DELETE /api/frequents/:id
*/
export const remove = async (ctx: Context) => {
  const { user, id } = ctx.state;

  user.frequentIds.pull({ _id: id });

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  try {
    await Frequent.findByIdAndRemove({ _id: id });
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 204;
  ctx.body = {
    description: 'Successed remove frequent',
  };
};

/* 자주가는 곳 리스트
GET /api/frequents
*/
export const list = async (ctx: Context) => {
  const user = ctx.state.user;
  const frequentIds = user.frequentIds;

  try {
    const frequents = await Frequent.find({ _id: { $in: frequentIds } }).exec();
    ctx.status = 200;
    ctx.body = {
      description: 'Successed get frequent list',
      frequents,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
