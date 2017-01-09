<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="print.aspx.cs" Inherits="azHonda.print" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div ng-controller="SummaryCtrl">

        <div ng-include="'views/statenote.html'"></div>

        <topiclist info="Info"></topiclist>

    </div>

</asp:Content>
