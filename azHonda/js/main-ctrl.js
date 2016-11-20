(function () {
    'use strict';
    var app = angular.module("hondaApp");

    // unique filter
    app.filter('unique', function () {
        // we will return a function which will take in a collection
        // and a keyname
        return function (collection, keyname) {
            // we define our output and keys array;
            var output = [],
                keys = [];

            // we utilize angular's foreach function
            // this takes in our original collection and an iterator function
            angular.forEach(collection, function (item) {
                // we check to see whether our object exists
                var key = item[keyname];
                // if it's not already part of our keys array
                if (keys.indexOf(key) === -1) {
                    // add it to our keys array
                    keys.push(key);
                    // push this item to our final output array
                    output.push(item);
                }
            });
            // return our array which should be devoid of
            // any duplicates
            return output;
        };
    });

    app.controller("MainCtrl", function ($scope, $mdDialog, $sce, SrvData, $filter) {
        $scope.states = [];
        $scope.categories = [];
        $scope.subjects = [];
        $scope.allTopics = [];
        $scope.list_subject_topics = [];

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
        SrvData.ListAllSubjects().then(function (response) {
            $scope.subjects = response.data;
        }, function (err) {
            console.log(err);
        });
        $scope.ListAllTopics = function () {
            SrvData.ListAllTopics().then(function (response) {
                $scope.allTopics = [];
                $scope.allTopics = response.data;
            }, function (err) {
                console.log(err);
            });
        };

        //$filter('filter')($scope.ListAllTopics, expression, comparator, anyPropertyKey)

        $scope.ListAllTopics();

        $scope.showDialog = function (ev, StateInfo, categoryId) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'myModalContent.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                resolve: {
                    StateInfo: function () {
                        return StateInfo
                    },
                    categoryId: function(){
                        return categoryId
                    }
                }
            })
            .then(function (answer) {
                $scope.ListAllTopics();
            }, function () {
                $scope.ListAllTopics();
            });

            // this is for the popup
            function DialogController($scope, $mdDialog, StateInfo, categoryId) {
                $scope.options = {
                    height: 150,
                    toolbar: [
                      ['style', ['bold', 'italic', 'underline', 'clear']],
                      ['color', ['color']],
                      ['para', ['ul', 'ol', 'paragraph']],
                      ['height', ['height']]
                    ]
                };

                $scope.StateInfo = StateInfo;
                $scope.categoryId = categoryId;
                $scope.stateTopics = [];
                $scope.getStateTopics = function () {
                    SrvData.GetTopics_by_State($scope.StateInfo.StateCode, $scope.categoryId).then(function (response) {
                        if (response.data != "null") {
                            $scope.stateTopics = response.data;
                        }
                        else {
                            $scope.stateTopics = [];
                        }
                    }, function (err) {
                        console.log(err);
                    });
                }
                $scope.getStateTopics();
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.print = function () {
                    alert("Print this document.")
                    //$mdDialog.hide(answer);
                };
                $scope.AddNewTopic = function () {
                    var newTopic = { 'TopicId': '', 'State': {'StateCode': $scope.StateInfo.StateCode}, 'Category': {'CategoryId': $scope.categoryId} };
                    $scope.stateTopics.push(newTopic);
                    console.log(newTopic);
                };
                $scope.EditTopic = function (changedTopic) {
                    console.log(changedTopic)
                    changedTopic.isEdit = true;
                };
                $scope.DeleteTopic = function (changedTopic) {
                    alert('This will delete the selected topic.')
                };
                $scope.CancelChange = function (index) {
                    $scope.stateTopics.splice(index, 1);
                };
                $scope.SaveChange = function (changedTopic) {
                    SrvData.addUpdateTopic(changedTopic.TopicId, changedTopic.Subject, changedTopic.Content, changedTopic.State.StateCode, changedTopic.Category.CategoryId).then(function (response) {
                        //updatedTopicId = response.data
                        $scope.getStateTopics();
                    }, function (err) {
                        console.log(err);
                    });
                };
            }

            


        }

    });

}());