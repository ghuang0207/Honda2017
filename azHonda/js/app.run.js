(function () {

    'use strict';

    angular
      .module('hondaApp')
      .run(run);

    run.$inject = ['$rootScope', 'authService', 'lock', 'authManager'];

    function run($rootScope, authService, lock, authManager) {
        // Put the authService on $rootScope so its methods
        // can be accessed from the nav bar
        $rootScope.authService = authService;

        // Register the authentication listener that is
        // set up in auth.service.js
        authService.registerAuthenticationListener();

        // Register the synchronous hash parser
        // when using UI Router
        lock.interceptHash();

        // Use the authManager from angular-jwt to check for
        // the user's authentication state when the page is
        // refreshed and maintain authentication
        authManager.checkAuthOnRefresh();
    }

})();