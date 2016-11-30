'use strict';
var app = angular.module("hondaApp");

app.controller("SummaryCtrl", function ($scope, $mdDialog, $sce, SrvData, $filter) {
    $scope.states = [];
    $scope.categories = [];
    $scope.subjects = [];
    $scope.allTopics = [];

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

    $scope.ShowStateTopicsDialog = function (ev, StateInfo, categoryId) {
        SrvData.GetTopics_by_State(StateInfo.StateCode, categoryId).then(function (response) {
            var stateTopics = []
            if (response.data != "null") {
                stateTopics = response.data;
            }
            //Dialog Control Init
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/dialogs/topics-modal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    DisplayTopics: stateTopics,
                    Info: {
                        StateInfo: StateInfo,
                        categoryId: categoryId
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

        }, function (err) {
            console.log(err);
        });
    };

    $scope.ShowSubjectTopicsDialog = function (ev, AllTopics, subject, stateCode) {
        //Dialog Control Init
        var SubjectTopics = $filter('filter')(AllTopics, subject, true, 'Subject');
        SubjectTopics = $filter('unique')(SubjectTopics, 'State');
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/dialogs/topics-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals: {
                DisplayTopics: SubjectTopics,
                Info: {
                    subject: subject
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
    };


    // Dialog scope directive
    function DialogController($scope, $mdDialog, DisplayTopics, Info) {
        $scope.Topics = DisplayTopics;
        if (Info.hasOwnProperty("categoryId")) {
            $scope.isAllowEdit = true;
            $scope.StateInfo = Info.StateInfo;
            $scope.categoryId = Info.categoryId;
            $scope.title = $scope.StateInfo.StateName;
            console.log($scope)
        }
        if (Info.hasOwnProperty("subject")) {
            $scope.isAllowEdit = false;
            $scope.subject = Info.subject
            $scope.title = $scope.subject;
            console.log($scope)
        }

        $scope.AddNewTopic = function () {
            var newTopic = { 'TopicId': '', 'State': { 'StateCode': $scope.StateInfo.StateCode }, 'Category': { 'CategoryId': $scope.categoryId } };
            $scope.Topics.push(newTopic);
            console.log(newTopic);
        };
        $scope.EditTopic = function (changedTopic) {
            console.log(changedTopic)
            changedTopic.isEdit = true;
        };
        $scope.DeleteTopic = function (changedTopic) {
            if (confirm('Are you sure to delete the topic?')) {
                SrvData.DeleteTopic_by_TopicId(changedTopic.TopicId).then(function (response) {
                    var index = $scope.Topics.indexOf(changedTopic);
                    $scope.Topics.splice(index, 1);
                }, function (err) {
                    console.log(err);
                });
            }
        };
        $scope.CancelChange = function (changedTopic) {
            debugger;
            if (changedTopic.TopicId == '') {
                var index = $scope.Topics.indexOf(changedTopic);
                $scope.Topics.splice(index, 1);
            }
            else {
                changedTopic.isEdit = false;
            }
        };
        $scope.SaveChange = function (changedTopic) {
            SrvData.addUpdateTopic(changedTopic.TopicId, changedTopic.Subject, changedTopic.Content, changedTopic.State.StateCode, changedTopic.Category.CategoryId).then(function (response) {
                debugger;
                changedTopic.isEdit = false;
            }, function (err) {
                console.log(err);
            });
        };

        //Dialog controls
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.print = function () {
            alert("Print this document.")
            //$mdDialog.hide(returnVal);
        };
    };

});