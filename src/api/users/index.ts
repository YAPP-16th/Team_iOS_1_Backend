import Router from 'koa-router';
import * as usersCtrl from './users.ctrl';
import { checkAuth } from '../../lib/checkAuth';

const users = new Router();
users.get('/', usersCtrl.list);
users.post('/google', usersCtrl.googleLogin);
users.post('/naver', usersCtrl.naverLogin);
users.post('/kakao', usersCtrl.kakaoLogin);
users.post('/facebook', usersCtrl.facebookLogin);

const user = new Router();
user.get('/', usersCtrl.userInfo);
user.delete('/', usersCtrl.secession);
user.patch('/', usersCtrl.updateUser);

users.use('/:userId', checkAuth, user.routes());

export default users;
