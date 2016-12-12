(function () {
    'use strict';

    angular
      .module('hondaApp')
      .controller('LoginController', LoginController);

    LoginController.$inject = ['authService'];

    function LoginController(authService) {
        var vm = this;

        vm.authService = authService;

    }
})();