import fs from 'fs';
import path from 'path';

const lang = fs.readFileSync(path.resolve(process.cwd(), './i18n/locales/en.json'))

const data = JSON.parse(lang.toString());

const extract = fs.readFileSync(path.resolve(process.cwd(), './extract.json'))

const extractData = JSON.parse(extract.toString());

Object.entries(extractData).forEach(([key, value]) => {
  if (data[key] === "") {
    data[key] = value;
  }
});

fs.writeFileSync(path.resolve(process.cwd(), './i18n/locales/en.json'), JSON.stringify(data, null, 2));