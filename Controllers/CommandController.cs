using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Web.LoanCenter.Extensions;
using MML.Web.LoanCenter.Commands;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Common;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Controllers
{
    [Authorize()]
    [ValidateAntiForgeryTokenWrapper(HttpVerbs.Post)]
    public class CommandController : AsyncController
    {
        public void ExecuteAsync(string command)
        {
            // The command can contain some long running operation 
            // we run as async by queing the action on a separate thread
            AsyncManager.QueueAction(() =>
            {
                UserAccount user = null;
                if (Session[SessionHelper.UserData] != null && ((UserAccount)Session[SessionHelper.UserData]).Username == User.Identity.Name)
                    user = (UserAccount)Session[ SessionHelper.UserData ];
                else
                    user = UserAccountServiceFacade.GetUserByName(User.Identity.Name);

                if (user == null)
                    throw new InvalidOperationException("User is null");
                else
                    Session[ SessionHelper.UserData ] = user;

                var result = CommandInvoker.InvokeFromCompositeString(command, HttpContext);

                AsyncManager.Parameters["ViewName"] = result.ViewName;
                AsyncManager.Parameters["ViewData"] = result.ViewData;
            });
        }

        public ActionResult ExecuteCompleted()
        {
            if (AsyncManager.Parameters.ContainsKey("AggregateException") && AsyncManager.Parameters["AggregateException"] != null)
            {
                TraceHelper.Error(TraceCategory.LoanCenter, "Loan Center Command Execution Error", AsyncManager.Parameters["AggregateException"] as Exception);
                return RedirectToAction( "InternalServerError", "Error" );
            }

            if ((string)AsyncManager.Parameters["ViewName"] != string.Empty)
                return PartialView(AsyncManager.Parameters["ViewName"].ToString(), AsyncManager.Parameters["ViewData"]);
            
            return null;
        }
    }
}
