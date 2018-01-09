#!/usr/bin/nodejs

var express = require('express');
var debug = require('debug')('s3-proxy');
var config = require('./config');
var _ = require('lodash');

var app = express();
app.disable('x-powered-by');

const AWS = require('aws-sdk');
AWS.config.update({region: config.region});
AWS.Request.prototype.forwardToExpress = function forwardToExpress(res, next) {
    this
    .on('httpHeaders', function (code, headers) {
        if (code < 300) {
            res.set(_.pick(headers, 'accept-ranges', 'content-length', 'content-range', 'content-type', 'etag', 'last-modified'));
        }
    })
    .createReadStream()
    .on('error', next)
    .pipe(res);
};
const s3 = new AWS.S3();

app.set('port', process.env.PORT || 3000);
app.get('/:path(*)', function(req, res, next) {
    s3.getObject({Bucket: config.bucket, Key: req.params.path}).forwardToExpress(res, next);
});

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});