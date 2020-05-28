import Router from 'koa-router';
import { checkAuth } from '../../lib/checkAuth';
import * as tagsCtrl from './tags.ctrl';

const tags = new Router();
tags.get('/', checkAuth, tagsCtrl.list);
tags.post('/', checkAuth, tagsCtrl.write);
tags.delete('/all', checkAuth, tagsCtrl.removeAll);

const tag = new Router();
tag.get('/', tagsCtrl.tagInfo);
tag.delete('/', tagsCtrl.remove);
tag.patch('/', tagsCtrl.updateTag);

tags.use('/:id', checkAuth, tagsCtrl.isExisted, tag.routes());

export default tags;
