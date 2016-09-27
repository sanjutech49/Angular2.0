using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace System.Web.Mvc.Html
{
    public static class MvcExtensions
    {
        public static void RegisterFormContextForValidation( this HtmlHelper helper )
        {
            if ( helper.ViewContext.FormContext == null )
            {
                helper.ViewContext.FormContext = new FormContext();
            }
        }
    }
}