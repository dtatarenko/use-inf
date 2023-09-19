import { Controller, ControllerMethod, CustomRequest } from "../utils/request.js";
import { OpenAiEngine } from "../models/openai/openAI.js";

export class Nlq extends Controller {
  constructor(private ai: OpenAiEngine){ super(); }

  methods() {
    return [{
      method: "get" as "get"|"post",
      path: ['', '/'],
      callback: (async (req: CustomRequest): Promise<[number, any]> => {
        try {
          const completion = await this.ai.processMessage(req.params['question']);
          return [200, {
            ...JSON.parse(completion)
          }];
        } catch(e: any) {
          return [400, { error: e.message}]
        }
      }) as ControllerMethod,
    }];
  }
}
