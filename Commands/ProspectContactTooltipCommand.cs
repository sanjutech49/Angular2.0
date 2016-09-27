using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class ProspectContactTooltipCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;

        public string ViewName
        {
            get { return _viewName; }
        }

        public dynamic ViewData
        {
            get { return _viewModel; }
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
            UserAccount user = null;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = (UserAccount)_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            /* parameter processing */
            Int32 contactId = 0;
            if (!InputParameters.ContainsKey("ContactId"))
                throw new ArgumentException("ContactId was expected!");
            else
                contactId = Convert.ToInt32(InputParameters["ContactId"]);

            Guid loanId = Guid.Empty;
            if ( InputParameters.ContainsKey( "LoanId" ) )
                Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId );

            WorkQueueItemDetails result = LoanServiceFacade.RetrieveWorkQueueItemDetails( loanId, contactId, -1 );

            if ( result == null )
            {
                result = new WorkQueueItemDetails();
            }
            else
            {
                PhoneNumberType borrowerPreferredPhoneType;
                if ( !Enum.TryParse( result.BorrowerPreferredPhoneType, out borrowerPreferredPhoneType ) )
                    borrowerPreferredPhoneType = PhoneNumberType.Home;

                PhoneNumberType borrowerAlternatePhoneType;
                if ( !Enum.TryParse( result.BorrowerAlternatePhoneType, out borrowerAlternatePhoneType ) )
                    borrowerAlternatePhoneType = PhoneNumberType.Home;

                PhoneNumberType coBorrowerPreferredPhoneType;
                if ( !Enum.TryParse( result.CoBorrowerPreferredPhoneType, out coBorrowerPreferredPhoneType ) )
                    coBorrowerPreferredPhoneType = PhoneNumberType.Home;

                PhoneNumberType coBorrowerAlternatePhoneType;
                if ( !Enum.TryParse( result.CoBorrowerAlternatePhoneType, out coBorrowerAlternatePhoneType ) )
                    coBorrowerAlternatePhoneType = PhoneNumberType.Home;

                result.BorrowerPreferredPhoneType = borrowerPreferredPhoneType.ToString();
                result.BorrowerAlternatePhoneType = borrowerAlternatePhoneType.ToString();
                result.CoBorrowerPreferredPhoneType = coBorrowerPreferredPhoneType.ToString();
                result.CoBorrowerAlternatePhoneType = coBorrowerAlternatePhoneType.ToString();
            }

            if (result != null)
            {
                _viewName = "_contacttooltiponcontact";
                _viewModel = result;
            }
            else
            {
                _viewName = string.Empty;
                _viewModel = null;
            }
        }
    }
}