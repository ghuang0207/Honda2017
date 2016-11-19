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
                        {{s.State}}
                    </md-button> 
                </div>
            </div>

        </md-content>
      </md-tab>

      <md-tab label="Multi-State by Topic">
        <md-content class="md-padding">
          
        <h4 class="md-display">Multi-State by Topic</h4>

            <ul>
                <li ng-repeat="t in topics"><div>{{t.name}}</div>
                    <div layout="row" layout-wrap>
                        <div flex="20" ng-repeat="s in t.states">
                            <a>{{s.name}}</a>
                        </div>
                    </div>
                </li>
            </ul>

        </md-content>
      </md-tab>

    </md-tabs>
  </md-content>


    </div>

    <!-- html -->
    <script type="text/ng-template" id="myModalContent.html">
        <md-dialog aria-label="{{stateInfo.State}}" flex="50"> <!-- use flex to control dialog size -->
        <form ng-cloak>
        <md-toolbar>
            <div class="md-toolbar-tools" >
                <h2 style="color:white !important">{{stateInfo.State}}</h2>
            </div>
        </md-toolbar>

        <md-dialog-content>
            <div class="md-dialog-content" style="text-align:center">
                <md-content>
                    <md-list>
                        <md-list-item class="md-3-line" ng-repeat="stateTopic in stateTopics">
                        <div class="md-list-item-text">
                            <h3>{{stateTopic.Subject}}</h3>
                            <p ng-bind-html="stateTopic.Content"></p>
                        </div>
                        <%--<md-button class="md-secondary">Edit</md-button>--%>
                        <md-divider ng-if="!$last"></md-divider>
                        </md-list-item>
                    </md-list>
                </md-content>
            </div>
        </md-dialog-content>
        
        <md-dialog-actions layout="row">
            <md-button ng-click="print()">
            Print Document
            </md-button>
            <md-button ng-click="answer('topic')">
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
