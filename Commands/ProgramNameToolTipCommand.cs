using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Commands
{
    public class ProgramNameToolTipCommand : ICommand
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
                user = (UserAccount)_httpContext.Session[SessionHelper.UserData];
            else
                user = UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            /* parameter processing */
            Int32 contactId = 0;
            if (InputParameters.ContainsKey("ContactId"))
                int.TryParse(InputParameters["ContactId"].ToString(), out contactId);

            Guid loanId = Guid.Empty;
            if (InputParameters.ContainsKey("LoanId"))
                Guid.TryParse(InputParameters["LoanId"].ToString(), out loanId);
            var tempDetails = LoanServiceFacade.RetrieveWorkQueueItemDetails(loanId, contactId, -1);
            LoanDetailsViewModel loanDetails = new LoanDetailsViewModel();

            string emptyField = "-";

            if (tempDetails == null)
            {
                tempDetails = new WorkQueueItemDetails();
            }
            else
            {
                CommonHelper.RetreiveLoanDetailsFromWorkQueueItemDetails(tempDetails, loanDetails, user, emptyField);
                loanDetails.Adjustments = LoanServiceFacade.RetrieveLoanAdjustment(loanId);
            }

                _viewName = "_programnamedetails";
                _viewModel = loanDetails;
           
        }
    }
}