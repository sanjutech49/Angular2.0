using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Web.LoanCenter.ViewModels;
using MML.Common;
using MML.Web.Facade;
using MML.Contracts;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class OpenRateOptionNotesPopupCommand : CommandsBase
    {
        //
        // GET: /OpenRateOptionNotesPopupCommand/
/*
        public ActionResult Index()
        {
            return View();
        }
*/
        public override void Execute()
        {
            base.Execute();
            try
            {
                var emailId = 0;
                if ( InputParameters.ContainsKey( "SentMailId" ) )
                    Int32.TryParse( InputParameters[ "SentMailId" ].ToString().TrimEnd(), out emailId );


                if ( emailId == 0 )
                    throw new InvalidOperationException( "Missing sent email Id!" );

                RateOptionViewModel model = new RateOptionViewModel();



                SentEmailItem bussinesContactViewModel = ContactServiceFacade.RetrieveSentEmailItemNote( emailId, base.User.UserAccountId );

                if ( bussinesContactViewModel!=null ){
                    model.SentEmailNote = bussinesContactViewModel.Notes;
                    model.SentEmailIdCurrent = emailId;
                }

                ViewName = "Commands/_rateOptionsNotePopup";
                ViewData = model;

                
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "There is some issues in method OpenBusinessContactPopupCommand.Execute(): " + ex.Message, ex );
                throw;
            }
        }
    }
}
