(function () {
    'use strict';
    var app = angular.module("hondaApp", ['ngMaterial', 'ngAnimate', 'ngSanitize', 'summernote']);

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

}());