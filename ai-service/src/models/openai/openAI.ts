import { OpenAI } from "openai";
//import { Configuration, OpenAIApi, ChatCompletionRequestMessage, CreateCompletionRequest } from "openai";
import { encode }  from "gpt-3-encoder";
import { DimensionalDimension } from "@sisense/sdk-data";
import { TemplateFnPair, parseTemplatePrompt } from "../proptTemplating.js";
import { OPENAI_DEFAULTS } from "./defaultPrompts.js";
import { ChatCompletionMessage, OpenAiConfig, OpenAiPrompt, chatModels, completitionModels } from "./types.js";
import { Completion, CompletionCreateParamsBase } from "openai/resources/completions";

export const countTokens = (prompt: string) => encode(prompt).length;


type ParsedResult = any;

export class OpenAiEngine {
  private _debugInfo: string[] = [];
  private openai: OpenAI;

  constructor(
      protected config: OpenAiConfig,
      protected dimensions: DimensionalDimension[]
  ) {
		const {organization, apiKey} = config;
    this.openai = new OpenAI({organization, apiKey});
    if (!this.config.convertToPrompt)
      this.config.convertToPrompt = OPENAI_DEFAULTS.convertToPrompt;
    if (!this.config.determineDimensionPrompt)
      this.config.convertToPrompt = OPENAI_DEFAULTS.determineDimensionPrompt;
  }


  public async processMessage(msg: string, selectedDimension: DimensionalDimension|null = null): Promise<ParsedResult> {
    // if engineType ~ EngineType.BasicNlq

    // TBD: determine command?

    if (!selectedDimension)
      selectedDimension = await this.determineDimension(msg);
    if (!selectedDimension)
      throw new Error('We were not able to determine dimension, awailable are: ' + this.dimensions.map(({name}) => name).join(','));

    if (!this.config.convertToPrompt)
      throw new Error('Devs were too laizy to comeup with a correct prompt');

    const prompt = await this.parseTemplatePrompt(
        this.config.convertToPrompt,
        {msg, selectedDimension: selectedDimension},
      );
console.log(prompt);
    if (!prompt)
      throw new Error("Can't parse Converting prompt template");

    let res = await this.complete(prompt);
    try {
      try {
        res = JSON.parse(res);
      } catch(e){
console.log("Meeh,.. not a JSON");
console.log("evil eval?", `(${res})`);
        res = eval(`(${res})`);
      }
    } catch(e) {
console.log("\n\nOAI resolved in NoN JSON and in NoN JS-Object :\n\n", res, e);
      throw new Error('OAI gave some random response: ' + res);
    }
console.log("\n\nOAI resolved \n\n", res);
    return res;
  }


  public async cmdOrQuery(msg: string) {
    const prompt = this.config.determineCommandPrompt && await this.parseTemplatePrompt(this.config.determineCommandPrompt, {msg});
    return await this.complete(prompt);
  }

  public async determineDimension(msg: string): Promise<DimensionalDimension|null> {
    const prompt = await this.parseTemplatePrompt(this.config.determineDimensionPrompt!, {
      msg,
      dimensions: this.dimensions
    });
console.log(`So what's Dim PROMPT? ${prompt}`);
    const variant = (await this.complete(prompt)) || 'null';
console.log(`So what's Dim? ${variant}`);
    const reg = new RegExp(`\\d\.?\\s*(${this.dimensions.map(d => d.name).sort((d, p) => p.length - d.length).join('|')})`);
    const matched = variant.match(reg);

console.log(variant, reg.toString(), matched);

    if (matched && matched[1]) {
      return this.dimensions.find(v => v.name == matched[1]) || null;
    }
    return null;
  }

  public async complete(prompt: OpenAiPrompt, options: Partial<CompletionCreateParamsBase> = {}) {
    let res;
    if (Array.isArray(prompt))
      res = await this.proceedChat(prompt, options);
    else
      res = await this.proceedPrompt(prompt, options);

    this.log({
      prompt,
      tokens: res.usage,
      response: res.choices[0].text,
    });
    return res.choices[0].text;
  }

  private async proceedPrompt(prompt: string, options: Partial<CompletionCreateParamsBase> = {}): Promise<Completion> {
    const completitionPayload: CompletionCreateParamsBase = {
      "model": completitionModels.davinchi_e,
      "prompt": prompt,
      "max_tokens": 700,
      "temperature": 0,
      "top_p": 1,
      "n": 1,
      "stream": false,
      "logprobs": null,
      "echo": false,
      "stop": ["specific_code@command::"],
      ...options,
    };
    const res = (await this.openai.completions.create(completitionPayload)) as Completion;

console.log("OAI", prompt, {step: 'complete', prompt, tokens: res.usage ,res: JSON.stringify(res, null, '  ')});

    return res;
  }

  private async proceedChat(prompt: ChatCompletionMessage[], options?: any): Promise<Completion> {
    return await this.openai.completions.create({
      model: chatModels.gpt3,
      messages: prompt,//messages.prompt1.concat(QQ[0]),
      ...options,
    });
  }

  private async paraphraseDimension(d: DimensionalDimension) {
    const prompt = `Come up with conciese and uncommon way requesting dataset: ${d.name} ${d.description ? `(${d.description})` : ''}`;
    const res = (await this.complete(prompt, {model: completitionModels.babbage, temperature: 0.4}))?.trim() || '';
console.log({
      step: "paraphrasing",
      prompt,
      res,
      tokens: `${countTokens(prompt)} + ${countTokens(res)}`,
    })
    return res;
  }

  private async parseTemplatePrompt(
    prompt: string | {role: string, content: string}[],
    options: {msg: string, dimensions?: DimensionalDimension[], selectedDimension?: DimensionalDimension}
  ) {
    try {
      const openAI_specific_tpls: TemplateFnPair[] = options.dimensions ? [[
        /\{\{paraphrase\(viewpoints\[(\d)\]\)\}\}/g,
        async (r1: string) => options.dimensions && (await this.paraphraseDimension(options.dimensions[parseInt(r1)])) || ''
      ]] : [];

      return parseTemplatePrompt(prompt, options, openAI_specific_tpls);
    } catch(e) {
      console.error(e);
      throw new Error('Failed to create a prompt from a template >_<');
    }
  }

  private log(msg: any) {
    this._debugInfo.push(JSON.stringify(msg, null, "  "));
  }

  get debugInfo() {
    return this._debugInfo;
  }
}
