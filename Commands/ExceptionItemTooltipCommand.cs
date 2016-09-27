using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class ExceptionItemTooltipCommand : ICommand
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
            Guid loanId = Guid.Empty;
            if (!InputParameters.ContainsKey("LoanId"))
                throw new ArgumentException("LoanId was expected!");
            else
                loanId = Guid.Parse( InputParameters[ "LoanId" ].ToString() );

            /* Command processing */
            var result = ExceptionItemServiceFacade.GetExceptionItems(loanId, -1);

            if (result != null)
            {
                _viewName = "_exceptionItemTooltip";
                _viewModel = result.Where( ex => !ex.DateCured.HasValue ).ToList();
            }
            else
            {
                _viewName = string.Empty;
                _viewModel = null;
            }
        }
    }
}