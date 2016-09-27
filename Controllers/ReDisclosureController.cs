using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Async;
using MML.Common;
using MML.Contracts;
using MML.Web.LoanCenter.Commands;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Web.Facade;
using MML.iMP.Aus.Contracts;
using MML.Web.LoanCenter.ViewModels;
using MML.Common.Helpers;
using MML.iMP.Common;

namespace MML.Web.LoanCenter.Controllers
{
    public class ReDisclosureController : Controller
    {
        [HttpGet]
        public ActionResult ShowReDisclosureSection( string LoanId )
        {
            Guid loanId = Guid.Empty;
            var model = new ReDisclosureModel() { LoanChangeIndicators = new LoanChangeIndicators() };
            if ( Guid.TryParse( LoanId, out loanId ) )
            {
                model.LoanId = loanId;

                LoanServiceFacade loanServiceFacade = new LoanServiceFacade();
                var loanIndicators = loanServiceFacade.RetrieveLoanChangeIndicators( loanId, false );
                if ( loanIndicators == null )
                    loanIndicators = new LoanChangeIndicatorsRetrieved();

                model.LoanChangeIndicators.ChangeOfCircumstanceList = loanIndicators.ChangeOfCircumstanceList;
                model.LoanChangeIndicators.CounterOfferApprovalItems = loanIndicators.CounterOfferApprovalItems;
                model.LoanChangeIndicators.MdiaIndicator = loanIndicators.MdiaIndicator;
                model.LoanChangeIndicators.ChangeOfCircumstancesIndicator = loanIndicators.ChangeOfCircumstancesIndicator;
                model.LoanChangeIndicators.CafIndicator = loanIndicators.CafIndicator;
                model.DisplayCounterOfferApproval = loanIndicators.CafIndicator;

                BorrowerServiceFacade borrowerServiceFacade = new BorrowerServiceFacade();
                model.IsOnlineBorrower = borrowerServiceFacade.IsOnlineBorrower( loanId );
            }

            return PartialView( "ReDisclosure/_reDisclosure", model );
        }

        [HttpPost]
        public void SubmitForm( ReDisclosureModel model )
        {
            string counterOfferApproval = null;
        
            var userAccountId = IdentityManager.GetUserAccountId();

            LoanServiceFacade loanServiceFacade = new LoanServiceFacade();
           
            model.LoanChangeIndicators.ChangeOfCircumstancesIndicator = model.LoanChangeIndicators.ChangeOfCircumstanceList != null && model.LoanChangeIndicators.ChangeOfCircumstanceList.Exists( c => c.Checked );
            loanServiceFacade.SaveLoanChangeIndicators( userAccountId, model.LoanId, model.LoanChangeIndicators, counterOfferApproval, true );
            // Delete any previous LoanChangeIndicators which may had been created
            loanServiceFacade.DeleteDiscardedLoanChangeIndicators( model.LoanId ); 
        }

        [HttpPost]
        public void DeleteDiscardedLoanChangeIndicators( string loanId )
        {
            Guid lid = Guid.Empty;
            if ( !Guid.TryParse( loanId, out lid ) )
                return;

            LoanServiceFacade loanServiceFacade = new LoanServiceFacade();
            loanServiceFacade.DeleteDiscardedLoanChangeIndicators( lid );
        }

        public ActionResult ReloadRedisclosureSection( string workQueueType, string loanId, string prospectid )
        {
            var command = String.Format( "LoanDetails,WorkQueueType={0},Action={1},LoanId={2},ProcpectId={3}", workQueueType, ConciergeWorkQueueCommandHelper.ManageLoan, loanId, prospectid );
            var result = CommandInvoker.InvokeFromCompositeString( command, HttpContext );
            return PartialView( result.ViewName, result.ViewData );
        } 
    }
}
