import { Context } from 'koa';
import { UserDocument } from '../../models/user';
import User from '../../models/user';
import {createToken} from '../../lib/token';
import { verify } from '../../lib/googleAuth';
// import mongoose from 'mongoose';

/* 유저 생성
POST /api/users
{
  userId 
  nickname
  profileImageUrl
}
*/
export const write = async (ctx: Context) => {

  const {idtoken} = ctx.request.body;
  const payload = await verify(idtoken);
  
  if(!payload){
    console.log('Invalid token');
    ctx.status = 401;
    return;
  }
  
  const {
    email: userId,
    name: nickname,
    picture : profileImageUrl
  } = payload;

  const token = await createToken(userId);

  const user : UserDocument = new User({
    userId,
    nickname,
    profileImageUrl,
    token
  })

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
