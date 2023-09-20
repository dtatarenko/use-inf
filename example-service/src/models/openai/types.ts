export type ChatCompletionMessage = {
  role: string;
  content: string;
};

export type OpenAiPrompt = string | ChatCompletionMessage[];

export type OpenAiConfig = {
  determineCommandPrompt?: OpenAiPrompt;
  convertToPrompt?: string | {role: string, content: string}[];
  determineDimensionPrompt?: string | {role: string, content: string}[];

  organization: string;
  apiKey: string;
}

export const chatModels = {
  gpt4: 'gpt-4', 
  gpt4_0314: 'gpt-4-0314', 
  gpt4_32k: 'gpt-4-32k', 
  gpt4_0314_32k: 'gpt-4-32k-0314', 
  gpt3: 'gpt-3.5-turbo', 
  gpt3_301: 'gpt-3.5-turbo-0301'
};
export const completitionModels = {
  davinchi: 'text-davinci-003',
  davinchi_e: 'text-davinci-002',
  curie: 'text-curie-001',
  babbage: 'text-babbage-001',
  ada: 'text-ada-001'
};