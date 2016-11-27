
'use strict';
var app = angular.module("hondaApp");

app.controller("MainCtrl", function ($scope, $location) {
    $scope.currentNavItem = "Summaries";

    $scope.$watch('currentNavItem', function (current, old) {
        switch (current) {
            case "Statutes":
                $location.url("/statutes");
                break;
            case "Summaries":
                $location.url("/home");
                break;
            case "News":
                $location.url("/news");
                break;
            case "Profile":
                $location.url("/profile");
                break;
        }
    });
});
