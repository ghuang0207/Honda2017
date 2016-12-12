'use strict';
var app = angular.module("hondaApp");

app.controller("SummaryCtrl", function ($scope, $mdDialog, $sce, SrvData, $filter) {
    $scope.states = [];
    $scope.categories = [];
    $scope.subjects = [];
    $scope.allTopics = [];

    $scope.select_Category = { CategoryId: 1 };
    $scope.select_Subject = {Subject: 'Relocation'};
    $scope.subjectTopicStates = []; //StateVO
    $scope.selectedMultiStates = [];

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
    //$scope.ListAllTopics = function () {
    //    SrvData.ListAllTopics().then(function (response) {
    //        $scope.allTopics = [];
    //        $scope.allTopics = response.data;
    //    }, function (err) {
    //        console.log(err);
    //    });
    //};

    $scope.SearchTopics_by_Subject = function () {
        
        if ($scope.select_Category && $scope.select_Subject != "") {
            SrvData.GetTopics_by_Subject($scope.select_Subject.Subject, $scope.select_Category.CategoryId).then(function (response) {
                $scope.SubjectTopics = response.data;
                debugger;
                $scope.SubjectTopics = $filter('unique')($scope.SubjectTopics, 'State');
                $scope.subjectTopicStates = [];
                if ($scope.SubjectTopics != "null") {
                    angular.forEach($scope.SubjectTopics, function (topic) {
                        $scope.subjectTopicStates.push(topic.State.StateName); //Push only StateVO
                    });
                }
            }, function (err) {
                console.log(err);
            });
        }
        else {
            alert("please select a category and subject.");
        }
    };


    // multi-state by topics controls
    
    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.isIndeterminate = function () {
        return ($scope.selectedMultiStates.length !== 0 &&
            $scope.selectedMultiStates.length !== $scope.subjectTopicStates.length);
    };

    $scope.isChecked = function () {
        return $scope.selectedMultiStates.length === $scope.subjectTopicStates.length;
    };

    $scope.toggleAll = function () {
        if ($scope.selectedMultiStates.length === $scope.subjectTopicStates.length) {
            //if checked all, uncheck all.
            $scope.selectedMultiStates = [];
        } else if ($scope.selectedMultiStates.length === 0 || $scope.selectedMultiStates.length > 0) {
            //if none or have at least one checked, 
                //select entire array to a new array object//
            $scope.selectedMultiStates = $scope.subjectTopicStates.slice(0);
        }
    };

    // page init load
    $scope.ListAllSubjects();

    $scope.ShowStateTopicsDialog = function (ev, StateInfo, categoryId) {
        //Dialog Control Init
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/dialogs/topics-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals: {
                Info: {
                    StateInfo: StateInfo,
                    categoryId: categoryId
                }
            }
        })
        .then(function (returnVal) {
            $scope.ListAllSubjects();
        }, function () {
            $scope.ListAllSubjects();
        });
    };

    $scope.ShowSubjectTopicsDialog = function (ev, subject, stateCode) {
        //Dialog Control Init
        //var SubjectTopics = $filter('filter')(AllTopics, subject, true, 'Subject');
        //SubjectTopics = $filter('unique')(SubjectTopics, 'State');

        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/dialogs/topics-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals: {
                Info: {
                    subject: subject
                }
            }
        })
        .then(function (returnVal) {
            $scope.ListAllSubjects();
        }, function () {
            $scope.ListAllSubjects();
        });
    };


    // Dialog scope directive ----------------------
    function DialogController($scope, $mdDialog, Info) {

        $scope.Topics = [];
        $scope.$watch('Topics', function (Topics) {
            $scope.modelAsJson = angular.toJson(Topics, true);
        }, true);
        $scope.GetNote_by_State = function () {
            SrvData.GetNote_by_State($scope.StateInfo.StateCode, $scope.categoryId).then(function (response) {
                if (response.data != "null") {
                    $scope.NoteObj = response.data;
                    $scope.NoteObj.ctrl_IsEdit = false;

                    console.log($scope.NoteObj);
                }
                else {
                    $scope.NoteObj = {};
                    $scope.NoteObj.ctrl_IsEdit = false;
                    $scope.NoteObj.NoteId = -1;
                    $scope.NoteObj.Note = '';
                }
            }, function (err) {
                console.log(err);
            });
        };

        if (Info.hasOwnProperty("categoryId")) {
            $scope.isAllowEdit = true;
            $scope.StateInfo = Info.StateInfo;
            $scope.categoryId = Info.categoryId;
            $scope.title = $scope.StateInfo.StateName;

            SrvData.GetTopics_by_State($scope.StateInfo.StateCode, $scope.categoryId).then(function (response) {
                if (response.data != "null") {
                    $scope.Topics = response.data;
                    // format for tree
                    angular.forEach($scope.Topics, function (topic) {
                        try {
                            topic.tree_Subsections = JSON.parse(topic.Content).tree_Subsections;
                        }
                        catch (e) {
                            console.log(e);
                        }
                        //catch-all: to initiate all topics with at least empty array for tree_Subsections to prevent error
                        if (topic.tree_Subsections == undefined) {
                            topic.tree_Subsections = [];
                        }
                    });
                    console.log($scope.Topics);
                }
            }, function (err) {
                console.log(err);
            });

            $scope.GetNote_by_State();
        }
        if (Info.hasOwnProperty("subject")) {
            $scope.isAllowEdit = false;
            $scope.subject = Info.subject
            $scope.title = $scope.subject;
            console.log($scope)

            if ($scope.Topics.length > 0) {
                //format for tree
                angular.forEach($scope.Topics, function (topic) {
                    try {
                        topic.tree_Subsections = JSON.parse(topic.Content).tree_Subsections;
                    }
                    catch (e) {
                        console.log(e);
                    }
                    //catch-all: to initiate all topics with at least empty array for tree_Subsections to prevent error
                    if (topic.tree_Subsections == undefined) {
                        topic.tree_Subsections = [];
                    }
                });
                console.log($scope.Topics);
            }
        }

        //Note
        $scope.EditNote = function () {
            console.log(changedTopic)
            $scope.NoteObj.ctrl_IsEdit = true;
        };
        $scope.SaveChangeNote = function () {
            debugger;
            $scope.NoteObj.StateCode = $scope.StateInfo.StateCode;
            $scope.NoteObj.CategoryId = $scope.categoryId;
            SrvData.AddUpdateNote($scope.NoteObj).then(function (response) {
                $scope.NoteObj.NoteId = response.data;
                $scope.NoteObj.ctrl_IsEdit = false;
            }, function (err) {
                console.log(err);
                alert('Something went wrong when saving the note.');
            });
        };
        $scope.CancelChangeNote = function () {
            $scope.GetNote_by_State();
        };

        // Expand All/Collapse All
        $scope.AddNewTopic = function () {
            var newTopic = {
                'TopicId': -1,
                'State': { 'StateCode': $scope.StateInfo.StateCode },
                'Category': { 'CategoryId': $scope.categoryId },
                'Subject': '',
                'tree_Subsections': [],
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
        $scope.SaveChangeTopic = function (changedTopic) {
            changedTopic.OrderNumber = $scope.Topics.indexOf(changedTopic);
            changedTopic.Content = JSON.stringify({ tree_Subsections: changedTopic.tree_Subsections }) // if need special format before hit Server
            SrvData.addUpdateTopic(changedTopic).then(function (response) {
                debugger;
                changedTopic.TopicId = response.data.d;
                changedTopic.ctrl_IsEdit = false;
            }, function (err) {
                console.log(err);
            });
        };
        $scope.CancelChangeTopic = function (changedTopic) {
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
                        changedTopic.tree_Subsections = JSON.parse(OriginalTopic.Content).tree_Subsections;
                    }
                    catch (e) {
                        changedTopic.tree_Subsections = [];
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
            if (changedTopic.TopicId == -1) {
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
                tree_Questions: []
            });
        };

        $scope.addQuestion = function (Questions) {
            Questions.push({
                //if has another child layer, need to add an empty array (refer to addSubsection)
            });
        };

        //Dialog controls
        $scope.CancelDialog = function () {
            $mdDialog.cancel();
        };
        $scope.print = function () {
            alert("Print this document.");
            //$mdDialog.hide(returnVal);
        };
    };
});
