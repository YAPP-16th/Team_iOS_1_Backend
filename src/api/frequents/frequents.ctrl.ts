import { FrequentDocument } from './../../models/frequent';
import { Context } from 'koa';
import Frequent from '../../models/frequent';

export const isExisted = async (ctx: Context, next: () => void) => {
  const user = ctx.state.user;

  const { id } = ctx.params;

  const frequentIdx = user.frequents.findIndex(
    (frequent: FrequentDocument) => frequent._id == id,
  );

  if (frequentIdx === -1) {
    ctx.status = 404;
    ctx.body = {
      description: 'Not found frequent',
    };
    return;
  }

  ctx.state.id = id;
  ctx.state.frequentIdx = frequentIdx;

  return next();
};

/* 자주가는 곳 등록
POST /api/frequents
{ name, address, coordinates }
*/
export const write = async (ctx: Context) => {
  const user = ctx.state.user;

  const frequent = new Frequent({ ...ctx.request.body });

  user.frequents.push(frequent);

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
    user: user,
  };
};

/* 특정 자주가는 곳 정보
GET /api/frequents/:id
*/
export const read = async (ctx: Context) => {
  const { user, frequentIdx } = ctx.state;

  ctx.status = 200;
  ctx.body = {
    description: 'Successed get frequent info',
    frequent: user.frequents[frequentIdx],
  };
};

/* 특정 자주가는 곳 업데이트
PATCH /api/frequents/:id
{ 수정할필드1, 수정할필드2, ... }
*/
export const update = async (ctx: Context) => {
  const { user, frequentIdx } = ctx.state;

  user.frequents[frequentIdx] = {
    ...ctx.request.body,
  };

  try {
    await user.save();
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

  user.frequents.pull({ _id: id });

  try {
    await user.save();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 자주가는 곳 리스트
GET /api/frequents
*/
export const list = async (ctx: Context) => {
  const user = ctx.state.user;

  ctx.status = 200;
  ctx.body = {
    description: 'Successed get frequents list',
    frequents: user.frequents,
  };
};
