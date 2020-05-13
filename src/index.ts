import path from 'path';
import dotenv from 'dotenv';

import Koa, { Context } from 'koa';
import Router from 'koa-router';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import koaSwagger from 'koa2-swagger-ui';
import swaggerJSDoc from 'swagger-jsdoc';

import mongoose from 'mongoose';

import api from './api';
import morgan from 'koa-morgan';

import { stream } from './config/winston';

if (process.env.NODE_ENV === 'prod') {
  dotenv.config({ path: path.join(__dirname, '../env/.env.prod') });
} else if (process.env.NODE_ENV === 'develop') {
  dotenv.config({ path: path.join(__dirname, '../env/.env.dev') });
} else {
  throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
}

const app = new Koa();
const router = new Router();
const { PORT, SWAGGER_URI } = process.env;
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

// Swagger 설정
const swaggerDefinition = {
  info: {
    // API informations (required)
    title: '곳감 API Specification', // Title (required)
    version: '1.5.0', // Version (required)
    description: '곳감 API', // Description (optional)
  },
  schemes: ['http'],
};
const options = {
  swaggerDefinition,
  apis: ['./src/api/**/*.spec.yaml'],
};
const swaggerSpec = swaggerJSDoc(options);

router.get('/swagger.json', async (ctx: Context) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
  return;
});

// Middleware
app.use(json());
app.use(morgan('combined', { stream }));
app.use(bodyParser());
app.use(
  koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
      url: SWAGGER_URI,
    },
  }),
);

// 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => console.log('Server started.'));
