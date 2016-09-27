using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MML.Web.LoanCenter.Helpers.MvcHelpers
{
    public static class CustomHtmlHelper
    {
        public static Fieldset BeginFieldset( this HtmlHelper self, string legend, object fieldsetAttributes = null, object legendAttributes = null )
        {
            return new Fieldset( self, legend, fieldsetAttributes, legendAttributes );
        }

    }
}