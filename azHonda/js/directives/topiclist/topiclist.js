'use strict';
var app = angular.module("hondaApp");

app.directive('topiclist', ['$location', function () {
      return {
          templateUrl: '../js/directives/topiclist/topiclist.html',
          restrict: 'E',
          scope: {
              Info: '=info'
          },

          controller: function ($rootScope, $scope, SrvData, $filter, $window, $q, $timeout) {
              // data initialization
              $scope.$watch('Info', function (Info) {
                  // get topiclist by state
                  if ($scope.Info.hasOwnProperty("categoryId")) {
                      $scope.isAllowEdit = true;
                      $scope.StateInfo = $scope.Info.StateInfo;
                      $scope.categoryId = $scope.Info.categoryId;

                      SrvData.GetTopics_by_State($scope.StateInfo.StateCode, $scope.categoryId).then(function (response) {
                          if (response.data != "null") {
                              $scope.Topics = formatTopicLists(response.data);
                              console.log($scope.Topics);
                          }
                      }, function (err) {
                          console.log(err);
                      });
                  }
                  // by topiclist
                  if ($scope.Info.hasOwnProperty("topics")) {
                      // Stop binding; so that when expand/collapse won't trigger reload again
                        // - stop binding is a must, so that all collapse/expand won't be override by initial settings
                      $scope.Topics = formatTopicLists(angular.copy($scope.Info['topics']));
                  }
              }, true);
              $scope.isAdmin = $rootScope.isAdmin;
              $scope.Topics = [];
              $scope.$watch('Topics', function (Topics) {
                  $scope.modelAsJson = angular.toJson(Topics, true);
              }, true);


              // Topic ops (at dialog level access - Add)
              $scope.$on('AddNewTopic', function () {
                  $scope.AddNewTopic();
              });
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

              // Topics Expand All/Collapse All 
              $scope.$on('ControlAllTopicsExpand', function (event, args) {
                  // http://stackoverflow.com/questions/19446755/on-and-broadcast-in-angular
                  $scope.ControlAllTopicsExpand(args.Action);
              });
              $scope.ControlAllTopicsExpand = function (Action) {
                  angular.forEach($scope.Topics, function (topic) {
                      topic.ctrl_IsExpand = Action
                      topic.tree_Subsections = toggleTreeTopicChildElements(topic.tree_Subsections, Action, Action);
                  });
              };

              // Topics Edit/save/cancel/delete
              $scope.EditTopic = function (changedTopic) {
                  console.log(changedTopic)
                  changedTopic.ctrl_IsEdit = true;
              };
              $scope.SaveChangeTopic = function (changedTopic) {
                  changedTopic.OrderNumber = $scope.Topics.indexOf(changedTopic);
                  if (changedTopic.tree_Subsections.length > 0) {
                      //subsections
                      changedTopic.Content = JSON.stringify({ tree_Subsections: changedTopic.tree_Subsections }) // if need special format before hit Server
                  }
                  else {
                      //text
                      changedTopic.Content = JSON.stringify({ tree_Value: changedTopic.tree_Value })
                  }
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
                              var topicJSON = JSON.parse(OriginalTopic.Content)
                              if (topicJSON.hasOwnProperty('tree_Subsections')) {
                                  changedTopic.tree_Subsections = topicJSON.tree_Subsections;
                              }
                              if (topicJSON.hasOwnProperty('tree_Value')) {
                                  changedTopic.tree_Value = topicJSON.tree_Value;
                              }
                          }
                          catch (e) {
                              changedTopic.tree_Subsections = [];
                          }
                          if (changedTopic.tree_Subsections == undefined) {
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

              //In-topicTree functions:
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


              // shared control tree expand and json formating etc.
              function formatTopicLists(topicList) {
                  angular.forEach(topicList, function (topic) {
                      try {
                          var topicJSON = JSON.parse(topic.Content)
                          // Subsections
                          if (topicJSON.hasOwnProperty('tree_Subsections')) {
                              topic.tree_Subsections = toggleTreeTopicChildElements(topicJSON.tree_Subsections, false, false);                              
                          }
                          // Text
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

              function toggleTreeTopicChildElements(tree_Subsections, subsectionExpand, QuestionExpand) {
                  // input SINGLE topic: format tree expand element
                  angular.forEach(tree_Subsections, function (Subsection) {
                      if (Subsection) {
                          Subsection.ctrl_IsExpand = subsectionExpand; //True/False
                          angular.forEach(Subsection.tree_Questions, function (Question) {
                              Question.ctrl_IsExpand = QuestionExpand; //True/False
                          });
                      }
                  });
                  return tree_Subsections;
              }

          }
      }
  }]);