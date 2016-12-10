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
    'angular-jwt'
    ])
    .config(['$stateProvider', '$urlRouterProvider', 'lockProvider', function ($stateProvider, $urlRouterProvider, lockProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider
        .state('hondaWeb', { //base page
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
            controller: 'StatutesCtrl',
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
        .state('login', {
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'views/login.html',
            controllerAs: 'vm'
        });

        lockProvider.init({
            clientID: 'KzGc1hs7551SZpNrTFlnRuFqdJZIq8kz',
            domain: 'foley.auth0.com'
        });


    }])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('orange');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')
    })
    .run(run);

    run.$inject = ['$rootScope', 'authService', 'lock'];

    function run($rootScope, authService, lock) {
        debugger;
        
        // Put the authService on $rootScope so its methods
        // can be accessed from the nav bar
        $rootScope.authService = authService;

        // Register the authentication listener that is
        // set up in auth.service.js
        authService.registerAuthenticationListener();

        // Register the synchronous hash parser
        // when using UI Router
        lock.interceptHash();
    }



