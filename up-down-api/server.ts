import { Server as InsecureServer, IncomingMessage, ServerResponse } from 'http';
import { createServer, Server as SecureServer, ServerOptions } from 'https';
import { parse as parseUrl } from 'url';
import { StringDecoder } from 'string_decoder';
import { fromPath, route } from './misc';
import { Route } from './types';
import config from './config';
import { readFileSync } from 'fs';

export default class Server {
  private realServer: InsecureServer | SecureServer;

  constructor(protocol: 'http', port: number, routes: Route.Tree);
  constructor(protocol: 'https', port: number, routes: Route.Tree, httpsConfig?: ServerOptions);
  constructor(protocol: 'http' | 'https', port: number, routes: Route.Tree, httpsConfig?: ServerOptions) {
    if (protocol === 'https') {
      
      this.realServer = createServer({
        key: readFileSync('./https/key.pem'),
        cert: readFileSync('./https/cert.pem'),
        ...(httpsConfig || {})
      }, Server.Initialize(routes));

    } else {

      this.realServer = new InsecureServer(Server.Initialize(routes));

    }

    this.realServer.listen(port, () => {
      console.log(`Server listening on port ${config.httpsPort} under ${config.env} ${protocol}.`);
    });
  }

  private static Initialize = (routes: Route.Tree) => (req: IncomingMessage, res: ServerResponse) => {
    // Get url and parse it
    const parsedUrl = parseUrl(req.url || '', true);

    // Get path and query params
    const trimmedPath = parsedUrl.pathname!.replace(/(^\/+)|(\/+$)/g, '');
    const query = parsedUrl.query;

    // Get request method
    const method = req.method!;

    // Get headers as object
    const headers = req.headers;

    // Parse payload if any
    const decoder = new StringDecoder('UTF-8');

    let buffer = '';

    req.addListener('data', chunk => {
      buffer += decoder.write(chunk);
    });

    req.addListener('end', async () => {
      buffer += decoder.end();

      // Choose the route handler
      const handler = fromPath(routes, trimmedPath, '/') || routes['*'];

      // Construct data to send to the handler
      const data = {
        trimmedPath,
        query,
        headers,
        payload: buffer
      };

      // Route the request to the handler
      const handlerData = await handler(data);

      const statusCode = typeof handlerData.status === 'number' ? handlerData.status : 200;
      const payload = typeof handlerData.payload === 'undefined' ? {} : handlerData.payload;

      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log(`${statusCode}: Returning %s to %s %s`, payloadString, method, trimmedPath);
    });
  };
}
