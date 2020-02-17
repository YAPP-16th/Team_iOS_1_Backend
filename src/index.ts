import path from 'path';
import dotenv from 'dotenv';

import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';

if (process.env.NODE_ENV === 'prod') {
  dotenv.config({ path: path.join(__dirname, '../env/.env.prod') });
} else if (process.env.NODE_ENV === 'develop') {
  dotenv.config({ path: path.join(__dirname, '../env/.env.dev') });
} else {
  throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
}

const app = new Koa();
const router = new Router();
const { PORT } = process.env;
const MONGO_URI = process.env.MONGO_URI!;

// DB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e: Error) => {
    console.error(e);
  });

// 라우터 설정
router.use('/api', api.routes());

// Middleware
app.use(json());
app.use(logger());
app.use(bodyParser());

// 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => console.log('Server started.'));
