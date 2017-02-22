using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Auth0.ManagementApi;
using System.Threading.Tasks;
using RestSharp;
using RestSharp.Authenticators;

namespace azHonda.services
{
    public class SrvAuthManagementAPI
    {
        private string token;
        private string domain;

        public SrvAuthManagementAPI()
        {
            token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1qY3hRVU5HTnprMU1FTkZOemhHTWpnMVJVRTRNRFpCTWtJNU5EVkZORUk0TWpnMVJVUkdRZyJ9.eyJpc3MiOiJodHRwczovL2ZvbGV5LmF1dGgwLmNvbS8iLCJzdWIiOiJkdFJFRlF3NVRUbzV0NU1KOGVYQXVQNDBXRzAwdTFzWEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9mb2xleS5hdXRoMC5jb20vYXBpL3YyLyIsImV4cCI6MTQ4Nzc4Mzg2NywiaWF0IjoxNDg3Njk3NDY3LCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50c190aWNrZXRzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMifQ.xT4jlLNnwu_Sispp82TUp1w8kwQmf0V19FYJufP3fZw2DHEw0YUZ4wc2fC-2ttHV2boG483jFUaiCnYmhaPIGWkZurKjqlTedI47Q_IYJ9t1Osf7s4JTlE5fgTBdxMC31SNhJzbDw1iJ7I5SOzplImrK5R4rKrFYXvwzTyrdKbg7BjYmql2_zpJnlN3YPuqif6m5YEQRHCRK3UCD3eowbRmQtZxuY5hLtszdoqfcBBx1oEUTMCc3UCm5YS6_iXeREw4lMBqcKB36xu_fjqEtMoacKz8XPu8oDK_shmXMhVptdmLjysZiuDRHxJoM_coaA9mU3OUHRMmO4lo289Nong";//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ6VU4ydFhVWUE2SFlpcnpnTmdFSlI2SDNoWmVhTWpDQyIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX0sInVzZXJfaWRwX3Rva2VucyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0ODU1MTIxNzQsImp0aSI6IjQ5MTg0YjNjZGE2MTU5MTczNGM1MDM2ZmZhYWE4ZjJiIn0.4bJe_qooYKGRb5oAvN-y9PICSv9s2d8AoYMGX3yU34Q";
            domain = "https://foley.auth0.com";
        }

        public string ListAuthUsers()
        {
            var client = new RestClient(string.Format("{0}/api/v2/users", domain));
            client.Authenticator = new OAuth2AuthorizationRequestHeaderAuthenticator(
                token, // Update the token
                "Bearer");
            var request = new RestRequest(Method.GET);
            IRestResponse response = client.Execute(request);
            return response.Content;
        }

        public string CreateAuthUser(string email, string password)
        {
            var client = new RestClient(string.Format("{0}/api/v2/users", domain));
            client.Authenticator = new OAuth2AuthorizationRequestHeaderAuthenticator(
                token, // Update the token
                "Bearer");
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-type", "application/json");
            request.AddJsonBody(new {
                email = email,
                password = password,
                connection = "Username-Password-Authentication"
                //,app_metadata = new { isadmin = true}
            }); // AddJsonBody serializes the object automatically
            IRestResponse response = client.Execute(request);
            return response.Content;
        }
        
    }
}