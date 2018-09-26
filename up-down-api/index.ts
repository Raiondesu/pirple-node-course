/**
 * Entry API file
 */
import { createServer } from 'http';
import { parse as parseUrl } from 'url';
import { StringDecoder } from 'string_decoder';
import { fromPath, route } from './misc';
import { Router } from './types';

const server = createServer((req, res) => {
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
    const handler = fromPath(router, trimmedPath, '/') || router['*'];

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
});

server.listen(3000, () => console.log('Server listening on port 3000.'));

const router: Router.ITree = {
  // Sample handler
  'sample': route(_data => ({
    status: 406,
    payload: {
      name: 'Sample handler'
    }
  }), {
    'test': _data => ({
      status: 200,
      payload: {
        test: 'Test 2-nd level handler'
      }
    })
  }),

  // 404 handler
  '*': () => ({ status: 404 })
};
