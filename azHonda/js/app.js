(function () {
    'use strict';
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        $scope.currentLink = getCurrentLinkFromRoute(current);
    });
});
'use strict';


var app = angular.module("hondaApp", ['ui.router', 'ngMaterial', 'ngAnimate', 'ngSanitize', 'summernote'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('');

        $stateProvider
        .state('hondaWeb', {
            url: '',
            controller: 'MainCtrl',
            templateUrl: 'views/main.html'
        })
        .state('hondaWeb.home', {
            url: '/home',
            controller: 'MainCtrl',
            templateUrl: 'views/home.html'
        })
        .state('hondaWeb.statutes', {
            url: '/statutes',
            controller: 'MainCtrl',
            templateUrl: 'views/statutes.html'
        })
        .state('hondaWeb.news', {
            url: '/news',
            controller: 'MainCtrl',
            templateUrl: 'views/news.html'
        })
        .state('hondaWeb.profile', {
            url: '/profile',
            controller: 'MainCtrl',
            templateUrl: 'views/profile.html'
        })


    }])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('orange');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')
    });


