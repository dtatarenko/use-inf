import { config } from 'dotenv';
config();
import http from 'http';

import { CustomRequest } from './utils/request';
import { Nlq } from './controllers/nlq';

const port = process.env.port || 9100;

const server = http.createServer((request, response) => {
  console.log('request starting...');

  const [path, params] = (([path = '', params = '']: string[]) => [
    path,
    params.split('&').reduce(
      (a: any, p: string) => (([k, v]) => a[k] = v)(p.split('=')) && a, {}
    )
  ])(request?.url?.split('?')||[]);

  const contentType = 'application/json';

  const req: CustomRequest = Object.assign(request, {params, path}) ;

  let status = 500, content = '';
  switch (path) {
    case '':
    case '/':
      [status, content] = Nlq(req, response);
      break;
    default:
      status = 404;
  }

  response.writeHead(status, { 'Content-Type': contentType });
  response.end(JSON.stringify(content), 'utf-8');

}).listen(port);

server.on('error', function (e) {
  // Handle your error here
  console.log(e);
});

console.log(`Server running at https://127.0.0.1:${port}/`);