import { config } from 'dotenv';
config();
import http from 'http';

import { Controller, ControllerMethod, CustomRequest } from './utils/request.js';
import { Nlq } from './controllers/nlq.js';
import { OpenAiEngine } from './models/openai/openAI.js';
import { Brand, Commerce, Country } from './data/sample-ecommerce.js';
import { DimensionalDimension } from '@sisense/sdk-data';

const port = process.env.port || 9100;

const controllers = [
  new Nlq(new OpenAiEngine({
      organization: process.env.org || '',
      apiKey: process.env.OPENAI_API_KEY || '',
    },
    // Please include at least 3, or you'll get an error (we encounter in a prompt that there should be at least 3)
    [
      Brand as any as DimensionalDimension,    // sorry, we really had to do it ¯\_(ツ)_/¯
      Commerce as any as DimensionalDimension,
      Country as any as DimensionalDimension,
    ]
  )),
];
const server = http.createServer((request, response) => {
  console.log(`${request.method}: ${request.url}`);

  const [path, params] = (([path = '', params = '']: string[]) => [
    path,
    params.split('&').reduce(
      (a: any, p: string) => (([k, v]) => a[k] = decodeURI(v))(p.split('=')) && a, {}
    )
  ])(request?.url?.split('?')||[]);

  const contentType = 'application/json';

  const req: CustomRequest = Object.assign(request, {params, path}) ;

  let status = 500, content = '';
  let m: ControllerMethod|null = null;
  let c: Controller|null = null;
  for(c of controllers) {
    m = c.matchReq(req);
    if(m) break;
  }
  try {
    (async() => {
      if (m) {
        [status, content] = await m(req, response);
      } else {
        status = 404;
      }
console.log(`Response: ${c && c.constructor.name} ${status}`);

      response.writeHead(status, { 'Content-Type': contentType });
      response.end(JSON.stringify(content), 'utf-8');
    })();
  } catch(e) {
console.error(e);
    response.writeHead(500, { 'Content-Type': contentType });
    response.end({error: "Something went wrong"}, 'utf-8');
  }

}).listen(port);

server.on('error', function (e) {
  // Handle your error here
  console.log(e);
});

console.log(`Server running at https://127.0.0.1:${port}/`);