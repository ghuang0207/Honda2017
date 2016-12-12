// components/auth/auth.service.js

(function () {

    'use strict';

    angular
      .module('hondaApp')
      .service('authService', authService);

    authService.$inject = ['lock', 'authManager'];

    function authService(lock, authManager) {

        function login() {
            lock.show();
        }
        function logout() {
            localStorage.removeItem('id_token');
            localStorage.removeItem('profile');
            authManager.unauthenticate();
        }

        // Set up the logic for when a user authenticates
        // This method is called from app.run.js
        function registerAuthenticationListener() {
            
            lock.on('authenticated', function (authResult) {
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', authResult.profile);
                authManager.authenticate();
            }, function (err) {
                console.log(err);
            });
        }

        return {
            login: login,
            logout: logout,
            registerAuthenticationListener: registerAuthenticationListener
        }
    }
})();