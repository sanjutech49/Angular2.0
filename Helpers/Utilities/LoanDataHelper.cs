using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    internal class LoanDataHelper
    {
        /// <summary>
        /// Builds the lock expiration description text indicating when the lock expires or expired.
        /// </summary>
        /// <param name="lockExpirationNumber"></param>
        /// <returns></returns>
        public string BuildLockExpirationText( int? lockExpirationNumber )
        {
            if ( lockExpirationNumber == null )
                return string.Empty;

            int absLockExpirationNumber = Math.Abs( ( int )lockExpirationNumber );

            var sb = new StringBuilder();

            sb.Append( "Expire" );

            if ( lockExpirationNumber >= 0 )
            {
                sb.Append( "s " );
                if ( lockExpirationNumber == 0 )
                    sb.Append( "Today" );
                else
                    sb.Append( string.Format( "in {0} Day", absLockExpirationNumber ) );

                if ( absLockExpirationNumber > 1 )
                    sb.Append( "s" );
            }
            else
            {
                sb.Append( "d " );
                sb.Append( string.Format( "{0} Day", absLockExpirationNumber ) );

                if ( absLockExpirationNumber > 1 )
                    sb.Append( "s" );

                sb.Append( " Ago" );
            }

            return sb.ToString();

        }

        /// <summary>
        /// Calculates the total number of days against the lock expiration date.
        /// </summary>
        /// <param name="lockExpireDate"></param>
        /// <returns></returns>
        public int? CalculateLockExpirationNumber( DateTime lockExpireDate )
        {
            int? retVal = null;

            if ( lockExpireDate != DateTime.MinValue )
                retVal = ( int )( lockExpireDate - DateTime.Now ).TotalDays;

            return retVal;
        }
    }
}