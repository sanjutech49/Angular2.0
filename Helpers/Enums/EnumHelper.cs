using System;
using System.Reflection;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers
{
    public static class LoanCenterEnumHelper
    {
        public static String ContactStatusToString( ContactStatus status )
        {
            FieldInfo fieldInfo = typeof( ContactStatus ).GetField( status.ToString() );

            String toReturn = String.Empty;

            foreach ( System.Attribute attribute in fieldInfo.GetCustomAttributes( true ) )
            {
                if ( attribute is StringValueAttribute )
                {
                    toReturn = ( String )attribute.GetMemberValue( "StringValue" );
                }
            }

            return toReturn;
        }
    }
}