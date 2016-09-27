using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Web.Facade;
using MML.Contracts;

namespace MML.Web.LoanCenter.Controllers
{
    public class MailRoomController : Controller
    {
        //
        // GET: /MailRoom/
        [OutputCache( NoStore = true, Duration = 0, VaryByParam = "*" )]
        [CompressFilter]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Show Upload File
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult CreateCoverLetter( string LoanId, string DocumentClassId, string UserAccountId )
        {
            String message = "Failure";
            Guid loanId;

            if ( Guid.TryParse( LoanId, out loanId ) )
            {
                DocumentClass documentClass = DocumentClassId == "ReDisclosures" ? DocumentClass.ReDisclosuresMailingCoverLetter : DocumentClass.InitialDisclosuresMailingCoverLetter;

                if ( !DocumentsServiceFacade.MailRoomCoverLetterExists( loanId, documentClass ) )
                {
                    var mailRoomCoverLetter = new MailRoomCoverLetter()
                    {
                        LoanId = loanId,
                        DocumentClass = documentClass,
                        //UserAccountId = userAccountId
                    };

                    var response = LoanServiceFacade.MailingRoomCoverLetter(mailRoomCoverLetter);
                    message = response!=null && response.Saved ? "Success" : "Failure";
                }
            }

            JsonResult jsonData = Json( new
            {
                Succes = message
            }, JsonRequestBehavior.AllowGet );

            return jsonData;
        }
    }
}
