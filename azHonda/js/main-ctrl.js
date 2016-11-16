(function () {
    'use strict';
    var app = angular.module("hondaApp");

    app.controller("MainCtrl", function ($scope, $mdDialog, $sce, SrvData) {
        $scope.author = "Dawn";
        
        // get all states
        SrvData.getAllStates().then(function (response) {
            $scope.states = response.data;
        }, function (err) {
            console.log(err);
        });

        /*
        $scope.states = [
                            {
                                "name": "Alabama",
                                "abbreviation": "AL"
                                
                            },
                            {
                                "name": "Alaska",
                                "abbreviation": "AK"
                            },
                            {
                                "name": "American Samoa",
                                "abbreviation": "AS"
                            },
                            {
                                "name": "Arizona",
                                "abbreviation": "AZ"
                            },
                            {
                                "name": "Arkansas",
                                "abbreviation": "AR"
                            },
                            {
                                "name": "California",
                                "abbreviation": "CA"
                            },
                            {
                                "name": "Colorado",
                                "abbreviation": "CO"
                            },
                            {
                                "name": "Connecticut",
                                "abbreviation": "CT"
                            },
                            {
                                "name": "Delaware",
                                "abbreviation": "DE"
                            },
                            {
                                "name": "District Of Columbia",
                                "abbreviation": "DC"
                            },
                            {
                                "name": "Micronesia",
                                "abbreviation": "FM"
                            },
                            {
                                "name": "Florida",
                                "abbreviation": "FL"
                            },
                            {
                                "name": "Georgia",
                                "abbreviation": "GA"
                            },
                            {
                                "name": "Guam",
                                "abbreviation": "GU"
                            },
                            {
                                "name": "Hawaii",
                                "abbreviation": "HI"
                            },
                            {
                                "name": "Idaho",
                                "abbreviation": "ID"
                            },
                            {
                                "name": "Illinois",
                                "abbreviation": "IL"
                            },
                            {
                                "name": "Indiana",
                                "abbreviation": "IN"
                            },
                            {
                                "name": "Iowa",
                                "abbreviation": "IA"
                            },
                            {
                                "name": "Kansas",
                                "abbreviation": "KS"
                            },
                            {
                                "name": "Kentucky",
                                "abbreviation": "KY"
                            },
                            {
                                "name": "Louisiana",
                                "abbreviation": "LA"
                            },
                            {
                                "name": "Maine",
                                "abbreviation": "ME"
                            },
                            {
                                "name": "Marshall Islands",
                                "abbreviation": "MH"
                            },
                            {
                                "name": "Maryland",
                                "abbreviation": "MD"
                            },
                            {
                                "name": "Massachusetts",
                                "abbreviation": "MA"
                            },
                            {
                                "name": "Michigan",
                                "abbreviation": "MI"
                            },
                            {
                                "name": "Minnesota",
                                "abbreviation": "MN"
                            },
                            {
                                "name": "Mississippi",
                                "abbreviation": "MS"
                            },
                            {
                                "name": "Missouri",
                                "abbreviation": "MO"
                            },
                            {
                                "name": "Montana",
                                "abbreviation": "MT"
                            },
                            {
                                "name": "Nebraska",
                                "abbreviation": "NE"
                            },
                            {
                                "name": "Nevada",
                                "abbreviation": "NV"
                            },
                            {
                                "name": "New Hampshire",
                                "abbreviation": "NH"
                            },
                            {
                                "name": "New Jersey",
                                "abbreviation": "NJ"
                            },
                            {
                                "name": "New Mexico",
                                "abbreviation": "NM"
                            },
                            {
                                "name": "New York",
                                "abbreviation": "NY"
                            },
                            {
                                "name": "North Carolina",
                                "abbreviation": "NC"
                            },
                            {
                                "name": "North Dakota",
                                "abbreviation": "ND"
                            },
                            {
                                "name": "Northern Mariana Islands",
                                "abbreviation": "MP"
                            },
                            {
                                "name": "Ohio",
                                "abbreviation": "OH"
                            },
                            {
                                "name": "Oklahoma",
                                "abbreviation": "OK"
                            },
                            {
                                "name": "Oregon",
                                "abbreviation": "OR"
                            },
                            {
                                "name": "Palau",
                                "abbreviation": "PW"
                            },
                            {
                                "name": "Pennsylvania",
                                "abbreviation": "PA"
                            },
                            {
                                "name": "Puerto Rico",
                                "abbreviation": "PR"
                            },
                            {
                                "name": "Rhode Island",
                                "abbreviation": "RI"
                            },
                            {
                                "name": "South Carolina",
                                "abbreviation": "SC"
                            },
                            {
                                "name": "South Dakota",
                                "abbreviation": "SD"
                            },
                            {
                                "name": "Tennessee",
                                "abbreviation": "TN"
                            },
                            {
                                "name": "Texas",
                                "abbreviation": "TX"
                            },
                            {
                                "name": "Utah",
                                "abbreviation": "UT"
                            },
                            {
                                "name": "Vermont",
                                "abbreviation": "VT"
                            },
                            {
                                "name": "Virgin Islands",
                                "abbreviation": "VI"
                            },
                            {
                                "name": "Virginia",
                                "abbreviation": "VA"
                            },
                            {
                                "name": "Washington",
                                "abbreviation": "WA"
                            },
                            {
                                "name": "West Virginia",
                                "abbreviation": "WV"
                            },
                            {
                                "name": "Wisconsin",
                                "abbreviation": "WI"
                            },
                            {
                                "name": "Wyoming",
                                "abbreviation": "WY"
                            }
        ]; */


        $scope.topics = [
                { "name": "I. Existence of Statute and Liability", "states": [{ "name": "New York" }, { "name": "Rhode Island"}, { "name": "Wisconsin"}] },
                { "name": "II. Key Provisions", "states": [{ "name": "Maine" }, { "name": "New York"}, { "name": "Pennsylvania"}, { "name": "Texas"}] }
               
        ];

        $scope.showDialog = function (ev, state) {

            state.url = 'https://en.wikipedia.org/wiki/' + state.name;
            $scope.inputs = state;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'myModalContent.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                resolve: {
                    input: function () {
                        return $scope.inputs;
                    }
                }
            })
            .then(function (answer) {

            }, function () {

            });

            // this is for the popup
            function DialogController($scope, $mdDialog, input) {
                $scope.input = input;
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    alert("This function will let the authorized users to add a new topic to this document.")
                    //$mdDialog.hide(answer);
                };
                $scope.print = function () {
                    alert("Print this document.")
                    //$mdDialog.hide(answer);
                };
            }


        }



    });


}());