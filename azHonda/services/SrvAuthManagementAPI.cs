using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Auth0.ManagementApi;
using System.Threading.Tasks;
using Auth0.ManagementApi.Models;
using RestSharp;

namespace azHonda.services
{
    public class SrvAuthManagementAPI
    {
        private string token;
        private string domain;

        public SrvAuthManagementAPI()
        {
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ6VU4ydFhVWUE2SFlpcnpnTmdFSlI2SDNoWmVhTWpDQyIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX0sInVzZXJfaWRwX3Rva2VucyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0ODU1MTIxNzQsImp0aSI6IjQ5MTg0YjNjZGE2MTU5MTczNGM1MDM2ZmZhYWE4ZjJiIn0.4bJe_qooYKGRb5oAvN-y9PICSv9s2d8AoYMGX3yU34Q";
            domain = "https://foley.auth0.com/";
        }

        //public async Task testAPIAsync()
        //{
        //    var apiClient = new ManagementApiClient(token, new Uri(String.Format("{0}/api/v2", domain)));
        //    UserCreateRequest request = new UserCreateRequest();
        //    request.Email = "swp08102006@hotmail.com";
        //    request.Password = "test123";
        //    Task.WhenAll(apiClient.Users.CreateAsync(request));
        //    //var allClients = Task.WhenAll(apiClient.Users.GetAllAsync());
        //    //return allClients;
        //}

        public void testRequest()
        {
            var client = new RestClient("http://foley.auth0.com/api/v2/users");
            RestRequest request = new RestRequest(Method.GET);
            //request.AddHeader("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ6VU4ydFhVWUE2SFlpcnpnTmdFSlI2SDNoWmVhTWpDQyIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX0sInVzZXJfaWRwX3Rva2VucyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0ODU1MTIxNzQsImp0aSI6IjQ5MTg0YjNjZGE2MTU5MTczNGM1MDM2ZmZhYWE4ZjJiIn0.4bJe_qooYKGRb5oAvN-y9PICSv9s2d8AoYMGX3yU34Q");
            request.AddParameter("Authorization",
                String.Format("Bearer {0}", token),
            ParameterType.HttpHeader);
            var response = client.Execute(request);
        }
    }
}