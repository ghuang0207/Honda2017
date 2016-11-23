'use strict';
var app = angular.module("hondaApp");

app.controller("SummaryCtrl", function ($scope, $mdDialog, $sce, SrvData) {
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
    $scope.ListAllSubjects = function () {
        SrvData.ListAllSubjects().then(function (response) {
            $scope.subjects = response.data;
        }, function (err) {
            console.log(err);
        });
    };
    $scope.ListAllTopics = function () {
        SrvData.ListAllTopics().then(function (response) {
            $scope.allTopics = [];
            $scope.allTopics = response.data;
        }, function (err) {
            console.log(err);
        });
    };

    $scope.ListAllSubjects();
    $scope.ListAllTopics();

    $scope.showDialog = function (ev, StateInfo, categoryId) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/dialogs/topics-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            resolve: {
                StateInfo: function () {
                    return StateInfo
                },
                categoryId: function () {
                    return categoryId
                }
            }
        })
        .then(function (returnVal) {
            $scope.ListAllTopics();
            $scope.ListAllSubjects();
        }, function () {
            $scope.ListAllTopics();
            $scope.ListAllSubjects();
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
                //$mdDialog.hide(returnVal);
            };
            $scope.AddNewTopic = function () {
                var newTopic = { 'TopicId': '', 'State': { 'StateCode': $scope.StateInfo.StateCode }, 'Category': { 'CategoryId': $scope.categoryId } };
                $scope.stateTopics.push(newTopic);
                console.log(newTopic);
            };
            $scope.EditTopic = function (changedTopic) {
                console.log(changedTopic)
                changedTopic.isEdit = true;
            };
            $scope.DeleteTopic = function (changedTopic) {
                if (confirm('Are you sure to delete the topic?')) {
                    SrvData.DeleteTopic_by_TopicId(changedTopic.TopicId).then(function (response) {
                        var index = $scope.stateTopics.indexOf(changedTopic);
                        $scope.stateTopics.splice(index, 1);
                    }, function (err) {
                        console.log(err);
                    });
                }
            };
            $scope.CancelChange = function (changedTopic) {
                debugger;
                if (changedTopic.TopicId == '') {
                    var index = $scope.stateTopics.indexOf(changedTopic);
                    $scope.stateTopics.splice(index, 1);
                }
                else {
                    changedTopic.isEdit = false;
                }
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