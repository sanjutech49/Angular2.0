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

namespace MML.Web.LoanCenter.Commands
{
    public class GetStartedUnLoadCommand : ICommand
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
            _viewName = "";
        }

    }
}
