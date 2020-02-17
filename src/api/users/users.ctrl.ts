import { Context } from 'koa';
// import User from '../../models/user';
// import mongoose from 'mongoose';

export const test = (ctx: Context): void => {
  ctx.body = 'test';
};
