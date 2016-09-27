using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.Specialized;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Helpers.ActionFilters
{
    public class MainControlFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting( ActionExecutingContext filterContext )
        {
            NameValueCollection queryString = filterContext.HttpContext.Request.QueryString;

            string control = queryString[ "Control" ];
            if( control == null )
                control = filterContext.HttpContext.Request.Form[ "Control" ];

            if( !String.IsNullOrWhiteSpace( control ) )
            {
                MainControl mainControl = ( MainControl )Enum.Parse( typeof( MainControl ), control );

                filterContext.ActionParameters[ "control" ] = mainControl;
            }

            base.OnActionExecuting( filterContext );
        }
    }
}