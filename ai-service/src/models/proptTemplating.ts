import { DimensionalDimension } from '@sisense/sdk-data';

export type TemplateFnPair = [RegExp, (...args: any[]) => Promise<string>];
export async function parseTemplatePrompt(
  prompt: string | {role: string, content: string}[],
  options: {
    msg: string,
    dimensions?: DimensionalDimension[],
    selectedDimension?: DimensionalDimension,

  },
  additionalTemplates: TemplateFnPair[] = [],
): Promise<any> {
  if (Array.isArray(prompt))
    return prompt.map(({role, content}) => ({role, content: parseTemplatePrompt(content, options)}));

  const {msg, selectedDimension, dimensions} = options;
  const filterColsByType = (dim: DimensionalDimension, columnType: 'numberColumns' | 'dateColumns') => {
    if (columnType === 'numberColumns')
        return dim.attributes.filter((a) => a.type === 'numeric');
    if (columnType === 'dateColumns')
        return dim.attributes.filter((a) => a.type === 'datetime');
    return dim.attributes;
  }
  const parseTpl = async (str: string): Promise<string> => {
    const dimToStr = (d: DimensionalDimension, i: number) =>
      `  ${i+1}. ${d.name}${d.description ? `(${d.description})`:''}: `
  +  `${d.attributes.length > 0
        ? d.attributes.map(a => `${a.name}`)
        :''
      }`;
    const allowedTpls: [RegExp, (...args: any[]) => Promise<string>][] = [
      [/\{\{\msg\}\}/g, () => Promise.resolve(msg)],
    ];
    if (dimensions) [
      [/\{\{viewpointsDetailedList\}\}/g, () => Promise.resolve(dimensions.map(dimToStr).join('\n'))],
      [/\{\{viewpoints\.length\}\}/g, () => Promise.resolve(dimensions.length.toString())],
      [
        /\{\{viewpoints\[(\d)\]\.(name|description)\}\}/g,
        (r1: string, r2: keyof DimensionalDimension) => Promise.resolve(`${dimensions[parseInt(r1)][r2]}`),
      ],
      [
        /\{\{viewpoints\[(\d)\]\.(columns|numberColumns|dateColumns)\[\]\}\}/g,
        (r1: string, columnType: 'numberColumns' | 'dateColumns') => Promise.resolve(
            filterColsByType(dimensions[parseInt(r1)], columnType)
              .map(({name}) => name).join(',')
        ),
      ],
      [
        /\{\{viewpoints\[(\d)\]\.(columns|numberColumns|dateColumns)\[(\d)\]\}\}/g,
        (r1: string, columnType: 'numberColumns' | 'dateColumns', r2: string) => Promise.resolve(
            filterColsByType(dimensions[parseInt(r1)], columnType)[parseInt(r2)].name
        ),
      ],
    ].forEach((tpl: any) => allowedTpls.push(tpl));

    if (selectedDimension) [
      [/\{\{viewpoint\.(name|description)\}\}/g, (r1: keyof DimensionalDimension) => Promise.resolve(`${selectedDimension[r1]}`)],
      [
        /\{\{viewpoint\.(columns|numberColumns|dateColumns)\[\]\}\}/g,
        (columnType: 'numberColumns' | 'dateColumns') => Promise.resolve(
          filterColsByType(selectedDimension, columnType)
            .map(({name}) => name).join(',')
        )
      ],
      [
        /\{\{viewpoint\.(columns|numberColumns|dateColumns)\[(\d)\]\}\}/g,
        (columnType: 'numberColumns' | 'dateColumns', r1: string) => Promise.resolve(
          filterColsByType(selectedDimension, columnType)[parseInt(r1)].name
        ),
      ],
    ].forEach((tpl: any) => allowedTpls.push(tpl));
    if (additionalTemplates.length) {
      additionalTemplates.forEach((tpl) => allowedTpls.push(tpl));
    }

    return await allowedTpls.reduce(
        async (a: Promise<string>, [reg, cb]) => await [...(await a).matchAll(reg)].reduce(
            async (aa: any, matches: any) =>  (await aa).replace(matches[0], await cb(...matches.slice(1))), a)
          , Promise.resolve(str));
  };
  return parseTpl(prompt);
}
