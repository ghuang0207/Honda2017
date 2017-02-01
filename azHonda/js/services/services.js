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
            ListAllTopics: function (categoryId) {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/ListAllTopics?categoryId=' + categoryId,
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
            GetTopics_by_Subject: function (subject, categoryId) {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/GetTopics_by_Subject?subject=' + subject + '&categoryId=' + categoryId,
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
            addUpdateTopic: function (Topic) {
                var parameter = { 'TopicObj': JSON.stringify(Topic) };
                return $http(
                    {
                        method: 'POST',
                        url: 'wsServices/wsSrvTools.asmx/AddUpdateTopic',
                        data: parameter,
                        headers: { 'Content-Type': 'application/json' }
                    });
            },
            DeleteTopic_by_TopicId: function (topicId) {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/DeleteTopic_by_TopicId?topicId=' + topicId,
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            GetTopic_by_TopicId: function (topicId) {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/GetTopic_by_TopicId?topicId=' + topicId,
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            SearchTopics: function (Search) {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/GetTopic_by_TopicId?topicId=' + topicId,
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            //Note
            GetNote_by_State: function (stateCode, categoryId) {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/GetNote_by_State?stateCode=' + stateCode + '&categoryId=' + categoryId,
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            AddUpdateNote: function (Note) {
                var parameter = { 'NoteObj': JSON.stringify(Note) };
                return $http(
                    {
                        method: 'POST',
                        url: 'wsServices/wsSrvTools.asmx/AddUpdateNote',
                        data: parameter,
                        headers: { 'Content-Type': 'application/json' }
                    });
            },
            DeleteNote_by_NoteId: function (noteId) {
                return $http(
                {
                    method: 'Get',
                    url: 'wsServices/wsSrvTools.asmx/DeleteNote_by_NoteId?noteId=' + noteId,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
    });

} ());