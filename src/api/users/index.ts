import Router from 'koa-router';
import * as usersCtrl from './users.ctrl';

const users = new Router();

users.get('/', usersCtrl.list);
users.post('/', usersCtrl.googleLogin);

export default users;
