import * as fs from 'fs';
import * as p from 'path';
var mkdirpSync = require('mkdirp').sync;
var extractCLDRData = require('formatjs-extract-cldr-data');
var serialize = require('serialize-javascript');
var rollup = require('rollup').rollup;
var memory = require('rollup-plugin-memory');
var uglify = require('rollup-plugin-uglify');


const DEFAULT_LOCALE = 'en';

const cldrData = extractCLDRData({
    pluralRules   : true,
    relativeFields: true,
});

const cldrDataByLocale = new Map(
    <any>Object.keys(cldrData).map((locale) => [locale, cldrData[locale]])
);

const cldrDataByLang = Array.from(cldrDataByLocale).reduce((map, [locale, data]: [string, any]) => {
    const [lang]   = locale.split('-');
    const langData = map.get(lang) || [];
    return map.set(lang, langData.concat(data));
}, new Map());

function createDataModule(localeData) {
    return (
`// GENERATED FILE
export default ${serialize(localeData)};
`
    );
}

function writeUMDFile(filename, module) {
    const lang = p.basename(filename, '.js');

    return rollup({
        entry: {
            path: filename,
            contents: module,
        },
        plugins: [
            memory(),
            uglify(),
        ],
    })
    .then((bundle) => {
        return bundle.write({
            dest      : filename,
            format    : 'umd',
            moduleName: `Ng2IntlLocaleData.${lang}`,
        });
    })
    .then(() => filename);
}

function writeFile(filename, contents) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, contents, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(p.resolve(filename));
            }
        });
    });
}

// -----------------------------------------------------------------------------

mkdirpSync('locale-data/');

const defaultData = createDataModule(cldrDataByLocale.get(DEFAULT_LOCALE));
writeFile(`src/${DEFAULT_LOCALE}.js`, defaultData);
writeFile(`src/${DEFAULT_LOCALE}.d.ts`, `
declare var lang: any;
export default lang;
`);

const allData = createDataModule(Array.from(cldrDataByLocale.values()));
writeUMDFile('locale-data/index.js', allData);

cldrDataByLang.forEach((cldrData, lang) => {
    writeUMDFile(`locale-data/${lang}.js`, createDataModule(cldrData));
    writeFile(`locale-data/${lang}.d.ts`, `
declare var lang: any;
export default lang;
`);
});

process.on('unhandledRejection', (reason) => {throw reason;});
console.log('Writing locale data files...');
