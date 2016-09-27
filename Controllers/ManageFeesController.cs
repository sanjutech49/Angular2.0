using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Common;
using MML.Common.Helpers;
using MML.Web.LoanCenter.ViewModels;
using LoanHelper = MML.Common.LoanHelper;

namespace MML.Web.LoanCenter.Controllers
{
    [OutputCache( NoStore = true, Duration = 0, VaryByParam = "*" )]
    [CompressFilter]
    public class ManageFeesController : Controller
    {
        //
        // GET: /ManageFees/
        #region ClosingCosts
        public ActionResult ShowClosingCostsHistory( String loanId )
        {
            Guid loanIdParsed = Guid.Parse( loanId );
            List<ClosingDateHistory> closingDateHistory = new List<ClosingDateHistory>();
            closingDateHistory = LoanServiceFacade.RetrieveClosingDateHistory( loanIdParsed, AccountHelper.GetUserAccountId() );


            return PartialView( "Commands/ManageFees/_closingCostsHistory", closingDateHistory );

        }
        #endregion

        #region UpdateCostClosingDate

        public JsonResult UpdateCostClosingDate( String loanId, String closingDate )
        {
            try
            {

                if ( string.IsNullOrEmpty( loanId ) || string.IsNullOrEmpty( closingDate ) )
                {
                    throw new ArgumentNullException( "Loan Id and Closing Date are required" );
                }

                int userAccountId = IdentityManager.GetUserAccountId();
                Guid loanIdGuid = new Guid( loanId );
                DateTime enteredClosingDate = DateTime.Parse( closingDate );

                UserAccount loggedUser = ( UserAccount )System.Web.HttpContext.Current.Session[ SessionHelper.UserData ];
                var closingDateHistory = new ClosingDateHistory
                {
                    ClosingDate = enteredClosingDate,
                    DateOfChange = DateTime.Now,
                    LoanId = loanIdGuid,
                    UserName = loggedUser.Party.FirstName + " " + loggedUser.Party.LastName
                };

                LoanServiceFacade.UpdateManuallyEnteredCloseDate( loanIdGuid, true, userAccountId );
                LoanServiceFacade.UpdateLoanClosingDate( loanIdGuid, enteredClosingDate, userAccountId );
                CostServiceFacade.UpdateCostsAndClosingDate( loanIdGuid, enteredClosingDate, userAccountId );
                LoanServiceFacade.CreateClosingDateHistory( closingDateHistory, userAccountId );


                var model = ManageFeesHelper.GetCostByLoanId( loanIdGuid, loggedUser, HttpContext );

                var group901 = model.CostGroups.FirstOrDefault( x => x.CostGroupNumber == 90 ).Costs.FirstOrDefault( x => x.HUDLineNumber == 901 );
                var group1002 = model.CostGroups.FirstOrDefault( x => x.CostGroupNumber == 10 ).Costs.FirstOrDefault( x => x.HUDLineNumber == 1002 );
                var group1004 = model.CostGroups.FirstOrDefault( x => x.CostGroupNumber == 10 ).Costs.FirstOrDefault( x => x.HUDLineNumber == 1004 );

                int isClosingDateChanged = model.HasClosingDateHistory ? 1 : 0;
                return Json( new { success = true, group901 = group901, group1002 = group1002, group1004 = group1004, isClosingDateChanged = isClosingDateChanged } );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "_closingcosts.cshtml::UpdateCostClosingDate", exception, Guid.Empty, IdentityManager.GetUserAccountId() );
                return Json( new { success = false } );
            }

        }

        #endregion
        
        [HttpPost]
        public ActionResult SaveCosts( ManageFeesViewModel model )
        {
            try
            {
                var group1200Index = model.TitleAndEscrow.CostGroups.FindIndex(g => g.CostGroupNumber == 12);
                foreach (var cost in model.TitleAndEscrow.CostGroups[group1200Index].Costs)
                {
                    if (!String.IsNullOrEmpty(cost.Name))
                    {
                        cost.TotalRow = cost.Name.Contains("1203") ? "1203" : cost.Name.Contains("1201") ? "1201" : null;
                        cost.Name = cost.Name.Contains("1203") ? cost.Name.Replace(" - 1203", String.Empty) :
                           cost.Name.Contains("1201") ? cost.Name.Replace(" - 1201", String.Empty) : cost.Name;
                    }
                       
                }
                if ( model.TitleAndEscrow.SmartGFEEnabled.HasValue )
                {
                    var group1100Index = model.TitleAndEscrow.CostGroups.FindIndex( g => g.CostGroupNumber == 11 );
                   
                    
                    if ( !model.TitleAndEscrow.SmartGFEEnabled.Value && model.TitleAndEscrow.SmartGFEEnabledOriginalValue )
                    {
                        var costs1100Exist = false;
                        foreach ( var cost in model.TitleAndEscrow.CostGroups[ group1100Index ].Costs )
                        {
                            if ( cost.Amount > 0 || cost.FromBorrowerFunds > 0 )
                            {
                                costs1100Exist = true;
                                break;
                            }
                        }

                        var costs1200Exist = false;
                        foreach ( var cost in model.TitleAndEscrow.CostGroups[ group1200Index ].Costs )
                        {
                            if ( cost.Amount > 0 || cost.FromBorrowerFunds > 0 )
                            {
                                costs1200Exist = true;
                                break;
                            }
                        }

                        // If user disabled SmartGFE, but removed all fees -> re-enable to SmartGFE
                        if ( !costs1100Exist && !costs1200Exist )
                            model.TitleAndEscrow.SmartGFEEnabled = true;
                    }

                    if ( model.TitleAndEscrow.SmartGFEEnabled.Value )
                    {
                        if ( model.TitleAndEscrow.SmartGFEEnabledOriginalValue )
                        {
                            //If SmartGFE is turned on, do not update fees in section 1100 and 1200 as they are locked
                            model.TitleAndEscrow.CostGroups.RemoveAt( group1100Index );

                            group1200Index = model.TitleAndEscrow.CostGroups.FindIndex( g => g.CostGroupNumber == 12 );
                            model.TitleAndEscrow.CostGroups.RemoveAt( group1200Index );
                        }
                        else
                        {
                            // If SmartGFE was manually turned back on, remove locked flags for all fees in sections 1100 and 1200
                            foreach ( var cost in model.TitleAndEscrow.CostGroups[group1100Index].Costs )
                            {
                                cost.IsLocked = false;
                            }

                            foreach ( var cost in model.TitleAndEscrow.CostGroups[ group1200Index ].Costs )
                            {
                                cost.IsLocked = false;
                            }
                        }
                    }
                }

                CostServiceFacade.UpdateCostsByTitleAndEscrow( model.TitleAndEscrow, IdentityManager.GetUserAccountId() );
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.LoanCenterController,
                                  "An error occurred in MangeFeesController! SaveCosts(ManageFeesViewModel model)", ex );

            }

            return RedirectToAction( "Execute", "Command",
                                       new { command = "ManageFees,LoanId=" + model.TitleAndEscrow.LoanId } );
        }

        public ActionResult ShowCostHistoryPopup( String loanId )
        {
            Guid loanIdParsed = Guid.Parse( loanId );
            List<CostHistory> costHistory = new List<CostHistory>();
            costHistory = CostServiceFacade.RetrieveCostHistory( loanIdParsed, AccountHelper.GetUserAccountId() );


            return PartialView( "Commands/ManageFees/_costHistoryPopUp", costHistory );
        }



        [HttpPost]
        public ActionResult RetrieveSmartGfeData(ManageFeesViewModel model)
        {
            ModelState.Clear();
            var loan = LoanServiceFacade.RetrieveLoan( model.TitleAndEscrow.LoanId, false, model.TitleAndEscrow.UserAccountId );
            
            var costGroupNumber11 = model.TitleAndEscrow.CostGroups.First(c => c.CostGroupNumber == 11);
            var costGroupNumber12 = model.TitleAndEscrow.CostGroups.First( c => c.CostGroupNumber == 12 );
            var closingCostRequestId = IntegrationLogServiceFacade.GetClosingCorpXmlForLoanId(model.TitleAndEscrow.LoanId, model.TitleAndEscrow.UserAccountId);
            var defaultCostCalculation = new DefaultCostCalculation()
                {
                    LoanId = model.TitleAndEscrow.LoanId,
                    ClosingCostRequestId = closingCostRequestId,
                    FeeProvider =model.TitleAndEscrow.FeeProvider,
                    MortgageType = loan.MortgageType,
                    PropertyValue = loan.SubjectProperty.CurrentEstimatedValue.HasValue ? ( decimal )loan.SubjectProperty.CurrentEstimatedValue : 0,
                    LoanAmount = ( decimal )loan.BaseLoanAmount,
                    StateName = loan.SubjectProperty.Address == null ? null : loan.SubjectProperty.Address.StateName,
                    PropertyType = loan.SubjectProperty.PropertyType,
                    InvestorName = loan.InvestorName,
                    CompanyProfile = CompanyProfileServiceFacade.RetrieveCompanyProfile(),
                    LoanTransactionTypeId =  loan.LoanType
                                                                         
                };
           
            costGroupNumber11 = CostServiceFacade.RetrieveCostFromSmartGfe( defaultCostCalculation, model.TitleAndEscrow.UserAccountId, costGroupNumber11 );
            costGroupNumber12 = CostServiceFacade.RetrieveCostFromSmartGfe( defaultCostCalculation, model.TitleAndEscrow.UserAccountId, costGroupNumber12 );
            ManageFeesHelper.PreselectDefaultCosts(costGroupNumber11);
            ManageFeesHelper.PreselectDefaultCosts( costGroupNumber12 );
            var group1100Index = model.TitleAndEscrow.CostGroups.FindIndex( g => g.CostGroupNumber == 11 );
            model.TitleAndEscrow.CostGroups.RemoveAt( group1100Index );
            model.TitleAndEscrow.CostGroups.Insert( group1100Index, costGroupNumber11 );
            var group1200Index = model.TitleAndEscrow.CostGroups.FindIndex( g => g.CostGroupNumber == 12 );
            model.TitleAndEscrow.CostGroups.RemoveAt( group1200Index );
            model.TitleAndEscrow.CostGroups.Insert( group1200Index, costGroupNumber12 );

            var itemize = GeneralSettingsServiceFacade.RetrieveStatusByGeneralSettingsName( "Itemize Lender Credit", Guid.Empty, 0 );
            LoanHelper.PerformPTCCalculationsForTitleEscrow( model.TitleAndEscrow.CostGroups, itemize );
            ManageFeesHelper.PopulateComboBoxes( model );
            ManageFeesHelper.SetTitleAndEscrowModel( model );
            return PartialView( "Commands/ManageFees/_manageFeeSmartGfeSection", model );
        }

      

        
    }
}
