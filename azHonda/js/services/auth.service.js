// components/auth/auth.service.js

(function () {

    'use strict';

    angular
      .module('hondaApp')
      .service('authService', authService);

    authService.$inject = ['lock', 'authManager', '$location'];

    function authService(lock, authManager, $location) {

        function login() {
            lock.show();
        }
        function logout() {
            localStorage.removeItem('id_token');
            localStorage.removeItem('profile');
            authManager.unauthenticate();
            $location.url("/login");
        }

        // Set up the logic for when a user authenticates
        // This method is called from app.run.js
        function registerAuthenticationListener() {
            
            lock.on('authenticated', function (authResult) {
                localStorage.setItem('id_token', authResult.idToken);
                
                authManager.authenticate();

                // get user profile
                lock.getProfile(authResult.idToken, function (error, profile) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    debugger;
                    localStorage.setItem('profile', JSON.stringify(profile));
                });

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