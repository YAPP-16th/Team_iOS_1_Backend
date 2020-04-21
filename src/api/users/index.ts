import Router from 'koa-router';
import * as usersCtrl from './users.ctrl';
import { checkAuth } from '../../lib/checkAuth';

const users = new Router();

users.get('/', usersCtrl.list);
users.post('/', usersCtrl.googleLogin);
users.get('/:userId', usersCtrl.userInfo);
users.delete('/:userId', checkAuth, usersCtrl.secession);
users.patch('/:userId', checkAuth, usersCtrl.updateUser);

export default users;
