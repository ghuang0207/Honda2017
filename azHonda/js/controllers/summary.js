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
                // format for tree
                angular.forEach(stateTopics, function (topic) {
                    try {
                        topic.Subsections = JSON.parse(topic.Content).Subsections;
                    }
                    catch (e) {
                        topic.Subsections = [];
                    }
                });
                console.log(stateTopics);
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
        if (SubjectTopics.length > 0) {
            //format for tree
            angular.forEach(SubjectTopics, function (topic) {
                try {
                    topic.Subsections = JSON.parse(topic.Content).Subsections;
                }
                catch (e) {
                    topic.Subsections = [];
                }
            });
            console.log(SubjectTopics);
        }
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

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }


    // Dialog scope directive ----------------------
    function DialogController($scope, $mdDialog, DisplayTopics, Info) {
        // Populate past-in topics to scope
        $scope.Topics = DisplayTopics;
        $scope.$watch('Topics', function (Topics) {
            $scope.modelAsJson = angular.toJson(Topics, true);
        }, true);
        debugger;
        if (Info.hasOwnProperty("categoryId")) {
            $scope.isAllowEdit = true;
            $scope.StateInfo = Info.StateInfo;
            $scope.categoryId = Info.categoryId;
            $scope.title = $scope.StateInfo.StateName;
            console.log($scope)
            //Format Topic Tree with IsEdit/ctrl_IsExpand  //Or Just save raw tree without any change
        }
        if (Info.hasOwnProperty("subject")) {
            $scope.isAllowEdit = false;
            $scope.subject = Info.subject
            $scope.title = $scope.subject;
            console.log($scope)
            //Format Topic Tree with IsEdit/ctrl_IsExpand  //Or Just save raw tree without any change
        }

        // Expand All/Collapse All

        $scope.AddNewTopic = function () {
            var newTopic = {
                'TopicId': -1,
                'State': { 'StateCode': $scope.StateInfo.StateCode },
                'Category': { 'CategoryId': $scope.categoryId },
                'Subject': '',
                'Subsections': [],
                'ctrl_IsEdit': true,
                'ctrl_IsExpand': true
            };
            $scope.Topics.push(newTopic);
            console.log(newTopic);
        };
        $scope.EditTopic = function (changedTopic) {
            console.log(changedTopic)
            changedTopic.ctrl_IsEdit = true;
        };
        $scope.SaveChange = function (changedTopic) {
            debugger;
            changedTopic.Content = JSON.stringify(changedTopic) // if need special format before hit Server
            SrvData.addUpdateTopic(changedTopic).then(function (response) {
                debugger;
                changedTopic.TopicId = response.data;
                changedTopic.ctrl_IsEdit = false;
            }, function (err) {
                console.log(err);
            });
        };
        $scope.CancelChange = function (changedTopic) {
            debugger;
            if (changedTopic.TopicId == -1) {
                changedTopic.Subject.trim() == ""; //only delete those with topicId == -1 and empty Subject
                var index = $scope.Topics.indexOf(changedTopic);
                $scope.Topics.splice(index, 1);
                changedTopic.ctrl_IsEdit = false;
            } else {
                SrvData.GetTopic_by_TopicId(changedTopic.TopicId).then(function (response) {
                    var OriginalTopic = response.data;
                    //replace editable parts with original data pulled from db.
                    try {
                        changedTopic.Subsections = JSON.parse(OriginalTopic.Content).Subsections;
                    }
                    catch (e) {
                        changedTopic.Subsections = [];
                    }
                    changedTopic.Subject = OriginalTopic.Subject;
                    changedTopic.ctrl_IsExpand = true;
                    changedTopic.ctrl_IsEdit = false;
                }, function (err) {
                    console.log(err);
                });
            }
            
        };
        $scope.DeleteTopic = function (changedTopic) {
            if (changedTopic.TopicId == '') {
                // empty/new topic, just delete. No need for confirming.
                var index = $scope.Topics.indexOf(changedTopic);
                $scope.Topics.splice(index, 1);
            }
            else {
                if (confirm('Are you sure to delete the entire topic and its sub-items?')) {
                    SrvData.DeleteTopic_by_TopicId(changedTopic.TopicId).then(function (response) {
                        var index = $scope.Topics.indexOf(changedTopic);
                        $scope.Topics.splice(index, 1);
                    }, function (err) {
                        console.log(err);
                        alert('Something went wrong when deleting. Please try again.');
                    });
                }
            }
        };

        //In-Tree functions:
        $scope.toggleExpand = function (targetObj) {
            targetObj.ctrl_IsExpand = !targetObj.ctrl_IsExpand
        }

        $scope.addSubsection = function (Subsections) {
            Subsections.push({
                Questions: []
            });
        };

        $scope.addQuestion = function (Questions) {
            Questions.push({
            });
        };

        //Dialog controls
        $scope.CancelDialog = function () {
            $mdDialog.cancel();
        };
        $scope.print = function () {
            alert("Print this document.")
            //$mdDialog.hide(returnVal);
        };
    };

});