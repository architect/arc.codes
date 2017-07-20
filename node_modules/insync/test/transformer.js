'use strict';
var Babel = require('babel');


module.exports = [
    {
        ext: '.js',
        transform: function (content, filename) {

            // Make sure to only transform your code or the dependencies you want
            if (filename.indexOf('lib') >= 0) {
                var result = Babel.transform(content, {
                    sourceMap: 'inline',
                    filename: filename,
                    sourceFileName: filename
                });
                return result.code;
            }

            return content;
        }
    }
];
