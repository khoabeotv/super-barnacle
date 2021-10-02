const next = require('next');
const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { json, urlencoded } = require('body-parser');
const { createServer } = require('http');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const middlewares = (server) => {
  server.use(cookieParser());
  server.use(json());
  server.use(urlencoded({ extended: true }));
  server.use(compression());
};

const cachingMiddleware = (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=315360000');
  next();
};

const routes = (server) => {
  server.get(
    /^\/.*\.(png|svg|css|ttf|jpg|ico|mp3)$/,
    cachingMiddleware,
    handle
  );

  server.get('*', handle);
};

app.prepare().then(() => {
  const server = express();

  middlewares(server);
  routes(server);

  createServer(server).listen(8899, (err) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    if (err) throw err;
    console.log('> Ready on http://localhost:8899');
  });
});
