var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    }
    else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    }
    else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};


//</editor-fold>

app.controller('ScreenshotReportController', function ($scope, $http) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
    }

    this.showSmartStackTraceHighlight = true;

    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };

    this.convertTimestamp = function (timestamp) {
        var d = new Date(timestamp),
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),
            dd = ('0' + d.getDate()).slice(-2),
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh === 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    };


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };


    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };

    this.applySmartHighlight = function (line) {
        if (this.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return true;
    };

    var results = [
    {
        "description": "should add a Name as GURU99|Enter GURU99 Name",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "521b5e0fc764463d293dceeb797cacee",
        "instanceId": 3768,
        "browser": {
            "name": "chrome",
            "version": "73.0.3683.86"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ea0059-000d-000d-00bd-00ae00e80005.png",
        "timestamp": 1554549353404,
        "duration": 5492
    },
    {
        "description": "get title test|Enter GURU99 Name",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "521b5e0fc764463d293dceeb797cacee",
        "instanceId": 3768,
        "browser": {
            "name": "chrome",
            "version": "73.0.3683.86"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://juliemr.github.io/favicon.ico - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1554549368125,
                "type": ""
            }
        ],
        "screenShotFile": "00bd00d5-0012-007a-00ed-000c00fd00c6.png",
        "timestamp": 1554549363138,
        "duration": 10112
    },
    {
        "description": "should add a Name as GURU99|Enter GURU99 Name",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "c931fa17322f6dc9b6cd122b3fb4003a",
        "instanceId": 8348,
        "browser": {
            "name": "chrome",
            "version": "73.0.3683.86"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005b00d5-00ca-0074-0036-00f60058000d.png",
        "timestamp": 1554925588590,
        "duration": 9263
    },
    {
        "description": "get title test|Enter GURU99 Name",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "c931fa17322f6dc9b6cd122b3fb4003a",
        "instanceId": 8348,
        "browser": {
            "name": "chrome",
            "version": "73.0.3683.86"
        },
        "message": [
            "Expected 'Super Calculator' to equal 'Supe1r Calculator'."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\Study\\Workspaces\\Protractor\\spec.js:15:32)\n    at C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)\n    at C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://juliemr.github.io/favicon.ico - Failed to load resource: the server responded with a status of 404 ()",
                "timestamp": 1554925613003,
                "type": ""
            }
        ],
        "screenShotFile": "004f007a-009b-00b9-000b-00d000fb00b8.png",
        "timestamp": 1554925603080,
        "duration": 9907
    },
    {
        "description": "Window Handling in Protractor|Enter GURU99 Name",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "c931fa17322f6dc9b6cd122b3fb4003a",
        "instanceId": 8348,
        "browser": {
            "name": "chrome",
            "version": "73.0.3683.86"
        },
        "message": [
            "Failed: Angular could not be found on the page https://www.naukri.com/. If this is not an Angular application, you may need to turn off waiting for Angular.\n                          Please see \n                          https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular-on-page-load"
        ],
        "trace": [
            "Error: Angular could not be found on the page https://www.naukri.com/. If this is not an Angular application, you may need to turn off waiting for Angular.\n                          Please see \n                          https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular-on-page-load\n    at executeAsyncScript_.then (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:720:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"Window Handling in Protractor\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\Study\\Workspaces\\Protractor\\spec.js:19:3)\n    at addSpecsToSuite (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\SHUBHANKAR\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\Study\\Workspaces\\Protractor\\spec.js:1:63)\n    at Module._compile (internal/modules/cjs/loader.js:701:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)\n    at Module.load (internal/modules/cjs/loader.js:600:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:539:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://stats.g.doubleclick.net/r/collect?v=1&aip=1&t=dc&_r=3&tid=UA-182658-1&cid=941366068.1554925624&jid=255284667&_gid=654805908.1554925624&gjid=630489763&_v=j73&z=1387826659 - Failed to load resource: net::ERR_CONNECTION_CLOSED",
                "timestamp": 1554925625249,
                "type": ""
            }
        ],
        "screenShotFile": "0061004a-007e-00c7-0027-000100c900f2.png",
        "timestamp": 1554925613777,
        "duration": 25536
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    }
                    else
                    {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.sortSpecs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.sortSpecs();
    }


});

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

