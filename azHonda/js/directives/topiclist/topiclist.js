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
                  debugger;
                  if ($scope.Info.hasOwnProperty("categoryId")) {
                      $scope.isAllowEdit = true;
                      $scope.StateInfo = $scope.Info.StateInfo;
                      $scope.categoryId = $scope.Info.categoryId;

                      SrvData.GetTopics_by_State($scope.StateInfo.StateCode, $scope.categoryId).then(function (response) {
                          if (response.data != "null") {
                              $scope.Topics = response.data;
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
                              console.log($scope.Topics);
                          }
                      }, function (err) {
                          console.log(err);
                      });

                  }
                  if ($scope.Info.hasOwnProperty("subject")) {
                      $scope.isAllowEdit = false;
                      $scope.subject = $scope.Info.subject;
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
                  if ($scope.Info.hasOwnProperty("topics")) {
                      debugger;
                      $scope.Topics = $scope.Info['topics'];
                  }

              }, true);
              $scope.isAdmin = $rootScope.isAdmin;
              $scope.Topics = [];
              $scope.$watch('Topics', function (Topics) {
                  $scope.modelAsJson = angular.toJson(Topics, true);
              }, true);

              

              // To do: topics Expand All/Collapse All


              // Topic ops (at dialog level access - Add)
              $scope.$on('AddNewTopic', function () {
                  $scope.AddNewTopic()
              })
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
              // topics Edit/save/cancel/delete
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
          }
      }
  }]);