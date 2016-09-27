using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace MML.Web.LoanCenter.Commands
{
    public interface ICommand
    {
        String ViewName { get; }

        dynamic ViewData { get; }

        Dictionary<String, Object> InputParameters
        {
            get;
            set;
        }

        HttpContextBase HttpContext
        {
            get;
            set;
        }

        void Execute();
    }
}
