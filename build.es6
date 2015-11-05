'use strict';

let exec = require('child_process').exec;
let browserify = require('browserify');
let uglifyJs = require('uglifyjs');
let fs = require('fs');
let pkgName = require('./package.json').name;

exec('./node_modules/.bin/tsc', (error) => {
    if (error) {
        console.log('tsc error: ', error);
        return;
    }

    let outFile = 'dist/' + pkgName + '.js';
    let files = [
        'dist/temporary/datatable.module.js',
        'dist/temporary/datatable.interface.js',
        'dist/temporary/datatable.helper.js',
        'dist/temporary/datatable.directive.js',
        'dist/temporary/tmpl.js'
    ];

    exec('./node_modules/.bin/ng-html2js src/datatable.directive.html -m angular-grid-datatable', function (error, data) {
        fs.writeFileSync('dist/temporary/tmpl.js', data.replace('src/', ''));

        browserify(files)
            //.transform('babelify', {
            //    presets: [
            //        'es2015'
            //    ]
            //})
            .bundle(() => {
                removeTemporaryItems(files, 'dist/temporary/');
            })
            .pipe(fs.createWriteStream(outFile));
    });
});

function removeTemporaryItems(files, dir) {
    files.forEach(function (item) {
        fs.unlink(item, (error) => error ? console.log('remove file error: ', error) : null);
    });
    fs.rmdir(dir, (error) => error ? console.log('remove directory error: ', error) : null);
}
