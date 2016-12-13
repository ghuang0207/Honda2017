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
    'angular-jwt', 'angularTrix'
])
    .config(['$stateProvider', '$urlRouterProvider', 'lockProvider', function ($stateProvider, $urlRouterProvider, lockProvider) {

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
   


