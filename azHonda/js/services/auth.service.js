// components/auth/auth.service.js

(function () {

    'use strict';

    angular
      .module('hondaApp')
      .service('authService', authService);

    authService.$inject = ['lock', 'authManager', '$location', '$http', 'angularAuth0'];

    function authService(lock, authManager, $location, $http, angularAuth0) {

        function login() {
            //open the widget and then listen for successful authentication with the authenticated event. 
            //When the authenticated event is fired, the user's id_token will be returned which can then be used to get the user's profile with Lock's getProfile method.
            lock.show();

        }
        function logout() {
            localStorage.removeItem('id_token');
            localStorage.removeItem('profile');
            authManager.unauthenticate();
            $location.url("/login");
        }
        // custom login https://auth0.com/docs/quickstart/spa/angularjs/02-custom-login
        function signup(username, password, callback) {
            angularAuth0.signup({
                connection: 'Username-Password-Authentication',
                responseType: 'token',
                email: username,
                password: password
            }, callback);
        }

        function updateProfile(id, profile) {
            profile.connection = 'Username-Password-Authentication';
            return $http(
                {
                    method: 'Patch',
                    url: 'http://' + AUTH0_DOMAIN + '/api/v2/users/' + id,
                    data: JSON.stringify(profile),
                    headers: { 'Content-Type': 'application/json' }
                });
        }

        // Set up the logic for when a user authenticates
        // This method is called from app.run.js
        function registerAuthenticationListener() {
            
            lock.on('authenticated', function (authResult) {
                // When the user successfully authenticates, their JWT will be saved in local storage as id_token
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
            signup: signup,
            updateProfile: updateProfile,
            registerAuthenticationListener: registerAuthenticationListener
        }
    }
})();