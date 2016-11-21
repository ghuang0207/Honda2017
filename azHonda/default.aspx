<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="azHonda._default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div class="container-fluid" style="max-width:80vw" ng-controller="MainCtrl">
     
  <md-content>
    <md-tabs md-dynamic-height md-border-bottom>
      <md-tab label="{{c.Category}}" ng-repeat="c in categories">
        <md-content class="md-padding">
          <h4 class="md-display">{{c.Category}}</h4>

            <div layout="row" layout-wrap>
                <div flex="20" ng-repeat="s in states">
                    <md-button class="md-primary" style="text-align:left !important; margin:0px !important" ng-click="showDialog($event, s, c.CategoryId)">
                        {{s.StateName}}
                    </md-button> 
                </div>
            </div>

        </md-content>
      </md-tab>

      <md-tab label="Multi-State by Topic">
        <md-content class="md-padding">
          
            <h4 class="md-display">Multi-State by Topic</h4>

            <md-list>
              <md-list-item class="md-3-line" ng-repeat="s in subjects">
                <div class="md-list-item-text">
                  <h3>{{s.Subject}}</h3>
                  <div style="padding-left:50;">
                    <div layout="row" layout-wrap>
                        <div flex="20" ng-repeat="t in allTopics | filter:s.Subject:true | unique: 'State'">
                            <a>{{t.State.StateName}}</a>
                        </div>
                    </div>
                  </div>
                </div>
                <md-divider md-inset ng-if="!$last"></md-divider>
              </md-list-item>
            </md-list>

        </md-content>
      </md-tab>

    </md-tabs>
  </md-content>


    </div>

    <!-- html -->
    <script type="text/ng-template" id="myModalContent.html">
        <md-dialog aria-label="{{StateInfo.StateName}}"> <!-- use flex to control dialog size  flex="50" -->
        <form ng-cloak>
        <md-toolbar>
            <div class="md-toolbar-tools" >
                <h2 style="color:white !important">{{StateInfo.StateName}}</h2>
            </div>
        </md-toolbar>

        <md-dialog-content>
            <div class="md-dialog-content" style="text-align:left">
                <md-content>
                    <md-list>
                        <md-list-item class="md-3-line" ng-repeat="stateTopic in stateTopics">
                        <div class="md-list-item-text" ng-if="stateTopic.TopicId!='' && !stateTopic.isEdit">
                            <div layout="row" layout-wrap  layout-align="end center">
                              <div>
                                <button type="button" class="btn btn-link btn-sm" ng-click="EditTopic(stateTopic)">
                                  <span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit
                                </button>
                              </div>
                              <div>
                                <button type="button" class="btn btn-link btn-sm" ng-click="DeleteTopic(stateTopic)">
                                  <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                </button>
                              </div>
                            </div>
                            <h1>{{stateTopic.Subject}}</h1>
                            <p ng-bind-html="stateTopic.Content"></p>
                        </div>
                        <md-divider ng-if="!$last"></md-divider>

                        <div class="md-list-item-text" ng-if="stateTopic.TopicId=='' || stateTopic.isEdit">
                            <md-input-container md-no-float class="md-block">
                              <input ng-model="stateTopic.Subject" placeholder="Topic" md-autofocus>
                            </md-input-container>
                            <summernote ng-model="stateTopic.Content"><span style="font-weight: bold;"></span></summernote>
                            
                            <div layout="row" layout-wrap  layout-align="end center">
                                <div>
                                    <button type="button" class="btn btn-default btn-sm" ng-click="SaveChange(stateTopic)">
                                      <span class="glyphicon glyphicon-floppy-save" aria-hidden="true"></span> Save
                                    </button>
                                </div>
                                <div>
                                    <button type="button" class="btn btn-default btn-sm" ng-click="CancelChange(stateTopic)">
                                      Cancel
                                    </button>
                                </div>       
                            </div>
                        </div>
                        </md-list-item>
                        <div ng-if="stateTopics.length == 0">
                            {{StateInfo.StateName}} has enacted no statute specifically regulating distributor relationships for marine engines.
                        </div>
                    </md-list>
                </md-content>
            </div>
        </md-dialog-content>
        
        <md-dialog-actions layout="row">
            <md-button ng-click="print()">
            Print Document
            </md-button>
            <md-button ng-click="AddNewTopic('topic')">
            Add Topic
            </md-button>
            <md-button ng-click="cancel()">
            close
            </md-button>
        </md-dialog-actions>
        </form>
    </md-dialog>

                   
    </script>
    <!-- html end -->

</asp:Content>
