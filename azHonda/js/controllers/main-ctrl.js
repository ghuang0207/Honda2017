
'use strict';
var app = angular.module("hondaApp");



app.controller("MainCtrl", function ($scope, $location, authService, $interval) {
    $scope.currentNavItem = "Summaries";
    
    var stop;

    stop = $interval(function () {
        console.log("interval started.");
        var profile = JSON.parse(localStorage.getItem('profile'));
        if (profile != null) {
            $scope.isAdmin = profile.isadmin;
            stopInterval();
        } else {
            $scope.isAdmin = null;
        }

    }, 1000);

    function stopInterval() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
            console.log("interval stopped");
        }
    };

    $scope.$watch('currentNavItem', function (current, old) {
        $scope.authService = authService;

        
        

        //localStorage.setItem('profile')
        
        switch (current) {
            case "Statutes":
                $location.url("/statutes");
                break;
            case "Summaries":
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
