using azHonda.objects;
using azHonda.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;

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
        public void ListAllTopics()
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.ListAllTopics());
                Context.Response.Write(result);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void GetTopics_by_State(string stateCode, string categoryId)
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.GetTopics_by_State(stateCode, categoryId));
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
            int updatedTopicId = 0;
            TopicVO Topic = null;
            try
            {
                Topic = new JavaScriptSerializer().Deserialize<TopicVO>(TopicObj);
                
                updatedTopicId = SrvTools.Add_Update_Topic(Topic);
            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }
            return Topic.TopicId.ToString();
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
    }
}
