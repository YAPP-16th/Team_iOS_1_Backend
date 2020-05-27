import Router from 'koa-router';
import { checkAuth } from '../../lib/checkAuth';
import * as shareAlarmsCtrl from './shareAlarms.ctrl';

const shareAlarms = new Router();
shareAlarms.get('/', checkAuth, shareAlarmsCtrl.list);
shareAlarms.post('/', checkAuth, shareAlarmsCtrl.write);

const shareAlarm = new Router();
shareAlarm.delete('/', shareAlarmsCtrl.remove);

shareAlarms.use(
  '/:id',
  checkAuth,
  shareAlarmsCtrl.isExisted,
  shareAlarm.routes(),
);

export default shareAlarms;
