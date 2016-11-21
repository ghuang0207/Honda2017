(function () {
    'use strict';
    var app = angular.module("hondaApp");

    // unique filter
    app.filter('unique', function () {
        return function (items, filterOn) {

            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {}, newItems = [];

                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function (item) {
                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            return items;
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
                    if (confirm('Are you sure to delete the topic?')){
                        SrvData.DeleteTopic_by_TopicId(changedTopic.TopicId).then(function (response) {
                            var index = $scope.stateTopics.indexOf(changedTopic);
                            $scope.stateTopics.splice(index, 1);
                        }, function (err) {
                            console.log(err);
                        });
                    }
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