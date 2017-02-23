using azHonda.objects;
using azHonda.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using System.Threading.Tasks;

namespace azHonda.wsSrvTools
{
    /// <summary>
    /// Summary description for wsSrvTools
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class wsSrvTools : System.Web.Services.WebService
    {
        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void ListAllStates()
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.ListAllStates());
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void ListAllSubjects()
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.ListAllSubjects());
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void ListAllCategories()
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.ListAllCategories());
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void ListAllTopics(string categoryId, string topicType)
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.ListAllTopics(Convert.ToInt32(categoryId), topicType));
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void GetTopics_by_State(string stateCode, string categoryId, string topicType)
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.GetTopics_by_State(stateCode, categoryId, topicType));
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void GetNote_by_State(string stateCode, string categoryId, string noteType)
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.GetNote_by_State(Convert.ToInt16(categoryId), stateCode, noteType));
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void GetTopics_by_Subject(string subject, string categoryId)
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.GetTopics_by_Subject(subject, categoryId));
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string AddUpdateTopic(string TopicObj)
        {
            int updatedTopicId = -1;
            try
            {
                TopicVO Topic = new JavaScriptSerializer().Deserialize<TopicVO>(TopicObj);
                updatedTopicId = SrvTools.Add_Update_Topic(Topic);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
            return new JavaScriptSerializer().Serialize(updatedTopicId);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string AddUpdateNote(string NoteObj)
        {
            int updatedNoteId = -1;
            try
            {
                NoteVO Note = new JavaScriptSerializer().Deserialize<NoteVO>(NoteObj);
                updatedNoteId = SrvTools.Add_Update_Note(Note);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
            return new JavaScriptSerializer().Serialize(updatedNoteId);
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void DeleteTopic_by_TopicId(string topicId)
        {
            try
            {
                if (!string.IsNullOrEmpty(topicId))
                {
                    SrvTools.DeleteTopic_by_TopicId(Convert.ToInt32(topicId));
                }
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void DeleteNote_by_NoteId(string noteId)
        {
            try
            {
                if (!string.IsNullOrEmpty(noteId))
                {
                    SrvTools.DeleteNote_by_NoteId(Convert.ToInt32(noteId));
                }
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void GetTopic_by_TopicId(string topicId)
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.GetTopic_by_TopicId(Convert.ToInt32(topicId)));
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void GetStates_by_Subject(string subject)
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.GetStates_by_Subject(subject));
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        //Test
        /// <summary>
        /// application/json raw
        /// </summary>
        /// <param name="obj">{"obj":'[{"StateCode":"VT","StateName":"Vermont"}, {"StateCode":"CA","StateName":"California"}]'}</param>
        /// <returns></returns>
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [WebMethod]
        public string PushJson(string obj)
        {
            List<StateVO> st = new JavaScriptSerializer().Deserialize<List<StateVO>>(obj);
            return obj.ToString();
        }

        //Auth
        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void ListAuthUsers()
        {
            try
            {
                SrvAuthManagementAPI api = new SrvAuthManagementAPI();
                string result = api.ListAuthUsers();
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }
        
        //Auth
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void CreateAuthUser(string userInfo)
        {
            try
            {
                UserVO user = new JavaScriptSerializer().Deserialize<UserVO>(userInfo);
                SrvAuthManagementAPI api = new SrvAuthManagementAPI();
                string result = api.CreateAuthUser(user.Email, user.Password);
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public string TestAsync(string subject)
        {
            try
            {

                SrvAuthManagementAPI api = new SrvAuthManagementAPI();
                string result = api.ListAuthUsers();
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
            return "Hello";
        }
    }
}
