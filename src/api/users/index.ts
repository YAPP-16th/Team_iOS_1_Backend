import Router from 'koa-router';
import * as usersCtrl from './users.ctrl';
import { checkAuth } from '../../lib/checkAuth';
import { RateLimit } from 'koa2-ratelimit';

const userRegisterLimiter = RateLimit.middleware({
  interval: { sec: 5 },
  max: 1,
});

const users = new Router();
users.get('/', usersCtrl.list);
users.post(
  '/google',
  userRegisterLimiter,
  usersCtrl.googleLogin,
  usersCtrl.verifyUser,
);
users.post(
  '/naver',
  userRegisterLimiter,
  usersCtrl.naverLogin,
  usersCtrl.verifyUser,
);
users.post(
  '/kakao',
  userRegisterLimiter,
  usersCtrl.kakaoLogin,
  usersCtrl.verifyUser,
);
users.post(
  '/facebook',
  userRegisterLimiter,
  usersCtrl.facebookLogin,
  usersCtrl.verifyUser,
);

const user = new Router();
user.get('/', usersCtrl.userInfo);
user.delete('/', usersCtrl.secession);
user.patch('/', usersCtrl.updateUser);

users.use('/:userId', checkAuth, user.routes());

export default users;
