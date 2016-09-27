using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
[assembly: OwinStartup(typeof(MML.Web.LoanCenter.SignalR.Startup))]

namespace MML.Web.LoanCenter.SignalR
{
    //SignalR startup page
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
			/// task 44460 - SignalR Scale Out - Create a switch in config file to use or not use Azure Service Bus
			/// zhaoping, 01/26/2016
			string useServiceBus = MML.Common.Configuration.ConfigurationManager.GetAppSettingValue("UseAzureServiceBus") ?? string.Empty;
			if (useServiceBus=="true")
			{
				string key = "Azure.SignalRServiveBusKey";
				string connectionString = MML.Common.Configuration.ConfigurationManager.GetAppSettingValue(key) ?? string.Empty;
				if (string.IsNullOrEmpty(connectionString))
				{
					throw new Exception(string.Format("The Azure service end point key is missing in the web.config file: key:{0}", key));
				}
				string TopicPrefix = MML.Common.Configuration.ConfigurationManager.GetAppSettingValue("Azure.EventingTopicPrefix") ?? string.Empty;
				GlobalHost.DependencyResolver.UseServiceBus(connectionString, TopicPrefix);  
			}
            
            app.MapSignalR();
        }
    }
}