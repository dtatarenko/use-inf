import { IncomingMessage, ServerResponse } from "http";

export type CustomRequest = IncomingMessage & {
  params: {[key: string]: string},
  path: string,
};

export type Controller = (req: CustomRequest, res: ServerResponse<IncomingMessage>) => [number, any];