using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Common.Helpers;
using MML.Contracts;

namespace MML.Web.LoanCenter.Controllers
{
    public class UserAccountController : Controller
    {
        //
        // GET: /UserAccount/
        [OutputCache( NoStore = true, Duration = 0, VaryByParam = "*" )]
        [CompressFilter]
        public ActionResult Index()
        {
            return View();
        }
        public String GetNMLS( String conciergeId )
        {
            Int32 userAccountId = 0;
            Int32.TryParse( conciergeId, out userAccountId );
            return UserAccountServiceFacade.RetrieveNMLSNumber( userAccountId );
        }

        [HttpGet]
        public int GetUserAccountId()
        {
            int userAccountId = 0;

            if (Session[SessionHelper.UserData] != null)
            {
                userAccountId = ((UserAccount)(Session[SessionHelper.UserData])).UserAccountId;
            }

            return userAccountId;
        }
    }
}
