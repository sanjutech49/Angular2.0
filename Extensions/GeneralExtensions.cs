using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

namespace MML.Web.LoanCenter.Extensions
{
    public static class GeneralExtensions
    {
        const String filterCamelCasePart1 = @"(\P{Ll})(\P{Ll}\p{Ll})";
        const String filterCamelCasePart2 = "$1 $2";
        const String filterCamelCasePart3 = @"(\p{Ll})(\P{Ll})";

        /// <summary>
        /// Split camel case strings
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static String SplitCamelCase( this string str )
        {
            if ( !String.IsNullOrEmpty( str ) )
                return Regex.Replace( Regex.Replace( str, filterCamelCasePart1, filterCamelCasePart2 ), filterCamelCasePart3, filterCamelCasePart2 );
            else
                return String.Empty;
        }
    }
}