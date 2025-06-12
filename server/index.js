'use strict';

import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = 3000;

// Set up the CORS middleware
app.use(cors({}));

// Set up a proxy using http-proxy-middleware for each API
const proxyNewcastleUO = createProxyMiddleware({
  target: 'https://newcastle.urbanobservatory.ac.uk',
  changeOrigin: true,
  logger: console,
});

app.use('/api/nuo', proxyNewcastleUO);

app.listen(port, () => {
  console.log('generest server listening on port ' + port);
});
