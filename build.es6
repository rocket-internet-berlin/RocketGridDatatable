'use strict';

let exec = require('child_process').exec;
let browserify = require('browserify');
let uglifyJs = require('uglifyjs');
let less = require('less');
let fs = require('fs');
let pkgName = require('./package.json').name;

console.log('app build: started');

exec('./node_modules/.bin/typings install', (error) => {
    if (error) {
        console.log('typings install error: ', error);
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
            'dist/temporary/dist/events.js',
            'dist/temporary/src/datatable.module.js',
            'dist/temporary/src/datatable.helper.js',
            'dist/temporary/src/datatable.directive.js',
            'dist/temporary/tmpl.js'
        ];

        exec('./node_modules/.bin/ng-html2js src/datatable.directive.html -m rocket-grid-datatable', (error, data) => {
            console.log('app build: nghtml2js done');
            fs.writeFileSync('dist/temporary/tmpl.js', data.replace('src/', ''));

            var bundleFs = fs.createWriteStream(outFile);

            browserify(files)
                .bundle(() => {
                    console.log('app build: removing temporary dirs for app');
                    exec('rm -rf dist/temporary/', () => {
                        exec('cd ./demo && node build.es6 && cd ..', (error, data) => {
                            console.log(data);
                        });
                    });
                })
                .pipe(bundleFs);

            bundleFs.on('finish', () => {
                var minified = uglifyJs.minify(outFile);
                fs.writeFileSync(outFileMinified, minified.code);
            });
        });

        exec(
            './node_modules/.bin/lessc --clean-css src/datatable.less dist/rocket-grid-datatable.min.css',
            error => {
                if (error) {
                    console.log('less error: ', error);
                    return;
                }
            }
        );
    });
});
