import * as p from 'path';
import * as fs from 'fs';

let pkg = require('../package.json');
let mkdirpSync = require('mkdirp').sync;


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


mkdirpSync('dist/');

delete pkg.private;
delete pkg.scripts;
delete pkg.devDependencies;

writeFile('dist/package.json', JSON.stringify(pkg, null, '  '));
