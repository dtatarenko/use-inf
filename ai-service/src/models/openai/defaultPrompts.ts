export const OPENAI_DEFAULTS = {
  determineCommandPrompt: 
    `Awailable operations are:\n`
    + `1. login\n`
    + `2. logout\n`
    + `3. me: know in which account user is logged in\n`
    + `4. list: see the list of available data tables\n`
    + `5. bookmarks: see the list of faworite queries\n`
    + `6. query data`
    + `\nYou need to define which operation user most likely whant to call (answer 1-5 or null)?\n`
    + `Example 1: "can I access system" => 1. login\n`
    + `Example 2: "what do you know" => 4. list\n`
    + `Example 3: "most valuable asset?" => 6. query\n\n`
    + `"{{qq}}" => ?\n`,

  determineDimensionPrompt: 
      `Available tables,descriptions and their fields are:\n`
    + `{{viewpointsDetailedList}}`
    + `\nYou need to define which table could be used to answer user question (answer 1-{{viewpoints.length}} or null).\n`
    + `Example 1: "show {{viewpoints[0].name}}" => 1. {{viewpoints[0].name}}\n`
    + `Example 2: "some {{viewpoints[1].columns[0]}} in {{viewpoints[1].name}}" => 2. {{viewpoints[1].name}}\n`
    + `Example 3: "{{paraphrase(viewpoints[2])}}" => 3. {{viewpoints[2].name}}\n\n`
    + `"{{qq}}" => ?\n`,

  convertToPrompt: [
    {"role": "system", "content": "You need to guess JSON query that should look like: "},
    {"role": "system", "content":
          "{groupBy?: [fieldName],"
        + "orderBy?: {[fieldName: string]: desc| ask}[],"
        + "offset?: number,"
        + "limit?: number,"
        + "aggregations?: [{[fieldName]: /(first|avg|sum|count)/}], "
        + "conditions?: {/(and|or)/:[{[fieldName]: {operator: /(>|<|=|!=|>=|<=|like|in|except)/, value}}]}}"},
    {"role": "system", "content": "Available fields are:"},
    {"role": "system", "content": "{{viewpoint.columns[]}}"},
    {"role": "user", "content": `{{viewpoint.name}} whose {{viewpoint.numberColumns[0]}} is more than 5`},
    {"role": "assistant", "content": `{conditions: {and:[{"{{viewpoint.numberColumns[0]}}":{operator:">", value: "5"}}]}}`},
    {"role": "user", "content": `how many different {{viewpoint.columns[0]}} we have`},
    {"role": "assistant", "content": `{groupBy: "{{viewpoint.columns[0]}}"}`},
    {"role": "user", "content": `{{qq}}`},
  ],
};

/*
export const OPENAI_DEFAULTS = ({nextEngine}: Partial<EngineConfiguration>): Partial<EngineConfiguration> => ({
  determineCommandPrompt: '',
  /*
  `Awailable operations are:\n`
  + `1. login\n`
  + `2. logout\n`
  + `3. me: know in which account user is logged in\n`
  + `4. list: see the list of available data tables\n`
  + `5. bookmarks: see the list of faworite queries\n`
  + `6. query data`
  + `\nYou need to define which operation user most likely whant to call (answer 1-5 or null)?\n`
  + `Example 1: "can I access system" => 1. login\n`
  + `Example 2: "what do you know" => 4. list\n`
  + `Example 3: "most valuable asset?" => 6. query\n\n`
  + `"{{qq}}" => ?\n`,
* /
  determineViewpointPrompt: 
    `Available tables,descriptions and their fields are:\n`
  + `{{viewpointsDetailedList}}`
  + `\nYou need to define which table could be used to answer user question (answer 1-{{viewpoints.length}} or null).\n`
  + `Example 1: "show {{viewpoints[0].name}}" => 1. {{viewpoints[0].name}}\n`
  + `Example 2: "some {{viewpoints[1].columns[0]}} in {{viewpoints[1].name}}" => 2. {{viewpoints[1].name}}\n`
  + `Example 3: "{{paraphrase(viewpoints[2])}}" => 3. {{viewpoints[2].name}}\n\n`
  + `"{{qq}}" => ?\n`,
  convertToPrompt: ((engn): string => {
    switch(engn) {
      case EngineType.cJAQL:
        return JSON.stringify([
          {"role": "system", "content": "You need to guess JSON query that should look like: "},
          {"role": "system", "content":
                "{groupBy?: [fieldName],"
              + "orderBy?: {[fieldName: string]: desc| ask}[],"
              + "offset?: number,"
              + "limit?: number,"
              + "aggregations?: [{[fieldName]: /(first|avg|sum|count)/}], "
              + "conditions?: {/(and|or)/:[{[fieldName]: {operator: /(>|<|=|!=|>=|<=|like|in|except)/, value}}]}}"},
          {"role": "system", "content": "Available fields are:"},
          {"role": "system", "content": "{{viewpoint.columns[]}}"},
          {"role": "user", "content": `{{viewpoint.name}} whose {{viewpoint.numberColumns[0]}} is more than 5`},
          {"role": "assistant", "content": `{conditions: {and:[{"{{viewpoint.numberColumns[0]}}":{operator:">", value: "5"}}]}}`},
          {"role": "user", "content": `how many different {{viewpoint.columns[0]}} we have`},
          {"role": "assistant", "content": `{groupBy: "{{viewpoint.columns[0]}}"}`},
					{"role": "user", "content": `{{qq}}`},
        ], null, '  ');
      case EngineType.SimplyAsk:
        return '';
      default:
        return '';
    };
  })(nextEngine),
});
*/