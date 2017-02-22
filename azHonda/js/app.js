(function () {
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
    'angular-jwt',
    'auth0.auth0'
])
    .config(['$stateProvider', '$urlRouterProvider', 'lockProvider', 'jwtOptionsProvider', 'angularAuth0Provider', '$locationProvider',
function ($stateProvider, $urlRouterProvider, lockProvider, jwtOptionsProvider, angularAuth0Provider, $locationProvider) {

        $stateProvider
        .state('hondaWeb', { //base page: Top Banner, Navigation, uiview (for child page)
            url: '',
            controller: 'MainCtrl',
            templateUrl: 'views/main.html'
        })
        .state('hondaWeb.home', { //Summary page: Marine/power Equipment/Multi-state by Topic
            url: '/home/:categoryId',
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
        .state('profile', {
            url: '/profile',
            controller: 'ProfileCtrl',
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
            domain: AUTH0_DOMAIN,
            options: {
                theme: {
                    logo: '../images/FH-logo-Honda.png',
                    primaryColor: "#0077be"
                },
                languageDictionary: {
                    title: "Log in"
                }
            }
        });

            // Configuration for angular-jwt
            // Configure a tokenGetter so that the isAuthenticated
            // method from angular-jwt can be used
        jwtOptionsProvider.config({
            tokenGetter: function () {
                return localStorage.getItem('id_token');
            }
        });

        // Initialization for the angular-auth0 library
        angularAuth0Provider.init({
            clientID: AUTH0_CLIENT_ID,
            domain: AUTH0_DOMAIN,
            responseType: 'token id_token',
            redirectUri: '/home/1'
        });

            // Remove the ! from the hash so that
            // auth0.js can properly parse it
        $locationProvider.hashPrefix('');

        $urlRouterProvider.otherwise('/home/1');
       
    }])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('orange');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')
    });
   


