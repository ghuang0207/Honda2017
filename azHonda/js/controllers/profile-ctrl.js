
'use strict';
var app = angular.module("hondaApp");

app.controller("ProfileCtrl", function ($rootScope, $scope, $location, authService, $interval) {
    debugger;
    $scope.isAdmin = $rootScope.isAdmin;
    $scope.profile = JSON.parse(localStorage.getItem('profile'));
    $scope.sendChangePwEmail = function () {
        var profile = { 'email': '1@bu.edu' }
        debugger;
        authService.updateProfile($scope.profile.user_id, profile);
    }
});
