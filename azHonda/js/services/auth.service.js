// components/auth/auth.service.js

(function () {

    'use strict';

    angular
      .module('hondaApp')
      .service('authService', authService);

    function authService(lock, authManager) {

        function login() {
            debugger;
            lock.show();
            authManager.signin({}, function (profile, token) {
                debugger;
                var s = token;
            });
        }
        function logout() {
            localStorage.removeItem('id_token');
            authManager.unauthenticate();
        }

        // Set up the logic for when a user authenticates
        // This method is called from app.run.js
        function registerAuthenticationListener() {
            lock.on('authenticated', function (authResult) {
                debugger;
                localStorage.setItem('id_token', authResult.idToken);
                authManager.authenticate();
            });
        }

        return {
            login: login,
            registerAuthenticationListener: registerAuthenticationListener
        }
    }
})();