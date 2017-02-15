'use strict';
// gch: for using iFrame in a dialogs
app.filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

// gch: to display special characters(&#8220;) from rss feed
app.filter('html', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});


// orderby for Object extension
app.filter('orderObjectBy', function () {
    return function (input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function (a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});