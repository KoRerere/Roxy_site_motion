import fs from 'fs';
import path from 'path';

const lang = fs.readFileSync(path.resolve(process.cwd(), './i18n/locales/en.json'))

const data = JSON.parse(lang.toString());

const __data: Record<string, string> = {};
Object.entries(data).forEach(([key, value]) => {
  if (value === "") {
    __data[key] = value;
  }
});

fs.writeFileSync(path.resolve(process.cwd(), './extract.json'), JSON.stringify(__data, null, 2));
