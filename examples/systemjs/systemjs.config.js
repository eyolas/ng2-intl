/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {

    // map tells the System loader where to look for things
    var map = {
        'app': 'src',
        'ng2-intl': 'node_modules/ng2-intl',
        '@angular': 'node_modules/@angular',
        'rxjs': 'node_modules/rxjs',
        'tslib': 'node_modules/tslib',
        'intl-relativeformat': 'node_modules/intl-relativeformat',
        'intl-messageformat-parser': 'node_modules/intl-messageformat-parser',
        'intl-messageformat': 'node_modules/intl-messageformat',
        'intl-format-cache': 'node_modules/intl-format-cache',
        'lodash-es': 'node_modules/lodash-es',
        'lodash': 'node_modules/lodash',
        'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js'
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': {main: 'bootstrap.js', defaultExtension: 'js'},
        'rxjs': {main: 'index.js', defaultExtension: 'js'},
        'rxjs/operators': {main: 'index.js', defaultExtension: 'js' },
        'ng2-intl': {main: 'bundles/ng2-intl.umd.js', defaultExtension: 'js'},
        'tslib': {main: 'tslib.js', defaultExtension: 'js'},
        '@angular/common/http': {main: '../bundles/common-http.umd.js', defaultExtension: 'js'},
        'lodash-es': {main: 'index.js', defaultExtension: 'js'},
        'intl-relativeformat': {main: 'index.js', defaultExtension: 'js'},
        'intl-messageformat': {main: 'index.js', defaultExtension: 'js'},
        'intl-messageformat-parser': {main: 'index.js', defaultExtension: 'js'},
        'intl-format-cache': {main: 'index.js', defaultExtension: 'js'}

    };

    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'platform-browser',
        'platform-browser-dynamic'
    ];

    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = {main: 'index.js', defaultExtension: 'js'};
    }

    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = {main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js'};
    }

    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);

    var config = {
        map: map,
        packages: packages,
        transpiler: 'plugin-babel'
    };

    System.config(config);

})(this);
