using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.ServiceModel.Web;
using MML.Common.Helpers;
using MML.Common;
using System.Web.Script.Services;

namespace MML.Web.LoanCenter.Services
{
    /// <summary>
    /// Summary description for SessionExpiration
    /// </summary>
    [WebService(Namespace = Namespaces.Default)]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    //To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class SessionExpiration : System.Web.Services.WebService
    {
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string GetSessionSynchronizationObject(String lat)
        {
            try
            {
                var sessionLat = String.Empty;
                DateTime dtLat = new DateTime();
                DateTime dtSessionLat = new DateTime();

                if (HttpContext.Current.Session[SessionHelper.SessionLastActivityTime] != null)
                {
                    sessionLat = HttpContext.Current.Session[SessionHelper.SessionLastActivityTime].ToString();
                }
                else
                {
                    throw new Exception("SessionLastActivityTime is null!");
                }

                if (DateTime.TryParse(lat, out dtLat))
                {
                    if (DateTime.TryParse(sessionLat, out dtSessionLat))
                    {
                        if (dtLat > dtSessionLat)
                            HttpContext.Current.Session[SessionHelper.SessionLastActivityTime] = lat;
                    }
                    else
                    {
                        throw new Exception("sessionLat is not a datetime value!");
                    }
                }
                else
                {
                    throw new Exception("dtLat is not a datetime value!");
                }

            }
            catch (Exception ex)
            {
                TraceHelper.Error(TraceCategory.Global, "Web.LoanCenter SessionExpiration service::GetSessionSynchronizationObject error!", ex, Guid.Empty, IdentityManager.GetUserAccountId());
            }

            return HttpContext.Current.Session[SessionHelper.SessionLastActivityTime].ToString();

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Dictionary<string, string> GetSessionTimeoutWarningMessage()
        {

            string message = "Your session is about to expire. Click OK button to continue with your applicaton.";

            if (HttpContext.Current.Session["CompanyResourceFile"] != null)
            {
                message = HttpContext.GetGlobalResourceObject(HttpContext.Current.Session["CompanyResourceFile"].ToString(), "SessionWarningMessage").ToString();
            }

            return new Dictionary<string, string>()
            {
                { "PopupMessageTitle" , "Session Expiration Warning"},
                {"PopupMessageContent", message},
                {"MessageType", "Warning"}
            };
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Dictionary<string, string> GetSessionTimeoutExpiredMessage()
        {
            string message = "Your session has expired.";

            if (HttpContext.Current.Session["CompanyResourceFile"] != null)
            {
                message = HttpContext.GetGlobalResourceObject(HttpContext.Current.Session["CompanyResourceFile"].ToString(), "SessionExpiredMessage").ToString();
            }

            return new Dictionary<string, string>()
            {
                { "PopupMessageTitle" , "Session Expired"},
                {"PopupMessageContent",message},
                {"MessageType", "Expired"}
            };
        }
    }
}
