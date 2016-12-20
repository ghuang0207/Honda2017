﻿(function () {
    'use strict';
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        $scope.currentLink = getCurrentLinkFromRoute(current);
    });
});
'use strict';


var app = angular.module("hondaApp", [
    'ui.router',
    'ngMaterial',
    'ngAnimate',
    'ngSanitize',
    'summernote',
    'dndLists',
    'auth0.lock',
    'angular-jwt'
])
    .config(['$stateProvider', '$urlRouterProvider', 'lockProvider', function ($stateProvider, $urlRouterProvider, lockProvider) {

        $stateProvider
        .state('hondaWeb', { //base page: Top Banner, Navigation, uiview (for child page)
            url: '',
            controller: 'MainCtrl',
            templateUrl: 'views/main.html'
        })
        .state('hondaWeb.home', { //Summary page: Marine/power Equipment/Multi-state by Topic
            //url: '/home',
            //controller: 'MainCtrl',
            //templateUrl: 'views/home.html'
            url: '/home',
            controller: 'SummaryCtrl',
            templateUrl: 'views/summary.html'
        })
        .state('hondaWeb.statutes', {
            url: '/statutes',
            controller: 'StatutesCtrl',
            templateUrl: 'views/statutes.html'
        })
        .state('hondaWeb.news', {
            url: '/news',
            controller: '',
            templateUrl: 'views/news.html'
        })
        .state('hondaWeb.profile', {
            url: '/profile',
            controller: '',
            templateUrl: 'views/profile.html'
        })

        .state('login', { //Login page
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'views/login.html',
            controllerAs: 'vm'
        });

        lockProvider.init({
            clientID: AUTH0_CLIENT_ID,
            domain: AUTH0_DOMAIN
        });

        $urlRouterProvider.otherwise('/home');
       
    }])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('orange');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')
    });
   


