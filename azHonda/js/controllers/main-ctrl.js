
'use strict';
var app = angular.module("hondaApp");



app.controller("MainCtrl", function ($scope, $location, authService) {
    $scope.currentNavItem = "Summaries";
    debugger;
    


    $scope.$watch('currentNavItem', function (current, old) {
        $scope.authService = authService;
        
        switch (current) {
            case "Statutes":
                $location.url("/statutes");
                break;
            case "Summaries":
                debugger;
                if ($scope.isAuthenticated) {
                    $location.url("/home");
                } else {
                    $location.url("/login");
                }
                
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
