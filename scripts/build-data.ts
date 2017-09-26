import * as fs from 'fs';
import * as p from 'path';
let mkdirpSync = require('mkdirp').sync;
let extractCLDRData = require('formatjs-extract-cldr-data');
let serialize = require('serialize-javascript');
let rollup = require('rollup').rollup;
let memory = require('rollup-plugin-memory');
let uglify = require('rollup-plugin-uglify');

const DEFAULT_LOCALE = 'en';

const cldrData = extractCLDRData({
  pluralRules: true,
  relativeFields: true
});

const cldrDataByLocale = new Map(<any>Object.keys(cldrData).map(locale => [
  locale,
  cldrData[locale]
]));

const cldrDataByLang = Array.from(
  cldrDataByLocale
).reduce((map, [locale, data]: [string, any]) => {
  const [lang] = locale.split('-');
  const langData = map.get(lang) || [];
  return map.set(lang, langData.concat(data));
}, new Map());

function createDataModule(localeData) {
  return `// GENERATED FILE
export default ${serialize(localeData)};
`;
}

function writeUMDFile(filename, module) {
  const lang = p.basename(filename, '.js');

  return rollup({
    input: filename,
    plugins: [
      memory({
        path: filename,
        contents: module
      }),
      uglify()
    ]
  })
    .then(bundle => {
      return bundle.write({
        file: filename,
        format: 'umd',
        name: `Ng2IntlLocaleData.${lang}`
      });
    })
    .then(() => filename);
}

function writeFile(filename, contents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, contents, err => {
      if (err) {
        reject(err);
      } else {
        resolve(p.resolve(filename));
      }
    });
  });
}

// -----------------------------------------------------------------------------

mkdirpSync('dist/locale-data/');

const defaultData = createDataModule(cldrDataByLocale.get(DEFAULT_LOCALE));
writeFile(`module/src/${DEFAULT_LOCALE}.js`, defaultData);
writeFile(
  `module/src/${DEFAULT_LOCALE}.d.ts`,
  `
declare var lang: any;
export default lang;
`
);

const allData = createDataModule(Array.from(cldrDataByLocale.values()));
writeUMDFile('dist/locale-data/index.js', allData);

cldrDataByLang.forEach((data, lang) => {
  writeUMDFile(`dist/locale-data/${lang}.js`, createDataModule(data));
  writeFile(
    `dist/locale-data/${lang}.d.ts`,
    `
declare var lang: any;
export default lang;
`
  );
});

process.on('unhandledRejection', reason => {
  throw reason;
});
console.log('Writing locale data files...');
