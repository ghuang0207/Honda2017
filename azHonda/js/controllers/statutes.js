
'use strict';
var app = angular.module("hondaApp");

app.controller("StatutesCtrl", function ($scope) {
    $scope.Topics = [
        {
            TopicId: 1,
            Subject: "I.      Existence of Statute and Liability",
            Subsections: [
                {
                    Name: "Has the state enacted an industry-specific statute governing marine engines?  Are there limitations?",
                    Value: 'Alaska enacted the Marine Products and Motorized Recreational Products Act (“Act”), which applies specifically to dealers of marine products and motorized recreational products.  Alaska Stat. §§ 45.27.395 et seq.', //rich text
                    Questions: [],
                    IsEdit: true,
                    IsExpand: true
                }
            ],
            IsEdit: false,
            IsExpand: true
        },
        {
            TopicId: 2,
            Subject: "II.    Key Provisions",
            Subsections: [
                {
                    Name: "Open Point",
                    Value: null, // to decide: or just toggle
                    Questions: [{
                        Name: 'When may AHM establish a new dealer at a desired location without triggering application of the statute or otherwise subjecting itself to control by the state?',
                        Value: 'No provision, so the dealership agreement and local zoning laws should control.',
                        IsEdit: true,
                        IsExpand: true
                    }
                    ],
                    IsEdit: true,
                    IsExpand: true
                },
                {
                    Name: "Relocation",
                    Value: null,
                    Questions: [{
                        Name: 'What restrictions are placed on relocations if AHM approves the relocation?',
                        Value: 'No provision, so the dealership agreement and local zoning laws should control.',
                        IsEdit: true,
                        IsExpand: true
                    },
                        {
                            Name: 'What restrictions are placed on relocations if AHM rejects the relocation?',
                            Value: 'No provision, but violating a material provision in the dealership agreement constitutes “good cause” for cancellation or nonrenewal.  Alaska Stat. § 45.27.020 (d).',
                            IsEdit: true,
                            IsExpand: true
                        }
                    ],
                    IsEdit: true,
                    IsExpand: true
                }
            ],
            IsEdit: false,
            IsExpand: true
        }
    ];
    $scope.EditMode = "view";
    
    $scope.toggleExpand = function (targetObj) {
        targetObj.IsExpand = !targetObj.IsExpand
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

    $scope.SaveTopicTree = function (Topic) {
        Topic.IsEdit = false;
        //Save topic to db
    }

    $scope.$watch('Topics', function (Topics) {
        $scope.modelAsJson = angular.toJson(Topics, true);
    }, true);
});
