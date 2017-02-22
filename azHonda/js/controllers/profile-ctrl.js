
'use strict';
var app = angular.module("hondaApp");

app.controller("ProfileCtrl", function ($rootScope, $scope, SrvData) {
    $scope.NewUser = {};
    $scope.isAdmin = $rootScope.isAdmin;
    $scope.profile = JSON.parse(localStorage.getItem('profile'));
    $scope.AddNewUser = function () {
        if ($scope.NewUser.Email.trim() == "" || $scope.NewUser.Password.trim() == "") {
            alert("Please fill out Email and Password for new user.")
        }
        else {
            SrvData.CreateAuthUser($scope.NewUser).then(function (response) {
                $scope.NewUser.Email = '';
                $scope.NewUser.Password = '';
                alert('Successfully created a new user.')
            }, function (err) {
                console.log(err);
            });
        }
    }
});
