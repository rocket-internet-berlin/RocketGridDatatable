'use strict';

let exec = require('child_process').exec;
let browserify = require('browserify');
let fs = require('fs');

console.log('demo build: started');

exec('./../node_modules/.bin/tsc', (error, data) => {
    if (error) {
        console.log('demo build failed: ', data);
        console.log('Maybe you\'re not running build from the root directory.');
        return;
    }
    console.log('demo build: tsc done');

    let bundleFs = fs.createWriteStream('demo.js');
    bundleFs.on('finish', () => {
        exec('rm -rf dist/');
        console.log('demo build: done');
    });

    browserify(['dist/app.js'])
        .bundle(() => {})
        .pipe(bundleFs);
});
