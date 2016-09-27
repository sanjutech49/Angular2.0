using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Models;
using System.Configuration;

namespace MML.Web.LoanCenter.Helpers.SharedMethods
{
    public class GetStartedHelper
    {
        public GetStarted GetStarted( HttpContextBase httpContext, UserAccount user, Guid token, String username, bool isEmbedded, Int32? contactId = null, Guid? loanId = null, int? openInterviewPage = null, bool? isTempUser = false, Guid? parentLoanId = null, string sectionTitle = null )
        {
            StringBuilder sb = new StringBuilder();
            sb.Append( GetChannelBorrowerSiteURL( user.UserAccountId ) );
            sb.Append( "LoanRequest.aspx?impersonateUser=1" );
            if ( openInterviewPage.Equals( 1 ) )
                sb.Append( "&openInterviewPage=1" );
            sb.Append( "&token=" );
            sb.Append( httpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( token.ToString(), EncriptionKeys.Default ) ) );
            sb.Append( "&uname=" ); // username of new created account
            sb.Append( httpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( username, EncriptionKeys.Default ) ) );
            sb.Append( "&cuid=" ); // concierge Id
            sb.Append( httpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( user.UserAccountId.ToString(), EncriptionKeys.Default ) ) );
            sb.Append("&chid=");
            BrandingConfiguration bc = (BrandingConfiguration) httpContext.Session[SessionHelper.BrandingConfiguration];
            sb.Append(bc == null ? 0 : bc.ChannelId);
            if ( contactId != null && contactId != -1 )
            {
                sb.Append( "&contactId=" ); // contact Id of the contact associated with new user account
                sb.Append( httpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( contactId.ToString(), EncriptionKeys.Default ) ) );
            }
            if ( loanId != null && loanId != Guid.Empty )
            {
                sb.Append( "&lid=" );
                sb.Append( httpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( loanId.ToString(), EncriptionKeys.Default ) ) );
            }

            sb.Append( "&isEmbedded=" );
            sb.Append( isEmbedded ? "1" : "0" );

            sb.Append( "&isTempUser=" );
            sb.Append( isTempUser.HasValue && isTempUser.Value ? "1" : "0" );

            sb.Append( "&LoanCenter=1" );

            if ( parentLoanId != null )
                sb.Append( "&plid=" ).Append( httpContext.Server.UrlEncode( EncryptionHelper.EncryptRijndael( parentLoanId.ToString(), EncriptionKeys.Default ) ) );

            return new GetStarted() { BorrowerUrl = sb.ToString(), SectionTitle = !string.IsNullOrEmpty( sectionTitle ) ? sectionTitle : "Start a Prospect/New Loan" };
        }

        public static string GetChannelBorrowerSiteURL( int loId )
        {
            var channel = CompanyProfileServiceFacade.GetChannelByChannelId( -1, loId );

            if ( channel != null && !string.IsNullOrEmpty( channel.BorrowerSiteURL ) )
            {
                return channel.BorrowerSiteURL;
            }
            return ConfigurationManager.AppSettings[ "BorrowerUrl" ];
        }
    }
}
