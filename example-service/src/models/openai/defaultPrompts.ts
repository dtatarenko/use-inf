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
    + `"{{msg}}" => ?\n`,

  determineDimensionPrompt: 
      `Available tables,descriptions and their fields are:\n`
    + `{{dimensionsDetailedList}}`
    + `\nYou need to define which table could be used to answer user question (answer 1-{{dimensions.length}} or null).\n`
    + `Example 1: "show {{dimensions[0].name}}" => 1. {{dimensions[0].name}}\n`
    + `Example 2: "some {{dimensions[1].columns[0]}} in {{dimensions[1].name}}" => 2. {{dimensions[1].name}}\n`
    + `Example 3: "{{paraphrase(dimensions[2])}}" => 3. {{dimensions[2].name}}\n\n`
    + `"{{msg}}" => ?\n`,

  convertToPrompt: [
    {"role": "system", "content": "You need to guess JSON query that should look like: "},
    {"role": "system", "content":
          "{groupBy?: <fieldName>[],"
        + "orderBy?: {[<fieldName>: string]: desc| ask}[],"
        + "offset?: number,"
        + "limit?: number,"
        + "aggregations?: [{[<fieldName>]: /(first|avg|sum|count)/}], "
        + "conditions?: {/(and|or)/:[{[<fieldName>]: {operator: /(>|<|=|!=|>=|<=|like|in|except)/, value}}]}}"
        + "fields: <fieldName>[]"
        + "display: 'table'|'barchart'|'piechart'|'areachart'"
    },
    {"role": "system", "content": "Available fields are:"},
    {"role": "system", "content": "{{dimension.columns[]}}"},
    {"role": "user", "content": `{{dimension.name}} whose {{dimension.numberColumns[0]}} is more than 5`},
    {"role": "assistant", "content":
      `{conditions: {and:[{"{{dimension.numberColumns[0]}}":{operator:">", value: "5"}}]}, fields:[{{dimension.quotedColumns[]}}], display: "table"}`
    },
    {"role": "user", "content": `how many different {{dimension.columns[0]}} we have`},
    {"role": "assistant", "content": `{groupBy: "{{dimension.columns[0]}}", aggregations: [{{dimension.columns[0]}}: "count"], fields:[{{dimension.columns[0]}}], display: "piechart"}`},
    {"role": "user", "content": `{{msg}}`},
  ],
};
