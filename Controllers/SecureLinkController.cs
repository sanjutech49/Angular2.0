using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Common;
using Newtonsoft.Json.Linq;
using MML.Web.LoanCenter.Models.SecureLink;
using System.Configuration;
using MML.Web.LoanCenterModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ConfigSystem = MML.iMP.Common.Configuration;

namespace MML.Web.LoanCenter.Controllers
{
    public class SecureLinkController : Controller
    {
        
        /// <summary>
        /// This is the default route called when you access this url with GET: /SecureLink.  e.g. https://qa01loancenter.newleaflending.com/SecureLink
        /// 
        /// SecureLink is meant to be a standalone web application built on angular for handling borrower signing.  It 
        /// </summary>
        /// <param name="token">A JWT token that has encoded a SecureLinkAuthenticationViewModel object that has propeties like LoanId and borrower information.</param>
        /// <returns>HTML for the secure link webpage.</returns>
        public ActionResult Index(string token)
        {
            var model = new AuthenticationViewModel();

            bool isSecureLinkTestMode = false;
            bool.TryParse(ConfigurationManager.AppSettings["IsSecureLinkTestMode"], out isSecureLinkTestMode);
            //This block is for testing with a test token
            if (isSecureLinkTestMode == true && string.IsNullOrEmpty(token))
            {
                token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7IkxvYW5JZCI6ImIzNzcxYTM2LTExOTMtNGVjNC1iNGM4LTUyMjM2MjA4NDFhOSIsIkxvYW5BcHBsaWNhdGlvbklkIjoiYjM3NzFhMzYtMTE5My00ZWM0LWI0YzgtNTIyMzYyMDg0MWE5IiwiSXNDb250aW51ZVdpdGhvdXRMb2dpbiI6ZmFsc2UsIklzQm9ycm93ZXJDb250aW51ZVdpdGhvdXQiOmZhbHNlLCJCb3Jyb3dlciI6eyJCb3Jyb3dlcklkIjoiZGUzMTYyOTgtODcxYS00MDAwLTg5NzEtNTVjYmFlMTg4OTJhIiwiRnVsbE5hbWUiOiJLZXJyeSBCYXllcyIsIlVzZXJBY2NvdW50SWQiOjkxNTQ2LCJJbnB1dFBJTiI6bnVsbCwiSXNBdXRoZW50aWNhdGVkIjpudWxsfSwiQ29Cb3Jyb3dlciI6eyJCb3Jyb3dlcklkIjoiZDZmNGUyMzYtNmFmNy00ZDRkLThjZjAtM2M4YmY1YTA2OTkzIiwiRnVsbE5hbWUiOiJQQVRSSUNJQSBBREFNUyIsIlVzZXJBY2NvdW50SWQiOjkzMTU3LCJJbnB1dFBJTiI6bnVsbCwiSXNBdXRoZW50aWNhdGVkIjpudWxsfSwiVG9rZW4iOm51bGx9fQ.Xb3hMDv5fkO9_rQV1chvyNWGhSgQsuv4y69Qn0Fiqgw";
            }

            //Check for a valid token and render it to the page
            model.isSecureLinkTestMode = isSecureLinkTestMode;
            model.isTokenValid = false;
            model.authenticationViewModel = new JObject();

            if (!string.IsNullOrEmpty(token))
            {
                string secretKey = ConfigSystem.Client.Instance.GetConfigurationValue("SecureLink.JWTPassword", "Environment", new string[] { });
                //double expirationHours = double.Parse(ConfigSystem.Client.Instance.GetConfigurationValue("SecureLink.JWTExpirationHours", "Environment", new string[] { }));
                IDictionary<string, object> payload;
                if (JWTTokenHelper.DecodeToken(token, secretKey, out payload))
                {
                    //Need CamelCasePropertyNamesContractResolver to make JSON with camel case properties.
                    var serializer = new JsonSerializer()
                    {
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    };
                    JObject data = JObject.FromObject(payload["data"], serializer);
                    if (data != null)
                    {
                        model.authenticationViewModel = data;
                        model.isTokenValid = true;
                    }

                    //model.authenticationViewModel = JObject.Parse(values["data"].ToString());
                    //model.isTokenValid = true;
                }
            }

            return View(model);
        }

        /// <summary>
        /// This is the page that docusing should redirect to in the iframe in the esigningroom page.  Once called, this will call up to the parent web page to handle the 
        /// appropriate action.
        /// </summary>
        /// <returns>A simple html webpage that calls to the iframes parent.</returns>
        public ActionResult SigningCompleteHandler()
        {
            var model = new SigningCompleteHandlerViewModel();

            string docusignEvent = Request.QueryString["event"];
            if (!string.IsNullOrEmpty(docusignEvent))
            {
                model.DocusignEvent = docusignEvent;
            }

            return View(model);
        }

    }
}
