using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Configuration;
using System.Web.SessionState;
using System.Xml;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
// @todo -resolve dependency
// using MvcMiniProfiler;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.ServiceModel;
using MML.Web.LoanCenter.Helpers.Utilities;
using System.Web.Optimization;
using WebGrease;
using MML.Web.LoanCenter.Helpers.ModelBinders;
using MML.Web.LoanCenter.App_Start;
using System.Web.Http;

using System.Net.Http;
using System.Security;

namespace MML.Web.LoanCenter
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        private static bool _serviceBrokerInitialized = false;

        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapHttpRoute(
                name: "Auth",
                routeTemplate: "api/auth/verify",
                defaults: new { controller = "Auth" }); 

            routes.MapHttpRoute(
            name: "ProxyHandler",
            routeTemplate: "api/{*path}",
            handler: HttpClientFactory.CreatePipeline
            (
                innerHandler: new HttpClientHandler(),
                handlers: new DelegatingHandler[] { new MML.Web.LoanCenter.Handlers.ProxyHandler() }
            ),
            defaults: new { path = RouteParameter.Optional },
            constraints: null);

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

            if (_serviceBrokerInitialized == false)
            {
                XmlNode serviceConfiguration = ConfigurationManager.GetSection("ServiceConfiguration") as XmlNode;
                ServiceBroker.RegisterClients(serviceConfiguration);
                _serviceBrokerInitialized = true;
            }
        }

        //// @todo -resolve dependency

        //protected void Application_BeginRequest() { if (Request.IsLocal) { MiniProfiler.Start(); } }
        //// @todo -resolve dependency

        //protected void Application_EndRequest() { MiniProfiler.Stop(); }

        protected void Application_Start()
        {
            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
            MvcHandler.DisableMvcResponseHeader = true;
            BundleTable.Bundles.ResetAll();

            AreaRegistration.RegisterAllAreas();

            ModelBinders.Binders.Add(typeof(decimal), new DecimalModelBinder());
            ModelBinders.Binders.Add(typeof(decimal?), new DecimalModelBinder());
        }

        protected void Application_PreRequestHandlerExecute(object sender, EventArgs e)
        {
            try
            {
                if (Context.Handler is IRequiresSessionState)
                {
                    if (Session[SessionHelper.BrandName] == null || Session[SessionHelper.StyleSheetTheme] == null ||
                         Session[SessionHelper.BrandNameShort] == null || Session[SessionHelper.BrandNameDomain] == null ||
                         Session[SessionHelper.BrandPhone] == null || Session[SessionHelper.CompanyCopyrightName] == null ||
                         Session[SessionHelper.CompanyProfileId] == null)
                    {
                        BrandingConfiguration brandingConfiguration = CompanyProfileServiceFacade.RetrieveBrandingConfiguration(StringHelper.FixUrl(Context.Request.Url.Host));

                        if (brandingConfiguration != null)
                        {
                            Session[SessionHelper.BrandName] = brandingConfiguration.DisplayName;
                            Session[SessionHelper.StyleSheetTheme] = brandingConfiguration.Theme;
                            Session[SessionHelper.BrandNameShort] = brandingConfiguration.NameShort;
                            Session[SessionHelper.BrandNameDomain] = brandingConfiguration.Url;
                            Session[SessionHelper.BrandPhone] = brandingConfiguration.Phone;
                            Session[SessionHelper.CompanyCopyrightName] = brandingConfiguration.CopyrightName;
                            Session[SessionHelper.CompanyProfileId] = brandingConfiguration.CompanyProfileId;
                            Session[SessionHelper.BrandingConfiguration] = brandingConfiguration;
                            Session[SessionHelper.BrandNameCssFile] = brandingConfiguration.BrandNameCssFile;
                            Session[SessionHelper.BrandingConfiguration] = brandingConfiguration;
                        }
                    }
                }

                // CDNHelper.SetCdnSettingInSession();
              BundleConfig.RegisterBundles(BundleTable.Bundles);
            }
            catch (Exception ex)
            {
                TraceHelper.Error(TraceCategory.Global, "Error occurred in Global.asax.cs  - Application_PreRequestHandlerExecute()!", ex, Guid.Empty, -1);
            }
        }

    }
}
