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
    // [System.Web.Script.Services.ScriptService]
    public class wsSrvTools : System.Web.Services.WebService
    {

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public void GetAllStates()
        {
            try
            {
                string result = new JavaScriptSerializer().Serialize(SrvTools.GetAllStates());

                Context.Response.Write(result);

            }
            catch (Exception ex)
            {
                Context.Response.Write(ex.Message);
            }

        }
    }
}
