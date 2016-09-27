
using System.Web.Mvc;
using System.Web.Routing;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class ElementConditionalDisableHelper
    {
        public static RouteValueDictionary ConditionalDisable( bool disabled, object htmlAttributes = null, string type = "readonly" )
        {
            var dictionary = HtmlHelper.AnonymousObjectToHtmlAttributes( htmlAttributes );

            if ( disabled )
                dictionary.Add( type, type );

            return dictionary;
        }
    }
}