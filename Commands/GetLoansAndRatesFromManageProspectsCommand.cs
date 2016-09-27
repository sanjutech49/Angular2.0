using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using MML.Common;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.SharedMethods;
using MML.Web.LoanCenter.Models;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class GetLoansAndRatesFromManageProspectsCommand : ICommand
    {
        // GET: /GetStartedLoadCommand/

        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;

        public string ViewName
        {
            get
            {
                return _viewName;
            }
        }

        public dynamic ViewData
        {
            get
            {
                return _viewModel;
            }
        }

        public Dictionary<string, object> InputParameters
        {
            get
            {
                return _inputParameters;
            }
            set
            {
                _inputParameters = value;
            }
        }

        public HttpContextBase HttpContext
        {
            get { return _httpContext; }
            set { _httpContext = value; }
        }

        public void Execute()
        {
            Guid loanId = Guid.Empty;
            if ( InputParameters.ContainsKey( "loanId" ) )
                Guid.TryParse( InputParameters[ "loanId" ].ToString().TrimEnd(), out loanId );

            int userAccountId = 0;
            if ( InputParameters.ContainsKey( "userAccountId" ) )
                Int32.TryParse( InputParameters[ "userAccountId" ].ToString().TrimEnd(), out userAccountId );

            int contactId = 0;
            if ( InputParameters.ContainsKey( "contactId" ) )
                Int32.TryParse( InputParameters[ "contactId" ].ToString().TrimEnd(), out contactId );

            _viewName = "_getStarted";
            _viewModel = StartNewProspectFromManageProspects( loanId, userAccountId, contactId );
        }

        private GetStarted StartNewProspectFromManageProspects( Guid loanId, int userAccountId, int contactId )
        {
            UserAccount concierge = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null )
                concierge = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ]; 
            
            if ( userAccountId <= 0 )
            {
                userAccountId = LoanServiceFacade.RetrieveUserAccountIdByLoanId( loanId, userAccountId );
                LoanServiceFacade.ViewInBorrower( concierge.UserAccountId, loanId, userAccountId );
            }

            UserAccount user = UserAccountServiceFacade.GetUserById( userAccountId );

            if ( user == null )
            {
                return null;
            }

            Guid token = MML.Common.Impersonation.ImpersonationToken.GetToken();
            bool isInserted = ImpersonationTokenServiceFacade.InsertImpersonationToken( token, loanId, userAccountId );

            if ( !isInserted )
            {
                return null;
            }

            GetStartedHelper getStartedHelper = new GetStartedHelper();

            return getStartedHelper.GetStarted( HttpContext, concierge, token, user.Username, true, contactId, loanId, openInterviewPage: 1 );
        }
    }
}