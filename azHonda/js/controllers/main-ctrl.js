
'use strict';
var app = angular.module("hondaApp");

app.controller("MainCtrl", function ($rootScope, $scope, $location, authService, $interval, SrvData) {
    $scope.currentNavItem = "Marine";
    $scope.authService = authService;

    var stop;
    // Auth0 Role-based Authentication
    stop = $interval(function () {
        console.log("interval started.");
        // get stored login user profile
        var profile = JSON.parse(localStorage.getItem('profile'));
        if (profile != null) {
            $rootScope.isAdmin = profile.isadmin;
            $scope.isAdmin = $rootScope.isAdmin;
            stopInterval();
        } else {
            $rootScope.isAdmin = null;
            $scope.isAdmin = $rootScope.isAdmin;
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
        //localStorage.setItem('profile')
        if ($scope.isAuthenticated) {   
            switch (current) {
                case "Marine":
                    $location.url("/home/1");
                    break;
                case "Power Equipment":
                    $location.url("/home/2");
                    break;
                case "Profile":
                    $location.url("/profile");
                    break;
            }
        } else {
            $location.url("/login");
        }
    });

    SrvData.ListAllCategories().then(function (response) {
        $scope.categories = response.data;
    }, function (err) {
        console.log(err);
    });
});
