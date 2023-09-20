import { Attribute, DimensionalDimension } from '@sisense/sdk-data';

type ColumnTypes = 'numberColumns' | 'dateColumns' | 'quotedColumns' | 'columns';
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
    return await Promise.all(prompt.map(async ({role, content}) => ({role, content: await parseTemplatePrompt(content, options)})));

  const {msg, selectedDimension, dimensions} = options;
  const filterColsByType = (dim: DimensionalDimension, columnType: ColumnTypes): Attribute[] => {
    if (columnType === 'numberColumns')
        return dim.attributes.filter((a) => a.type === 'numeric-attribute');
    if (columnType === 'dateColumns')
        return dim.dimensions.filter((a) => a.type === 'datedimension');
    return dim.attributes.concat(dim.dimensions);
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
      [/\{\{dimensionsDetailedList\}\}/g, () => Promise.resolve(dimensions.map(dimToStr).join('\n'))],
      [/\{\{dimensions\.length\}\}/g, () => Promise.resolve(dimensions.length.toString())],
      [
        /\{\{dimensions\[(\d)\]\.(name|description)\}\}/g,
        (r1: string, r2: keyof DimensionalDimension) => Promise.resolve(`${dimensions[parseInt(r1)][r2]}`),
      ],
      [
        /\{\{dimensions\[(\d)\]\.(quotedColumns|columns|numberColumns|dateColumns)\[\]\}\}/g,
        (r1: string, columnType: ColumnTypes) => Promise.resolve(
            filterColsByType(dimensions[parseInt(r1)], columnType)
              .map(({name}) => columnType == 'quotedColumns' ? `${name}` : name).join(',')
        ),
      ],
      [
        /\{\{dimensions\[(\d)\]\.(quotedColumns|columns|numberColumns|dateColumns)\[(\d)\]\}\}/g,
        (r1: string, columnType: ColumnTypes, r2: string) => Promise.resolve(
            (name => columnType == 'quotedColumns' ? `${name}` : name)(filterColsByType(dimensions[parseInt(r1)], columnType)[parseInt(r2)].name)
        ),
      ],
    ].forEach((tpl: any) => allowedTpls.push(tpl));

    if (selectedDimension) [
      [/\{\{dimension\.(name|description)\}\}/g, (r1: keyof DimensionalDimension) => Promise.resolve(`${selectedDimension[r1]}`)],
      [
        /\{\{dimension\.(quotedColumns|columns|numberColumns|dateColumns)\[\]\}\}/g,
        (columnType: ColumnTypes) => Promise.resolve(
          filterColsByType(selectedDimension, columnType)
            .map(({name}) => columnType == 'quotedColumns' ? `${name}` : name).join(',')
        )
      ],
      [
        /\{\{dimension\.(quotedColumns|columns|numberColumns|dateColumns)\[(\d)\]\}\}/g,
        (columnType: ColumnTypes, r1: string) => Promise.resolve(
          (name => columnType == 'quotedColumns' ? `${name}` : name)(filterColsByType(selectedDimension, columnType)[parseInt(r1)].name)
        ),
      ],
    ].forEach((tpl: any) => allowedTpls.push(tpl));
    if (additionalTemplates.length) {
      additionalTemplates.forEach((tpl) => allowedTpls.push(tpl));
    }

    return await allowedTpls.reduce(
        async (a: Promise<string>, [reg, cb]) => {
console.log(`parse: `, (await a));
          return await [...(await a).matchAll(reg)].reduce(
            async (aa: any, matches: any) =>  {
console.log(`${(await aa)}.replace(${matches[0]})`);
              return (await aa).replace(matches[0], await cb(...matches.slice(1)));
            }, a);
          }
          , Promise.resolve(str));
  };
  return parseTpl(prompt);
}
