using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MML.Web.LoanCenter.SignalR.Hubs
{
    public class LoanActivityHub : Hub
    {
        /// <summary>
        /// Smart GFE Update Method
        /// </summary>
        /// <param name="smartGfeId"></param>
        public void SmartGfeUpdate(string loanId)
        {
            //Update costs
            Clients.All.updateCosts(loanId);
        }
    }
}