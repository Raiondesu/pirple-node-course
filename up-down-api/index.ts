import '../.env.ts';

/**
 * Entry API file
 */

import { createServer } from 'http';
import { parse as parseUrl } from 'url';
import { StringDecoder } from 'string_decoder';
import { fromPath, route } from './misc';
import { Route } from './types';
import config from './config';
import Server from './server';
import routes from './routes';

const httpServer = new Server('http', config.httpPort, routes);
const httpsServer = new Server('https', config.httpsPort, routes);
