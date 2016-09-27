using Microsoft.AspNet.SignalR;
using MML.Common;
using MML.Web.LoanCenter.SignalR.Hubs;
using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Security.Authentication;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Xml.Linq;

namespace MML.Web.LoanCenter.Controllers
{
    public class IntegrationsController : Controller
    {
        /// <summary>
        /// Method used to receive POST from GFE integration and to
        /// PUSH data to UI
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public void ReceiveGFE()
        {
            try
            {
                string showSmartGfeRefreshButton = ConfigurationManager.AppSettings.Get("SmartGFE.ShowRefreshButton");
                if (!string.IsNullOrWhiteSpace(showSmartGfeRefreshButton) && StringComparer.CurrentCultureIgnoreCase.Equals(showSmartGfeRefreshButton, "true")) { return; }

                //Get XDocument From Stream
                XDocument xDoc = GetXDocumentFromStream();

                if (xDoc != null)
                {
                    TraceHelper.Information(TraceCategory.IntegrationLog, "Provided Request from SmartGFE ", new string[] { xDoc.ToString() });
                }
                else
                {
                    MissingKeyValueLog("Missing SmartGFE XML documment");
                }

                //Get RequestEnvironment and RequestedLoanId
                string requestedLoanId = GetValueFromXDocCriteria(xDoc, "LoanNumber");
                string requestedEnvironment = GetValueFromXDocCriteria(xDoc, "CreatedBy");

                if (!string.IsNullOrWhiteSpace(requestedEnvironment) && !string.IsNullOrWhiteSpace(requestedLoanId))
                {
                    TraceHelper.Information(TraceCategory.IntegrationLog, "SmartGFE Provided Parameters", new string[] { "LoanNumber: " + requestedLoanId, "CreatedBy: " + requestedEnvironment });

                    if (!StringComparer.CurrentCultureIgnoreCase.Equals(requestedEnvironment, "DEV"))
                    {
                        //Get Current Environment From Config File
                        string currentEnvironment = GetConfigValue("SmartGFE.CurrentEnvironment");
                        if (!string.IsNullOrWhiteSpace(currentEnvironment))
                        {
                            if (StringComparer.CurrentCultureIgnoreCase.Equals(currentEnvironment, requestedEnvironment))
                            {
                                //Check whch credentials we are receving before
                                //activating Basic authentification
                                if (IsAuthentificated())
                                {
                                    //PUSH data through Hub to UI
                                    var gfeHub = GlobalHost.ConnectionManager.GetHubContext<LoanActivityHub>();
                                    gfeHub.Clients.All.updateCosts(requestedLoanId);
                                }
                            }
                            else
                            {
                                //Rediredt to correct environment
                                string correctEnvironment = GetConfigValue(string.Format("SmartGFE.Forwarding.{0}", requestedEnvironment));

                                if (!string.IsNullOrWhiteSpace(correctEnvironment))
                                {
                                    TraceHelper.Information(TraceCategory.IntegrationLog, "Redirect to ", new string[] { correctEnvironment });
                                    PostReqest(xDoc, correctEnvironment);
                                }
                                else
                                {
                                    MissingKeyValueLog(string.Format("SmartGFE.Forwarding.{0} config value is missing", requestedEnvironment));
                                }
                            }
                        }
                        else
                        {
                            MissingKeyValueLog("SmartGFE.CurrentEnvironment config value is missing");
                        }
                    }
                    else 
                    {
                        TraceHelper.Information(TraceCategory.IntegrationLog, string.Format("ReceiveGFECostUpdate DEV Request received. LoanId {0}", requestedLoanId));
                    }
                }
                else
                {
                    MissingKeyValueLog("Environment or LoanId have not been provided", xDoc.ToString());
                }
            }
            catch (Exception ex)
            {
                TraceHelper.Error(TraceCategory.IntegrationLog, "ReceiveGFECostUpdate failed", ex);
            }
        }

        #region Private Methods

        /// <summary>
        /// Post Request
        /// </summary>
        /// <param name="xDoc"></param>
        /// <param name="environment"></param>
        private void PostReqest(XDocument xDoc, string environment)
        {
            WebRequest request = (HttpWebRequest)WebRequest.Create(environment);
            ReSetBasicAuthHeader(request);
            
            if (xDoc != null)
            {
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                byte[] data = Encoding.ASCII.GetBytes(xDoc.ToString());
                request.ContentLength = data.Length;
                using (var stream = request.GetRequestStream())
                {
                    stream.Write(data, 0, data.Length);
                }
            }

            //Use Task for POST so we don't wait for the response but in case of failre,create log
            Task.Factory.StartNew(() => { request.GetResponse(); }).ContinueWith(t =>
            {
                if (t.IsFaulted)
                {
                    TraceHelper.Error(TraceCategory.IntegrationLog, "ReceiveGFECostUpdate redirect failed", t.Exception.InnerException);
                }
            });
        }

        /// <summary>
        /// Set Basic authentification
        /// </summary>
        /// <param name="request"></param>
        private void ReSetBasicAuthHeader(WebRequest request)
        {
           //Get UserName and Pass from Original Request
            string usernamePassword = GetUserNameAndPass();
            if (!string.IsNullOrWhiteSpace(usernamePassword))
            {
                request.Headers["Authorization"] = "Basic " + Convert.ToBase64String(Encoding.Default.GetBytes(usernamePassword));
            }
        }

        /// <summary>
        /// Get XDocument from Stream
        /// </summary>
        /// <returns></returns>
        private XDocument GetXDocumentFromStream()
        {
            StreamReader stream = new StreamReader(Request.InputStream);
            XDocument xDoc = XDocument.Load(stream);

            //Set stream to null since we don't need it any more
            stream = null;

            return xDoc;
        }

        /// <summary>
        /// Return Value from Config
        /// If value does not exists, return string.Empty
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        private string GetConfigValue(string key)
        {
            return MML.Common.Configuration.ConfigurationManager.GetAppSettingValue(key) ?? string.Empty;
        }

        /// <summary>
        /// Get Value from XDoc Criteria
        /// </summary>
        /// <param name="xDoc"></param>
        /// <returns></returns>
        private string GetValueFromXDocCriteria(XDocument xDoc, string requiredElementName)
        {
            string returnValue = string.Empty;
            
            if(xDoc != null)
            {
                foreach (XElement element in xDoc.Root.Descendants("Criteria"))
                {
                    if (element.Attribute("Name") != null && !string.IsNullOrWhiteSpace(element.Attribute("Name").Value)
                        && element.Attribute("Name").Value.Equals(requiredElementName) && element.Attribute("Value") != null)
                    {
                        returnValue = element.Attribute("Value").Value;
                        break;
                    }
                }
            }

            return returnValue;
        }

        /// <summary>
        /// Get UserName and Password from Authentification
        /// </summary>
        /// <returns></returns>
        private string GetUserNameAndPass()
        {
            string authHeader = Request.Headers["Authorization"];
            string usernamePassword = string.Empty;
            if (!string.IsNullOrWhiteSpace(authHeader) && authHeader.StartsWith("Basic"))
            {
                string encodedUsernamePassword = authHeader.Substring("Basic ".Length).Trim();
                Encoding encoding = Encoding.GetEncoding("iso-8859-1");
                usernamePassword = encoding.GetString(Convert.FromBase64String(encodedUsernamePassword));
            }
            return usernamePassword;
        }

        /// <summary>
        /// Check if user is Authentificated
        /// </summary>
        /// <returns></returns>
        private bool IsAuthentificated()
        {
            bool authenitificated = false;
            string usernamePassword = GetUserNameAndPass();
            if (!string.IsNullOrEmpty(usernamePassword) && usernamePassword.Contains(":"))
            {
                int seperatorIndex = usernamePassword.IndexOf(':');
                string username = usernamePassword.Substring(0, seperatorIndex);
                string password = usernamePassword.Substring(seperatorIndex + 1);
                string configUserName = GetConfigValue("SmartGFE.UserName");
                string configPassword = GetConfigValue("SmartGFE.Password");
                
                if ((!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password)) &&
                    (username == configUserName && password == configPassword))
                {
                    authenitificated = true;
                }
                else
                {
                    AuthenitificationException(string.Format("ReceiveGFECostUpdate received wrong credentials: {0}", usernamePassword));
                    authenitificated = false;
                }
            }
            else
            {
                AuthenitificationException(string.Format("ReceiveGFECostUpdate did not received Basic Authorization"));
                authenitificated = false;
            }

            return authenitificated;
        }

        /// <summary>
        /// Create Log for Missing Member
        /// </summary>
        /// <param name="exceptionParameter"></param>
        /// <param name="traceMessage"></param>
        private void MissingKeyValueLog(string traceMessage, string exceptionParameter = "")
        {
            MissingMemberException ex = new MissingMemberException("IntegrationsController.ReceiveGFE", exceptionParameter);
            TraceHelper.Error(TraceCategory.IntegrationLog, traceMessage, ex);
        }

        /// <summary>
        /// Create Authentification Exception
        /// </summary>
        /// <param name="message"></param>
        private void AuthenitificationException(string message)
        {
            AuthenticationException authExc = new AuthenticationException(message);
            TraceHelper.Error(TraceCategory.IntegrationLog, message, authExc);
        }

        #endregion
    }
}