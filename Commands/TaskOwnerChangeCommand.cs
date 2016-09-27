using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class TaskOwnerChangeCommand : ICommand
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
            Int32 taskId = 0;
            if (!InputParameters.ContainsKey("TaskId"))
                throw new ArgumentException("TaskId was expected!");
            else
                taskId = Convert.ToInt32(InputParameters["TaskId"]);

            Int32 newOwnerAccountId;
            if (!InputParameters.ContainsKey("NewOwnerAccountId"))
                throw new ArgumentException("NewOwnerAccountId was expected!");
            else
                newOwnerAccountId = Convert.ToInt32(InputParameters["NewOwnerAccountId"]);

            /* Command processing */
            var result = TaskServiceFacade.UpdateTaskOwner(taskId, newOwnerAccountId,user.UserAccountId);

            if (result == true)
            {
                _viewName = string.Empty;
                _viewModel = null;
            }
            else
            {
                // return Error View?
                throw new ApplicationException("Task owner was not updated");
            }
        }
    }
}