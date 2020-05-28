import Router from 'koa-router';
import { checkAuth } from '../../lib/checkAuth';
import * as frequentsCtrl from './frequents.ctrl';

const frequents = new Router();
frequents.post('/', checkAuth, frequentsCtrl.write);
frequents.get('/', checkAuth, frequentsCtrl.list);
frequents.delete('/all', checkAuth, frequentsCtrl.removeAll);

const frequent = new Router();
frequent.get('/', frequentsCtrl.read);
frequent.patch('/', frequentsCtrl.update);
frequent.delete('/', frequentsCtrl.remove);

frequents.use('/:id', checkAuth, frequentsCtrl.isExisted, frequent.routes());

export default frequents;
