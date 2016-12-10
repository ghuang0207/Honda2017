(function () {
    'use strict';

    angular
      .module('hondaApp')
      .controller('LoginController', LoginController);

    function LoginController(authService) {
        debugger;
        var vm = this;

        vm.authService = authService;

    }
})();