using MML.Data.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Routing;
using MML.Web.Common.OAuth.Configuration;
using MML.Common.ExtensionMethods;
using MML.Common;

namespace MML.Web.LoanCenter.Handlers
{
    public class ProxyHandler : DelegatingHandler
    {

        protected override async System.Threading.Tasks.Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            //UriBuilder serviceUri = new UriBuilder(request.RequestUri);

            //serviceUri.Port = OAuthConfigurationSettings.ClientRoutingPort.TryParseInt().GetValueOrDefault(80);
            //string pathIntl = serviceUri.Path;
            //string pathFinl = ReplaceRoutingPath(pathIntl);
            //serviceUri.Path = pathFinl;

            request.RequestUri = GetRoutingUri(request.RequestUri);

            if (request.Method == HttpMethod.Get)
            {
                // @todo-cc: Review ; WebAPI bug?
                request.Content = null;
            }

            // Look for OAuth token , and apply if found
            var oauthTokenCookie = request.Headers.GetCookies("mml-auth-token").FirstOrDefault();
            if (oauthTokenCookie != null)
            {
                var oauthTokenCookieState = oauthTokenCookie["mml-auth-token"];
                if (oauthTokenCookieState != null)
                {
                    var oauthToken = oauthTokenCookieState.Value;
                    if (!oauthToken.IsNullEmptyOrSpaces())
                    {
                        request.Headers.Add("Authorization", "Bearer " + oauthToken);
                    }
                }
            }
 //           try  {
            HttpClient client = new HttpClient();
            client.Timeout = new TimeSpan(0, 15, 0);
            var response = await client.SendAsync(request, HttpCompletionOption.ResponseContentRead, cancellationToken).ContinueWith((task) =>
                {                  
                    var resp = task.Result;

                    string lccHeader = "{0}:{1}".FormatWith((int)resp.StatusCode, request.RequestUri.AbsoluteUri);
                    resp.Headers.Add("X-LCC-Status", lccHeader);

                    resp.Headers.Remove("Transfer-Encoding");
                    resp.Headers.TransferEncodingChunked = false;

                    if (resp.Content != null && resp.Content.Headers != null && resp.Content.Headers.ContentLength > 0)
                    {
                        // Nothing else to do
                    }
                    else
                    {
                        string contentString = resp.Content.ReadAsStringAsync().Result;
                        resp.Content.Headers.ContentLength = contentString.Length;
                    }
                    return task.Result;
                });

            return response;

            //}
            //catch (AggregateException e)
            //{

            //}         
        }


        private static string[] _RoutingPair = null;

        private static string[] RoutingPair
        {
            get
            {
                if (_RoutingPair == null)
                {

                    string pairConf = OAuthConfigurationSettings.ClientRoutingPair;

                    if (pairConf.IsNullEmptyOrSpaces())
                    {
                        throw new Exception("Proxy configuration error. Rounting Pair Missing.");
                    }

                    string[] pairSplit = pairConf.Split('|');
                    if (2 != pairSplit.Length)
                    {
                        throw new Exception("Proxy configuration error. Rounting Pair Invalid.");
                    }

                    _RoutingPair = new string[] { pairSplit[0], pairSplit[1] };
                }

                return _RoutingPair;
            }
        }

        private static Uri GetRoutingUri(Uri extUri)
        {
            string[] routingPair = RoutingPair;

            UriBuilder uriBuilder = new UriBuilder(extUri.AbsoluteUri.Replace(routingPair[0], routingPair[1]));

            return uriBuilder.Uri;
        }

        //private static string ReplaceRoutingPath(string intl)
        //{
        //    if (intl.IsNullEmptyOrSpaces())
        //        return intl;

        //    string[] pair = ReplaceRoutingPair;
        //    string finl = intl.Replace(pair[0], pair[1]);

        //    return finl;
        //}

        //protected override async System.Threading.Tasks.Task<HttpResponseMessage> SendAsync(HttpRequestMessage rqst, System.Threading.CancellationToken cancellationToken)
        //{
        //    UriBuilder serviceUri = new UriBuilder(rqst.RequestUri);

        //    serviceUri.Port = OAuthConfigurationSettings.ClientRoutingPort.TryParseInt().GetValueOrDefault(80);
        //    string pathIntl = serviceUri.Path;
        //    string pathFinl = ReplaceRoutingPath(pathIntl);
        //    serviceUri.Path = pathFinl;

        //    rqst.RequestUri = serviceUri.Uri;
        //    if (rqst.Method == HttpMethod.Get)
        //    {
        //        // @todo-cc: Review ; WebAPI bug?
        //        rqst.Content = null;
        //    }

        //    // Look for OAuth token , and apply if found
        //    var oauthTokenCookie = rqst.Headers.GetCookies("mml-auth-token").FirstOrDefault();
        //    if (oauthTokenCookie != null)
        //    {
        //        var oauthTokenCookieState = oauthTokenCookie["mml-auth-token"];
        //        if (oauthTokenCookieState != null)
        //        {
        //            var oauthToken = oauthTokenCookieState.Value;
        //            if (!oauthToken.IsNullEmptyOrSpaces())
        //            {
        //                rqst.Headers.Add("Authorization", "Bearer " + oauthToken);
        //            }
        //        }
        //    }

        //    HttpClient client = new HttpClient();
        //    client.Timeout = new TimeSpan(0, 15, 0);
        //    HttpResponseMessage resp = await client.SendAsync(rqst, HttpCompletionOption.ResponseContentRead, cancellationToken);

        //    string lccHeader = "{0}:{1}".FormatWith((int)resp.StatusCode, rqst.RequestUri.AbsoluteUri);
        //    resp.Headers.Add("X-LCC-Status", lccHeader);

        //    resp.Headers.Remove("Transfer-Encoding");
        //    resp.Headers.TransferEncodingChunked = false;
        //    System.Web.HttpContext.Current.Response.Headers.Remove("Transfer-Encoding");

        //    if (resp.Content != null && resp.Content.Headers != null && resp.Content.Headers.ContentLength > 0)
        //    {
        //        // Nothing else to do
        //    }
        //    else
        //    {
        //        // Not assigned , try to calculate here , but doesn't always seem to work

        //        //string contentString = await resp.Content.ReadAsStringAsync();
        //        string contentString = resp.Content.ReadAsStringAsync().Result;
        //        resp.Content.Headers.ContentLength = contentString.Length;
        //    }

        //    return resp;
        //}
    }
}