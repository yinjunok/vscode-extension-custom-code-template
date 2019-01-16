import * as fs from 'fs';

const readTemplate = (src: string): string => {
  const content = fs.readFileSync(src, 'utf8');
  return content;
}

export default readTemplate;