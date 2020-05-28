import Router from 'koa-router';
import { checkAuth } from '../../lib/checkAuth';
import * as synchronizesCtrl from './synchronizes.ctrl';

const synchronizes = new Router();
synchronizes.post('/', checkAuth, synchronizesCtrl.synchronize);

export default synchronizes;
