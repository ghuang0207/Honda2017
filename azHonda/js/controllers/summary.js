'use strict';
var app = angular.module("hondaApp");


app.controller("SummaryCtrl", function ($scope, $mdDialog, $sce, SrvData, $filter, $window, $q, $timeout, $stateParams) {
    //alert($stateParams.categoryId);

    $scope.states = [];
    $scope.category = {};
    $scope.subjects = [];
    $scope.By_State_Topics_Info = {};
    $scope.By_Search_Topics_Info = {};

    $scope.By_Subject_Topics_Info = {};
    $scope.subjectTopicStates = []; //StateName
    $scope.selectedMultiStates = []; //StateName
    $scope.displayingSubjectTopics = []; // for 'watch' to update By_Subject_Topics_Info to update directive to show filtered subject topic list
    $scope.notCheckedSubjectTopics = []; //Temp storage of original/non-filter_by_subject_yet topics, so later can get unchecked topic back from this list
    $scope.showSearchResult = false;

    // Load init data
    SrvData.ListAllCategories().then(function (response) {
        $scope.category = $.grep(response.data, function (c) {
            return c.CategoryId.toString() == $stateParams.categoryId.toString();
        })[0];
        // update subjects based on category
        $scope.ListAllSubjects();
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
            // List unique subject based on selected category
            $scope.subjects = $.grep(response.data, function (s) {
                return s.Category.CategoryId.toString() == $scope.category.CategoryId.toString();
            });
            // Temp! Production should be filter by 'Subject', NOT categoryId
            $scope.subjects = $filter('unique')($scope.subjects, 'Category.CategoryId');//$filter('unique')($scope.subjects, 'Subject');
        }, function (err) {
            console.log(err);
        });
    };

    // centralized watch displayingSubjectTopics to update By_Subject_Topics_Info object to pass into Directive
    $scope.$watch('displayingSubjectTopics', function (displayingSubjectTopics) {
        // update subjects dropdown when category change
        $scope.By_Subject_Topics_Info = {
            topics: displayingSubjectTopics
        };
    }, true);

    // Starts - multi-state by topics controls
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
    $scope.toggle = function (item, list) {
        debugger;
        var idx = list.indexOf(item);
        if (idx > -1) {
            // existed, so remove
            list.splice(idx, 1);

            // control filtered topic list
            angular.forEach($scope.displayingSubjectTopics, function (topic) {
                if (topic.State.StateName == item){
                    var topic_idx = $scope.displayingSubjectTopics.indexOf(topic);
                    $scope.displayingSubjectTopics.splice(topic_idx, 1);
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
                    $scope.displayingSubjectTopics.push(topic);
                }
            });
        }
    };
    $scope.toggleAll = function () {
        if ($scope.selectedMultiStates.length === $scope.subjectTopicStates.length) {
            //if checked all, uncheck all.
            $scope.selectedMultiStates = [];
            $scope.notCheckedSubjectTopics = $scope.displayingSubjectTopics.slice(0);
            $scope.displayingSubjectTopics = [];
        } else if ($scope.selectedMultiStates.length === 0 || $scope.selectedMultiStates.length > 0) {
            //if none or have at least one checked, 
                //select entire array to a new array object//
            $scope.selectedMultiStates = $scope.subjectTopicStates.slice(0);
            angular.forEach($scope.notCheckedSubjectTopics, function (topic) {
                $scope.displayingSubjectTopics.push(topic);
            });
            $scope.notCheckedSubjectTopics = [];
        }
    };
    // End - multi-state by topics controls */

    $scope.hideSearchResultView = function () {
        $scope.showSearchResult = false;
        // multi-state by topic
        $scope.showBySubjectResult = false;
        $scope.subjectTopicStates = [];
        $scope.selectedMultiStates = [];
    }

    $scope.onEnterSearch = function ($event, keyword, categoryId) {
        $event.preventDefault();

        if ($event.keyCode == 13) {

            $scope.showSearchResult = true;
            $scope.searching = true;

            SrvData.ListAllTopics(categoryId).then(function (response) {
                
                var topics = response.data;
                topics = $filter('filter')(topics, keyword);
                
                $scope.By_Search_Topics_Info = {
                    topics: topics
                };

                $scope.isAllowEdit = false;
                $scope.searching = false;

                console.log(topics);
            }, function (err) {
                console.log(err);
            });
        }
    }

    // multi-state by topic tab
    $scope.SearchTopics_by_Subject = function () {
        if ($scope.select_Subject) {
            $scope.loading = true;
            // get data and filter it for $scope.displayingSubjectTopics
            SrvData.GetTopics_by_Subject($scope.select_Subject.Subject, $scope.category.CategoryId).then(function (response) {
                var subjectTopics = response.data;

                if (subjectTopics != "null") {
                    angular.forEach(subjectTopics, function (topic) {
                        $scope.subjectTopicStates.push(topic.State.StateName);
                        //set default to all select
                        $scope.selectedMultiStates = $scope.subjectTopicStates.slice(0);
                    });
                    
                    $scope.displayingSubjectTopics = subjectTopics;
                }
                else {
                    $scope.displayingSubjectTopics = [];
                }

                $scope.loading = false;
                $scope.showBySubjectResult = true;
                $scope.isAllowEdit = false;
            }, function (err) {
                console.log(err);
            });
        }
        else {
            alert("please select a subject.");
        }
    };

    $scope.ShowStateTopicsDialog = function (ev, StateInfo, categoryId) {
        //Dialog Control Init
        $scope.By_State_Topics_Info = {
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
                Info: $scope.By_State_Topics_Info
            }
        })
        .then(function (returnVal) {
            // md callback when dialog return value
        }, function () {
            // md callback when dialog return value
        });
    };

    $scope.ShowStatuteDialog = function (ev, StateInfo, categoryId) {
        alert('Under Construction');
    }


    // Dialog scope directive ----------------------
    function DialogController($rootScope, $scope, $mdDialog, Info) {
        $scope.isAdmin = $rootScope.isAdmin;
        $scope.Info = Info;

        //State Note section
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

        //State Note CRUD
        $scope.EditNote = function () {
            console.log(changedTopic)
            $scope.NoteObj.ctrl_IsEdit = true;
        };
        $scope.SaveChangeNote = function () {
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
        
        $scope.AddNewTopic = function () {
            // call the add new topic in topiclist directive
            $scope.$broadcast('AddNewTopic');
            // and in directive, it will listen for this broadcast and run the defined "addNewTopic" function inside the directive
        };
        
        //Dialog controls
        $scope.CancelDialog = function () {
            $mdDialog.cancel();
        };
        $scope.print = function () {
            // expand all topics first
            $scope.$broadcast('ControlAllTopicsExpand', { Action: true });

            var contentToPrint = document.getElementById('testprint').innerHTML;
            var windowPopup = $window.open('', '_blank', 'width=1500,height=1500');
            windowPopup.document.open();
            windowPopup.document.write('<html><head><link rel="stylesheet" type="text/css" href="" /><style></style></head><body onload="window.print()">' + contentToPrint + '</body></html>');
            windowPopup.document.close();
        }
    };
});
