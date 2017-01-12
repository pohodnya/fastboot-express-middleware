'use strict';
function fastbootExpressMiddleware(distPath, options) {
    var FastBoot = require('fastboot');
    var opts = options;
    if (arguments.length === 1) {
        if (typeof distPath === 'string') {
            opts = { distPath: distPath };
        }
        else {
            opts = distPath;
        }
    }
    opts = opts || {};
    var log = opts.log !== false ? _log : function () { };
    var fastboot = opts.fastboot;
    if (!fastboot) {
        fastboot = new FastBoot({
            distPath: opts.distPath,
            resilient: opts.resilient
        });
    }
    return function (req, res, next) {
        var path = req.url;
        fastboot.visit(path, { request: req, response: res })
            .then(success, failure);
        function success(result) {
            result.html()
                .then(function (html) {
                var headers = result.headers;
                var statusMessage = result.error ? 'NOT OK ' : 'OK ';
                for (var _i = 0, _a = headers.entries(); _i < _a.length; _i++) {
                    var pair = _a[_i];
                    res.set(pair[0], pair[1]);
                }
                if (result.error) {
                    log("RESILIENT MODE CAUGHT:", result.error.stack);
                    next(result.error);
                }
                log(result.statusCode, statusMessage + path);
                res.status(result.statusCode);
                res.send(html.replace('<html ', '<html lang="ru" '));
            })
                .catch(function (error) {
                res.status(500);
                next(error);
            });
        }
        function failure(error) {
            if (error.name !== "UnrecognizedURLError") {
                res.status(500);
            }
            next(error);
        }
    };
}
var chalk;
function _log(statusCode, message, startTime) {
    chalk = chalk || require('chalk');
    var color = statusCode === 200 ? 'green' : 'red';
    var now = new Date();
    if (startTime) {
        var diff = Date.now() - startTime;
        message = message + chalk.blue(" " + diff + "ms");
    }
    console.log(chalk.blue(now.toISOString()) + " " + chalk[color](statusCode) + " " + message);
}
module.exports = fastbootExpressMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFHYixtQ0FBbUMsUUFBUSxFQUFFLE9BQU87SUFDbEQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXJDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUVuQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsT0FBTyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNsQixDQUFDO0lBQ0gsQ0FBQztJQUVELElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBRWxCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssS0FBSyxHQUFHLElBQUksR0FBRyxjQUFZLENBQUMsQ0FBQztJQUVwRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBRTdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNkLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQztZQUN0QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsVUFBUyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7UUFDNUIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUNuQixRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8s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
