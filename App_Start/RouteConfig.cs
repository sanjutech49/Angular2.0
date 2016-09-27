
using System.Web.Mvc;
using System.Web.Routing;
using System.Configuration;
 
using System.Xml;
 
using MML.ServiceModel;
 
 

namespace MML.Web.LoanCenter.App_Start
{
    public class RouteConfig
    {
        private static bool _serviceBrokerInitialized = false;

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "OldIndex", id = UrlParameter.Optional } // Parameter defaults
            );
            
            if (_serviceBrokerInitialized == false)
            {
                XmlNode serviceConfiguration = ConfigurationManager.GetSection("ServiceConfiguration") as XmlNode;
                ServiceBroker.RegisterClients(serviceConfiguration);
                _serviceBrokerInitialized = true;
            }
        }
    }
}