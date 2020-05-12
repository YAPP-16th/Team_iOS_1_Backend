import { Context } from 'koa';
import { UserDocument } from '../../models/user';
import User from '../../models/user';
import { createToken } from '../../lib/token';
import { googleVerify } from '../../lib/googleAuth';
import { naverVerify } from '../../lib/naverAuth';
import { kakaoVerify } from '../../lib/kakaoAuth';
import Joi from 'joi';

/* googleAuth 기반 회원가입
POST /api/users/google
{ id, email, access_token }
*/
export const googleLogin = async (ctx: Context) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    email: Joi.string().required(),
    access_token: Joi.string().required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { id, email, access_token } = ctx.request.body;

  try {
    const checkUser = await User.findOne({ userId: email }).exec();

    if (checkUser) {
      ctx.status = 409;
      ctx.body = {
        description: 'Already Signed up user',
        user: checkUser,
      };
      return;
    }
  } catch (e) {
    ctx.throw(500, e);
  }

  const payload = await googleVerify(access_token);

  if (!payload) {
    ctx.status = 401;
    ctx.body = {
      description: 'Invalid access_token',
    };
    return;
  }

  const {
    sub: googleId,
    email: userId,
    name: nickname,
    picture: profileImageUrl,
  } = payload;

  if (id !== googleId || email !== userId) {
    ctx.status = 401;
    ctx.body = {
      description: 'Mismatch between access_token information and id, email',
    };
    return;
  }

  const token = await createToken(userId!);

  const user: UserDocument = new User({
    userId,
    nickname,
    profileImageUrl,
    token,
  });

  try {
    await user.save();
    ctx.status = 201;
    ctx.body = {
      description: 'Successed googleAuth',
      user: user,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* naverAuth 기반 회원가입
POST /api/users/naver
{ id, email, access_token }
*/
export const naverLogin = async (ctx: Context) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    email: Joi.string().required(),
    access_token: Joi.string().required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { id, email, access_token } = ctx.request.body;

  try {
    const checkUser = await User.findOne({ userId: email }).exec();

    if (checkUser) {
      ctx.status = 409;
      ctx.body = {
        description: 'Already Signed up user',
        user: checkUser,
      };
      return;
    }
  } catch (e) {
    ctx.throw(500, e);
  }

  const payload = await naverVerify(access_token);

  if (!payload) {
    ctx.status = 401;
    ctx.body = {
      description: 'Invalid access_token',
    };
    return;
  }

  const {
    id: naverId,
    email: userId,
    name: nickname,
    profile_image: profileImageUrl,
  } = payload;

  if (id !== naverId || email !== userId) {
    ctx.status = 401;
    ctx.body = {
      description: 'Mismatch between access_token information and id, email',
    };
    return;
  }

  const token = await createToken(userId!);

  const user: UserDocument = new User({
    userId,
    nickname,
    profileImageUrl,
    token,
  });

  try {
    await user.save();
    ctx.status = 201;
    ctx.body = {
      description: 'Successed naverAuth',
      user: user,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*kakaoAuth 기반 회원가입
POST /api/users/kakao
{ id, email, access_token}
*/
export const kakaoLogin = async (ctx: Context) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    email: Joi.string().required(),
    access_token: Joi.string().required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    console.log(result.error);
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { id, email, access_token } = ctx.request.body;
  
  try {
    const checkUser = await User.findOne({ userId: email }).exec();

    if (checkUser) {
      ctx.status = 409;
      ctx.body = {
        description: 'Already Signed up user',
        user: checkUser,
      };
      return;
    }
  } catch (e) {
    ctx.throw(500, e);
  }

  const payload = await kakaoVerify(access_token);

  if (!payload) {
    ctx.status = 401;
    ctx.body = {
      description: 'Invalid access_token',
    };
    return;
  }

  const { kakaoId, userId, nickname, profileImageUrl} = payload;

  if (id !== kakaoId || email !== userId) {
    ctx.status = 401;
    ctx.body = {
      description: 'Mismatch between access_token information and id, email',
    };
    return;
  }

  const token = await createToken(userId!);

  const user: UserDocument = new User({
    userId,
    nickname,
    profileImageUrl,
    token,
  });

  try {
    await user.save();
    ctx.status = 201;
    ctx.body = {
      description: 'Successed kakaoAuth',
      user: user,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
}

/* 특정 유저 정보 조회
GET /api/users/:userId
*/
export const userInfo = async (ctx: Context) => {
  const { userId } = ctx.params;

  try {
    const user = await User.findByUserId(userId);

    if (!user) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found user',
      };
      return;
    }

    // 다른 사람의 token을 함부로 볼 수 없게 하기 위한 처리
    const userJSON = user.toJSON();
    delete userJSON.token;

    ctx.status = 200;
    ctx.body = {
      description: 'Successed get user info',
      user: userJSON,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 유저 정보 수정
PATCH /api/users/:userId
{ 수정할필드1, 수정할필드2, ... }
*/
export const updateUser = async (ctx: Context) => {
  const schema = Joi.object().keys({
    userId: Joi.string().allow(''),
    nickname: Joi.string().allow(''),
    profileImageUrl: Joi.string().allow(''),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { userId } = ctx.params;

  const newData = { ...ctx.request.body };

  try {
    const user = await User.findOneAndUpdate({ userId }, newData, {
      new: true,
    }).exec();

    if (!user) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found user',
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      description: 'Successed modify user info',
      user: user,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 유저 회원탈퇴
DELETE /api/users/:userId
*/
export const secession = async (ctx: Context) => {
  const { userId } = ctx.params;
  const requestUser = ctx.state.user;

  if (userId !== requestUser.userId) {
    ctx.status = 401;
    ctx.body = {
      description: 'Mismatch between token information and userId',
    };
    return;
  }

  try {
    const user = await User.findOneAndRemove({ userId }).exec();

    if (!user) {
      ctx.status = 404;
      ctx.body = {
        description: 'Not found user',
      };
      return;
    }

    ctx.status = 204;
    ctx.body = {
      description: 'Successed secession user',
      user: user,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 유저 목록 조회
GET /api/users
*/
export const list = async (ctx: Context) => {
  const page = parseInt(ctx.query.page || '1', 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    // const users = await User.find().exec();

    // id 역순, 10개 pagenation
    const users = await User.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();

    // Last-Page라는 커스텀 HTTP Header 설정
    // 총 page가 몇 개 인지 명시
    const userPageCount = await User.countDocuments().exec();
    ctx.set('Last-Page', Math.ceil(userPageCount / 10).toString());

    ctx.body = users;
  } catch (e) {
    ctx.throw(500, e);
  }
};
