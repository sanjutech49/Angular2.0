using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MML.Web.LoanCenter.Commands
{
    public class CommandResult
    {
        public string ViewName { get; set; }

        public dynamic ViewData { get; set; }
    }
}