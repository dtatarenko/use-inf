import { IncomingMessage, ServerResponse } from "http";

export type CustomRequest = IncomingMessage & {
  params: {[key: string]: string},
  path: string,
};

export type ControllerMethod = (req: CustomRequest, res: ServerResponse<IncomingMessage>) => Promise<[number, any]>;

export abstract class Controller {
  abstract methods(): {
    method: 'get'|'post',
    path: string[],
    callback: ControllerMethod
  }[];

  matchReq(req: CustomRequest): ControllerMethod | null {
    return this.methods().find(({method, path}) => {
      return path.includes(req.path) && req.method?.toLocaleLowerCase() == method
    })?.callback || null;
  }
}