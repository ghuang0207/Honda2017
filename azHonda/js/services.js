(function () {
    'use strict';
    var app = angular.module("hondaApp");

    app.factory("SrvData", function ($http) {
        return {
            ListAllStates: function () {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/ListAllStates',
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            ListAllCategories: function () {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/ListAllCategories',
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            ListAllTopics: function () {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/ListAllTopics',
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            ListAllSubjects: function () {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/ListAllSubjects',
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            GetTopics_by_State: function (stateCode, categoryId) {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/GetTopics_by_State?stateCode=' + stateCode + '&categoryId=' + categoryId,
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            GetStates_by_Subject: function (subject) {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/GetStates_by_Subject?subject=' + subject,
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            addUpdateTopic: function (topicId, subject, content, state, category) {
                var parameter = JSON.stringify({ 'topicId': topicId, 'subject': subject, 'content': content, 'stateCode': state, 'category': category });
                return $http(
                    {
                        method: 'POST',
                        url: 'wsServices/wsSrvTools.asmx/AddUpdateTopic',
                        data: parameter,
                        headers: { 'Content-Type': 'application/json' }
                    });
            }
        }
    });

} ());