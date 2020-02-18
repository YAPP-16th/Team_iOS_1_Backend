import { Context } from 'koa';
import User from '../../models/user';
// import mongoose from 'mongoose';

/* 유저 생성
POST /api/users
{ userId, password }
*/
export const write = async (ctx: Context) => {
  const { userId, password } = ctx.request.body;
  const user = new User({
    userId,
    password,
  });
  try {
    await user.save();
    ctx.body = user;
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
