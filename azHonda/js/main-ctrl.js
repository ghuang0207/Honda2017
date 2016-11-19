(function () {
    'use strict';
    var app = angular.module("hondaApp");

    app.controller("MainCtrl", function ($scope, $mdDialog, $sce, SrvData) {
        // get all states
        SrvData.ListAllCategories().then(function (response) {
            $scope.categories = response.data;
        }, function (err) {
            console.log(err);
        });
        SrvData.ListAllStates().then(function (response) {
            $scope.states = response.data;
        }, function (err) {
            console.log(err);
        });


        $scope.topics = [
                { "name": "I. Existence of Statute and Liability", "states": [{ "name": "New York" }, { "name": "Rhode Island"}, { "name": "Wisconsin"}] },
                { "name": "II. Key Provisions", "states": [{ "name": "Maine" }, { "name": "New York"}, { "name": "Pennsylvania"}, { "name": "Texas"}] }
        ];

        $scope.showDialog = function (ev, stateObj, categoryId) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'myModalContent.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                resolve: {
                    stateInfo: function(){
                        return stateObj
                    },
                    categoryId: function(){
                        return categoryId
                    }
                }
            })
            .then(function (answer) {

            }, function () {

            });


            $scope.stateTopics = [];
            // this is for the popup
            function DialogController($scope, $mdDialog, stateInfo, categoryId) {
               
                $scope.options = {
                    height: 150,
                    toolbar: [
                      ['style', ['bold', 'italic', 'underline', 'clear']],
                      ['color', ['color']],
                      ['para', ['ul', 'ol', 'paragraph']],
                      ['height', ['height']]
                    ]
                };

                $scope.stateInfo = stateInfo;
                SrvData.GetTopics_by_State(stateInfo.StateCode, categoryId).then(function (response) {
                    $scope.stateTopics = response.data;
                    //alert($scope.stateTopics);
                }, function (err) {
                    console.log(err);
                });
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    //alert("This function will let the authorized users to add a new topic to this document.")
                    //$mdDialog.hide(answer);
                    
                    $scope.addNewTopic();
                };
                $scope.print = function () {
                    alert("Print this document.")
                    //$mdDialog.hide(answer);
                };

                $scope.addNewTopic = function () {

                    console.log('add new entity');
                    var newTopic = { 'TopicId': 0, 'StateCode': stateObj.StateCode, 'CategoryId': categoryId };

                    $scope.stateTopics.push(newTopic);

                    console.log(newTopic);

                };

                $scope.removeTopic = function (index) {

                    //var lastItem = $scope.States.length - 1;
                    $scope.stateTopics.splice(index, 1);
                    //$scope.GetTotal();
                };

            }

            


        }



    });


}());