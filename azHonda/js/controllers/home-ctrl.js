(function () {

    'use strict';

    angular
      .module('hondaApp')
      .controller('HomeController', HomeController);

    HomeController.$inject = ['authService'];

    function HomeController(authService) {

        var vm = this;
        vm.authService = authService;

    }

}());