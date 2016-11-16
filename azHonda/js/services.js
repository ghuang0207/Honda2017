(function () {
    'use strict';
    var app = angular.module("hondaApp");

    app.service("SrvData", function ($http) {

        this.getAllStates = function () {
            return $http(
            {
                method: 'Get',
                url: 'wsServices/wsSrvTools.asmx/GetAllStates',
                headers: { 'Content-Type': 'application/json' }
            });
        };
    });

} ());