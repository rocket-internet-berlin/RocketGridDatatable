'use strict';

let exec = require('child_process').exec;
let browserify = require('browserify');
let uglifyJs = require('uglifyjs');
let fs = require('fs');
let pkgName = require('./package.json').name;

exec('./node_modules/.bin/tsd install', (error) => {
    if (error) {
        console.log('tsd install error: ', error);
        return;
    }

    exec('./node_modules/.bin/tsc', (error) => {
        if (error) {
            console.log('tsc error: ', error);
            return;
        }

        let outFile = 'dist/' + pkgName + '.js';
        let outFileMinified = 'dist/' + pkgName + '.min.js';
        let files = [
            'dist/temporary/datatable.module.js',
            'dist/temporary/datatable.interface.js',
            'dist/temporary/datatable.helper.js',
            'dist/temporary/datatable.directive.js',
            'dist/temporary/tmpl.js'
        ];

        exec('./node_modules/.bin/ng-html2js src/datatable.directive.html -m angular-grid-datatable', (error, data) => {
            fs.writeFileSync('dist/temporary/tmpl.js', data.replace('src/', ''));

            var bundleFs = fs.createWriteStream(outFile);

            browserify(files)
                .bundle(() => removeTemporaryItems(files, 'dist/temporary/'))
                .pipe(bundleFs);

            bundleFs.on('finish', () => {
                var minified = uglifyJs.minify(outFile);
                fs.writeFileSync(outFileMinified, minified.code);
            });
        });
    });
});

function removeTemporaryItems(files, dir) {
    files.forEach((item) => {
        fs.unlink(item, (error) => error ? console.log('remove file error: ', error) : null);
    });
    fs.rmdir(dir, (error) => error ? console.log('remove directory error: ', error) : null);
}
