import Router from 'koa-router';
import { checkAuth } from '../../lib/checkAuth';
import * as sharesCtrl from './shares.ctrl';

const shares = new Router();
shares.post('/', checkAuth, sharesCtrl.sendShare);
shares.post('/:shareId', checkAuth, sharesCtrl.receiveShare);

export default shares;
