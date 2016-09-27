using System;
using System.Collections.Generic;
using System.Web;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class ProspectStatusChangeCommand : ICommand
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

            ContactStatus newProspectStatus;
            if (!InputParameters.ContainsKey("NewProspectStatus"))
                throw new ArgumentException("NewProspectStatus was expected!");
            else
                newProspectStatus = (ContactStatus)Enum.Parse(typeof(ContactStatus), InputParameters["NewProspectStatus"].ToString());

            /* Command processing */
            var result = ContactServiceFacade.UpdateContactStatus(contactId, (Int32)newProspectStatus, user.UserAccountId);

            if (result == true)
            {
                _viewName = string.Empty;
                _viewModel = null;
            }
            else
            {
                // return Error View?
                throw new ApplicationException("Prospect status was not updated");
            }
        }
    }
}