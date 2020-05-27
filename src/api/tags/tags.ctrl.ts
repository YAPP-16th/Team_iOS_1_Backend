import { TaskDocument } from './../../models/task';
import { Context } from 'koa';
import Task from '../../models/task';
import Joi from 'joi';
import Tag from '../../models/tag';

export const isExisted = async (ctx: Context, next: () => void) => {
  const { id } = ctx.params;

  try {
    const tag = await Tag.findById(id).exec();

    if (!tag) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found tag',
      };
      return;
    }

    ctx.state.id = id;
    ctx.state.tag = tag;
  } catch (e) {
    ctx.throw(500, e);
  }

  return next();
};

/* Tag 목록 리스트
GET /api/tags
*/
export const list = async (ctx: Context) => {
  const user = ctx.state.user;
  const tagIds = user.tagIds;

  try {
    const tags = await Tag.find({ _id: { $in: tagIds } }).exec();
    ctx.status = 200;
    ctx.body = {
      description: 'Successed get tag list',
      tags: tags,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 특정 Tag 작성
POST /api/tags
{ name, color, creator }
*/
export const write = async (ctx: Context) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    color: Joi.string().required(),
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
  const tag = new Tag({ ...ctx.request.body });

  try {
    await tag.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  const tagObjectId = tag._id;
  user.tagIds.push(tagObjectId);

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 200;
  ctx.body = {
    description: 'Successed write Tag',
    user: {
      _id: user._id,
      userId: user.userId,
      nickname: user.nickname,
      tagIds: user.tagIds,
    },
    tag: tag,
  };
};

/* 특정 Tag 정보 읽기
GET /api/tags/:id
*/
export const tagInfo = async (ctx: Context) => {
  const { tag } = ctx.state;

  ctx.status = 200;
  ctx.body = {
    description: 'Successed get Tag',
    tag: tag,
  };
};

/* 특정 Tag 삭제
DELETE /api/tags/:id
*/
export const remove = async (ctx: Context) => {
  const { user, id, tag } = ctx.state;

  try {
    await Tag.findByIdAndRemove({ _id: id });
  } catch (e) {
    ctx.throw(500, e);
  }

  user.tagIds.pull({ _id: id });

  try {
    await user.save();
  } catch (e) {
    ctx.throw(500, e);
  }

  const taskIds = tag.taskIds;

  for (const taskId of taskIds) {
    try {
      await Task.findByIdAndUpdate(taskId, {
        tag: null,
      });
    } catch (e) {
      ctx.throw(500, e);
    }
  }

  ctx.status = 204;
  ctx.body = {
    description: 'Successed remove Tag',
  };
};

/* 특정 Tag 업데이트
PATCH /api/tags/:id
{ 수정할필드1, 수정할필드2, ... }
*/
export const updateTag = async (ctx: Context) => {
  const schema = Joi.object().keys({
    name: Joi.string(),
    color: Joi.string(),
    creator: Joi.object().keys({
      userId: Joi.string(),
      nickname: Joi.string(),
    }),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { id } = ctx.state;

  try {
    await Tag.findByIdAndUpdate(id, ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 204;
};
