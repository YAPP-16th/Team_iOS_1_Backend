import { Context } from 'koa';
import User from '../models/user';

export const checkAuth = async (ctx: Context, next: () => void) => {
  const token = ctx.request.header['authorization'].split(' ')[1];
  try {
    const user = await User.findByToken(token);

    if (!user) {
      ctx.status = 401;
      ctx.body = {
        description: 'Invaild token',
      };
      return;
    }

    ctx.state.user = user;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};
