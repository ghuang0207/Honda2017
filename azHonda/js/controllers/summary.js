'use strict';
var app = angular.module("hondaApp");


app.controller("SummaryCtrl", function ($scope, $mdDialog, $sce, SrvData, $filter, $window, $q, $timeout) {
    $scope.states = [];
    $scope.categories = [];
    $scope.subjects = [];
    //$scope.Topics = [];
    $scope.Info = {};

    $scope.select_Category = {CategoryId: '1' };
    $scope.select_Subject = {Subject: ''};
    $scope.subjectTopicStates = []; //StateName
    $scope.selectedMultiStates = []; //StateName
    $scope.notCheckedSubjectTopics = [];
    $scope.showSearchResult = false;

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
    // page init load
    $scope.ListAllSubjects();

    // multi-state by topic tab
    $scope.SearchTopics_by_Subject = function () {
        if ($scope.select_Category && $scope.select_Subject != "") {
            SrvData.GetTopics_by_Subject($scope.select_Subject.Subject, $scope.select_Category.CategoryId).then(function (response) {
                $scope.SubjectTopics = response.data;

                var subjectTopics = $filter('unique')($scope.SubjectTopics, 'State');
                $scope.subjectTopicStates = [];
                if (subjectTopics != "null") {
                    angular.forEach(subjectTopics, function (topic) {
                        $scope.subjectTopicStates.push(topic.State.StateName);
                        //default to all select
                        $scope.selectedMultiStates = $scope.subjectTopicStates.slice(0);
                    });
                }

                $scope.Topics = formatTopicLists($scope.SubjectTopics);
                $scope.showBySubjectResult = true;
                $scope.isAllowEdit = false;
            }, function (err) {
                console.log(err);
            });
        }
        else {
            alert("please select a category and subject.");
        }
    };

    // control tree expand and json formating etc.
    function formatTopicLists(topicList) {
        angular.forEach(topicList, function (topic) {
            try {
                var topicJSON = JSON.parse(topic.Content)
                if (topicJSON.hasOwnProperty('tree_Subsections')) {
                    topic.tree_Subsections = topicJSON.tree_Subsections;
                    //format tree expand element
                    angular.forEach(topic.tree_Subsections, function (Subsection) {
                        if (Subsection) {
                            Subsection.ctrl_IsExpand = false;
                            angular.forEach(Subsection.tree_Questions, function (Question) {
                                Question.ctrl_IsExpand = false;
                            });
                        }
                    });
                }
                if (topicJSON.hasOwnProperty('tree_Value')) {
                    topic.tree_Value = topicJSON.tree_Value;
                }
            }
            catch (e) {
                console.log(e);
            }
            //catch-all: to initiate all topics with at least empty array for tree_Subsections to prevent error
            if (topic.tree_Subsections == undefined) {
                topic.tree_Subsections = [];
            }
        });

        return topicList
    }

    // multi-state by topics controls
    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        debugger;
        if (idx > -1) {
            // existed, so remove
            list.splice(idx, 1);

            // control filtered topic list
            angular.forEach($scope.Topics, function (topic) {
                if (topic.State.StateName == item){
                    var topic_idx = $scope.Topics.indexOf(topic);
                    $scope.Topics.splice(topic_idx, 1);
                    $scope.notCheckedSubjectTopics.push(topic);
                }
            });
        }
        else {
            // not-exist, so add
            list.push(item);

            // control filtered topic list
            angular.forEach($scope.notCheckedSubjectTopics, function (topic) {
                if (topic.State.StateName == item) {
                    var topic_idx = $scope.notCheckedSubjectTopics.indexOf(topic);
                    $scope.notCheckedSubjectTopics.splice(topic_idx, 1);
                    $scope.Topics.push(topic);
                }
            });
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
            $scope.notCheckedSubjectTopics = $scope.Topics.slice(0);
            $scope.Topics = [];
        } else if ($scope.selectedMultiStates.length === 0 || $scope.selectedMultiStates.length > 0) {
            //if none or have at least one checked, 
                //select entire array to a new array object//
            $scope.selectedMultiStates = $scope.subjectTopicStates.slice(0);
            angular.forEach($scope.notCheckedSubjectTopics, function (topic) {
                $scope.Topics.push(topic);
            });
            $scope.notCheckedSubjectTopics = [];
        }
    };
    //*/


    $scope.hideSearchResultView = function () {
        $scope.showSearchResult = false;
        // multi-state by topic
        $scope.showBySubjectResult = false;
        $scope.select_Subject = { Subject: '' };
        $scope.subjectTopicStates = [];
        $scope.selectedMultiStates = [];
    }

    $scope.onEnterSearch = function ($event, keyword, categoryId) {
        $event.preventDefault();

        if ($event.keyCode == 13) {
            //To-do: Change ListAllTopics to search (remember to add category = '')
            SrvData.ListAllTopics().then(function (response) {
                $scope.Topics = response.data;
                $scope.Topics = $filter('filter')($scope.Topics, keyword);
                debugger;
                
                // format for tree
                angular.forEach($scope.Topics, function (topic) {
                    try {
                        var topicJSON = JSON.parse(topic.Content)
                        if (topicJSON.hasOwnProperty('tree_Subsections')) {
                            topic.tree_Subsections = topicJSON.tree_Subsections;
                            //format tree expand element
                            angular.forEach(topic.tree_Subsections, function (Subsection) {
                                if (Subsection) {
                                    Subsection.ctrl_IsExpand = false;
                                    angular.forEach(Subsection.tree_Questions, function (Question) {
                                        Question.ctrl_IsExpand = false;
                                    });
                                }
                            });
                        }
                        if (topicJSON.hasOwnProperty('tree_Value')) {
                            topic.tree_Value = topicJSON.tree_Value;
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    //catch-all: to initiate all topics with at least empty array for tree_Subsections to prevent error
                    if (topic.tree_Subsections == undefined) {
                        topic.tree_Subsections = [];
                    }
                });
                $scope.isAllowEdit = false;

                $scope.Info = {
                    topics: $scope.Topics
                };

                $scope.showSearchResult = true;

                console.log($scope.Topics);
            }, function (err) {
                console.log(err);
            });
        }
    }

    $scope.ShowStateTopicsDialog = function (ev, StateInfo, categoryId) {
        //Dialog Control Init
        $scope.Info = {
            StateInfo: StateInfo,
            categoryId: categoryId
        };

        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/dialogs/topics-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals: {
                Info: $scope.Info
            }
        })
        .then(function (returnVal) {
            $scope.ListAllSubjects();
        }, function () {
            $scope.ListAllSubjects();
        });
    };


    // Dialog scope directive ----------------------
    function DialogController($rootScope, $scope, $mdDialog, Info) {
        $scope.isAdmin = $rootScope.isAdmin;
        $scope.Info = Info;

        // Note section
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
            $scope.StateInfo = $scope.Info.StateInfo;
            $scope.categoryId = $scope.Info.categoryId;
            $scope.title = $scope.StateInfo.StateName;
            $scope.isAllowEdit = true

            $scope.GetNote_by_State();
        }
        if ($scope.Info.hasOwnProperty("subject")) {
            $scope.isAllowEdit = false;
            $scope.title = $scope.Info.subject
            console.log($scope)
        }

        //Note CRUD
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


        // Topic ops (at dialog level - Add)
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
        
        //Dialog controls
        $scope.CancelDialog = function () {
            $mdDialog.cancel();
        };
        $scope.print = function () {
            $timeout($window.print, 0);
        }
    };
});
