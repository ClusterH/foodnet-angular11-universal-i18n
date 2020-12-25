import '@angular/localize/init';
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';

import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { NgxRequest, NgxResponse } from '@gorniv/ngx-universal';
import * as compression from 'compression';
import * as cookieparser from 'cookie-parser';
import * as proxy from 'http-proxy-middleware';

import { exit } from 'process';
// for debug
require('source-map-support').install();

// for tests
const test = process.env['TEST'] === 'true';

// The Express app is exported so that it can be used by serverless Functions.
export function app(lang: string) {
  // ssr DOM
  const domino = require('domino');
  const fs = require('fs');
  const path = require('path');
  // index from browser build!
  const template = fs.readFileSync(path.join('.', 'dist', 'foodnet', 'browser', `${lang}`, 'index.html')).toString();
  // for mock global window by domino
  const win = domino.createWindow(template);
  // from server build
  // const files = fs.readdirSync(`${process.cwd()}/dist/foodnet/server/${lang}`);
  // mock
  global['window'] = win;
  // not implemented property and functions
  Object.defineProperty(win.document.body.style, 'transform', {
    value: () => {
      return {
        enumerable: true,
        configurable: true
      };
    }
  });
  // mock documnet
  global['document'] = win.document;
  // othres mock
  global['CSS'] = null;
  // global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
  global['Prism'] = null;

  const server = express();
  const distFolder = join(process.cwd(), 'dist', 'foodnet', 'browser', `${lang}`);
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  const apiProxy = proxy('/api', { target: 'http://localhost:3000' });
  server.use('/api', apiProxy);


  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y'
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    // global['navigator'] = req['headers']['user-agent'];
    const http =
      req.headers['x-forwarded-proto'] === undefined ? 'http' : req.headers['x-forwarded-proto'];

    // this is for i18n
    const supportedLocales = ['ro', 'en', 'hu'];
    const defaultLocale = 'ro';
    const matches = req.url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);

    // check if the requested url has a correct format '/locale' and matches any of the supportedLocales
    const locale = (matches && supportedLocales.indexOf(matches[1]) !== -1) ? matches[1] : defaultLocale;

    const renderUrl = (locale !== defaultLocale) ? `${locale}/${indexHtml}` : indexHtml;

    res.render(renderUrl, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },

        // for http and cookies
        {
          provide: REQUEST,
          useValue: req
        },
        {
          provide: RESPONSE,
          useValue: res
        },
        /// for cookie
        {
          provide: NgxRequest,
          useValue: req
        },
        {
          provide: NgxResponse,
          useValue: res
        },
        // for absolute path
        {
          provide: 'ORIGIN_URL',
          useValue: `${http}://${req.headers.host}`
        }
      ]
    });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const appRo = app('ro');
  const appHu = app('hu');
  const appEn = app('en');

  const server = express();
  server.use('/ro', appRo);
  server.use('/hu', appHu);
  server.use('/en', appEn);
  server.use('', appRo);

  // gzip
  server.use(compression({ level: 5 }));
  // cokies
  server.use(cookieparser());

  server.listen(port, () => {

  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
