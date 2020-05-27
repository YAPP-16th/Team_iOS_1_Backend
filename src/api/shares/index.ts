import Router from 'koa-router';
import { checkAuth } from '../../lib/checkAuth';
import * as sharesCtrl from './shares.ctrl';

const shares = new Router();
shares.post('/', checkAuth, sharesCtrl.sendShare);
shares.get('/', checkAuth, sharesCtrl.list);

const share = new Router();
share.post('/', sharesCtrl.receiveShare);
share.delete('/', sharesCtrl.remove);

shares.use('/:id', checkAuth, sharesCtrl.isExisted, share.routes());

export default shares;
