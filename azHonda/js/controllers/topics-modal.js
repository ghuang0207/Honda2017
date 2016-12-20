
'use strict';
var app = angular.module("hondaApp");

app.controller("TopicCtrl", function ($scope, $mdDialog, $sce, SrvData, $filter) {

});


function cleanWordPaste(in_word_text) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = in_word_text;
    var newString = tmp.textContent || tmp.innerText;
    // this next piece converts line breaks into break tags
    // and removes the seemingly endless crap code
    newString = newString.replace(/\n\n/g, "<br />").replace(/.*<!--.*-->/g, "");
    // this next piece removes any break tags (up to 10) at beginning
    for (i = 0; i < 10; i++) {
        if (newString.substr(0, 6) == "<br />") {
            newString = newString.replace("<br />", "");
        }
    }
    return newString;
};
