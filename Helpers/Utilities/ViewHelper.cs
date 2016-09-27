using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public  static class ViewHelper
    {

        public static bool ViewExists(this HtmlHelper html, string name )
        {
            var controllerContext = html.ViewContext.Controller.ControllerContext;
            if (!String.IsNullOrEmpty(name))
            {
                ViewEngineResult result = ViewEngines.Engines.FindView(controllerContext, name, null);
                return (result.View != null);
            }

            return false;

        }
    
    }
}