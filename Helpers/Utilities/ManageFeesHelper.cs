using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.Facade;
using MML.Contracts;
using MML.Web.LoanCenter.ViewModels;
using Resources;
using MML.Common;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class ManageFeesHelper
    {
        public static TitleAndEscrow GetCostByLoanId( Guid loanId, UserAccount user, HttpContextBase httpContext )
        {
            if ( user == null )
                return new TitleAndEscrow();

            int userAccountId = user.UserAccountId;
            
            List<Cost> costs = CostServiceFacade.GetManageFeesCosts( loanId, MortgageType.Conventional, LoanTransactionType.Refinance, Guid.Empty, Guid.Empty, -1 );

            TitleAndEscrow titleAndEscrow = LoanServiceFacade.RetrieveTitleAndEscrowDetails( loanId, userAccountId );

            if ( titleAndEscrow == null || titleAndEscrow.CostGroups == null || titleAndEscrow.CostGroups.Count == 0 )
                return null;

            if ( costs != null && !titleAndEscrow.IncludeTaxesAndInsurances )
                costs = costs.Where( c => c.HUDLineNumber != 1002 && c.HUDLineNumber != 1004 ).ToList();

            var file = DocumentsServiceFacade.GetLatestFileByLoanIdAndDocumentClass( loanId, DocumentClass.SmartGFEComplianceCertificate, userAccountId );
            if ( file != null && file.FileStoreItemId != Guid.Empty )
            {
                titleAndEscrow.SmartGfeDocumentLink = HttpUtility.UrlEncode( EncryptionHelper.EncryptRijndael( file.FileStoreItemId.ToString(), EncriptionKeys.Default ) );
                if ( !titleAndEscrow.SmartGFEEnabled.HasValue )
                    titleAndEscrow.SmartGFEEnabled = titleAndEscrow.SmartGFEEnabledOriginalValue = true;
            }

            if ( ( user.Privileges != null && user.Privileges.Any( p => p.Category.Equals( ( int )ActionCategory.LockFee ) ) )
                || ( user.Roles != null && user.Roles.Any( r => r.Privileges.Any( p => p.Category.Equals( ( int )ActionCategory.LockFee ) ) ) ) )
                titleAndEscrow.IsAuthorizedToLockFee = true;

            foreach ( var costGroup in titleAndEscrow.CostGroups )
            {
                if ( costGroup.Costs == null )
                    continue;

                foreach ( var cost in costGroup.Costs )
                {
                    if ( costs != null )
                    {
                        var loanCost = costs.FirstOrDefault( c => c.HUDLineNumber == cost.HUDLineNumber && ( String.IsNullOrWhiteSpace( cost.SubHUDLineNumber ) || ( c.SubHUDLineNumber == cost.SubHUDLineNumber ) ) );
                        if ( loanCost != null )
                        {
                            cost.CostId = loanCost.CostId;
                            cost.Amount = loanCost.Amount;
                            cost.FromBorrowerFunds = loanCost.Amount;
                            if ( loanCost.Amount != 0 )
                                cost.IsAprCost = loanCost.IsAprCost;
                            cost.CostId = loanCost.CostId;
                            cost.PaidBy = loanCost.PaidBy;
                            cost.PaidTo = loanCost.PaidTo;
                            cost.PocAmount = loanCost.PocAmount;
                            cost.PtcAmount = loanCost.PtcAmount;
                            cost.When = loanCost.PocAmount > 0 ? "O" : "T";
                            cost.Name = costGroup.CostGroupNumber != 12 ? loanCost.Name : RetrieveDisplayNameForGroup20(loanCost.Name);
                            cost.SmartGfeRequestType = loanCost.SmartGfeRequestType;
                            cost.Provider = loanCost.Provider;
                            cost.IsLocked = loanCost.IsLocked;
                            cost.Percent = loanCost.Percent;
                            cost.Payee = loanCost.Payee;

                            if ( cost.HUDLineNumber == 901 )
                            {
                                DateTime? closingDate = titleAndEscrow.ClosingDate;
                                if ( closingDate.HasValue )
                                {
                                    int interestDays = Calculator.Calculator.CalculateInterestDays( closingDate.Value );

                                    cost.ClosingDate = closingDate.Value.ToString( "MM/dd/yyyy" );
                                    cost.ClosingDateTo = closingDate.Value.AddDays( interestDays - 1 ).ToString( "MM/dd/yyyy" );
                                    cost.InterestDays = interestDays;
                                    cost.InterestRate = loanCost.Amount / interestDays;
                                }
                            }

                            // Set default MonthsToBePaid to 1, in case that stored DB value is -1
                            if ( loanCost.MonthsToBePaid == -1 && loanCost.Amount > 0 )
                                loanCost.MonthsToBePaid = 1;

                            if ( loanCost.MonthsToBePaid > 0 )
                            {
                                cost.MonthsToBePaid = loanCost.MonthsToBePaid;
                                cost.YearsToBePaid = ( int )Math.Ceiling( ( double )cost.MonthsToBePaid / 12 );
                            }
                        }

                        cost.OldAmount = cost.Amount;
                    }
                }
            }


            if ( httpContext.Session[ SessionHelper.CurrentLoanIdForBusinessContact ] is Guid && ( Guid )httpContext.Session[ SessionHelper.CurrentLoanIdForBusinessContact ] == loanId )
            {
                if ( httpContext.Session[ SessionHelper.CurrentBusinessContactBuyerAgent ] != null )
                    titleAndEscrow.BuyerAgent = httpContext.Session[ SessionHelper.CurrentBusinessContactBuyerAgent ].ToString();

                if ( httpContext.Session[ SessionHelper.CurrentBusinessContactSellerAgent ] != null )
                {
                    titleAndEscrow.SellerAgent = httpContext.Session[ SessionHelper.CurrentBusinessContactSellerAgent ].ToString();
                    // If the Agent information is the same for both only display a single instance on row 701
                    if ( titleAndEscrow.SellerAgent.ToLower() == titleAndEscrow.BuyerAgent.ToLower() )
                        titleAndEscrow.SellerAgent = String.Empty;
                }
            }
            else
            {
                var realtor = BusinessContactServiceFacade.RetrieveBusinessContactByTypeAndLoan( BusinessContactCategory.BuyerAgent, loanId );
                if ( realtor != null && !String.IsNullOrEmpty( realtor.CompanyName ) )
                    titleAndEscrow.BuyerAgent = realtor.CompanyName;

                realtor = BusinessContactServiceFacade.RetrieveBusinessContactByTypeAndLoan( BusinessContactCategory.SellerAgent, loanId );
                if ( realtor != null && !String.IsNullOrEmpty( realtor.CompanyName ) )
                    titleAndEscrow.SellerAgent = realtor.CompanyName;
            }

            return titleAndEscrow;
        }

        public static void PopulateComboBoxes(ManageFeesViewModel model)
        {
            var file = DocumentsServiceFacade.GetLatestFileByLoanIdAndDocumentClass( model.TitleAndEscrow.LoanId, DocumentClass.SmartGFEComplianceCertificate, model.TitleAndEscrow.UserAccountId );
            if ( file != null && file.FileStoreItemId != Guid.Empty )
            {
                model.TitleAndEscrow.SmartGfeDocumentLink = HttpUtility.UrlEncode( EncryptionHelper.EncryptRijndael( file.FileStoreItemId.ToString(), EncriptionKeys.Default ) );
                if ( !model.TitleAndEscrow.SmartGFEEnabled.HasValue )
                    model.TitleAndEscrow.SmartGFEEnabled = model.TitleAndEscrow.SmartGFEEnabledOriginalValue = true;
            }
            model.TitleAndEscrow.ListPaidBy = new List<string>();
            var ddlValues = LookupServiceFacade.Lookup( LookupKeywords.CostPaidBy, model.TitleAndEscrow.UserAccountId );
            foreach ( var c in ddlValues )
            {
                model.TitleAndEscrow.ListPaidBy.Add( c.StringValue );
            }

            model.TitleAndEscrow.ListPaidTo = new List<string>();
            ddlValues = LookupServiceFacade.Lookup( LookupKeywords.CostPaidTo, model.TitleAndEscrow.UserAccountId );
            foreach ( var c in ddlValues )
            {
                model.TitleAndEscrow.ListPaidTo.Add( c.StringValue );
            }
            model.TitleAndEscrow.ListWhen = new List<string>();
            ddlValues = LookupServiceFacade.Lookup( LookupKeywords.CostPaidWhen, model.TitleAndEscrow.UserAccountId );
            foreach ( var c in ddlValues )
            {
                model.TitleAndEscrow.ListWhen.Add( c.StringValue );
            }
        }

        private static string RetrieveDisplayNameForGroup20(string costName)
        {
            var name = Enum.GetValues(typeof(FeeTitles1200)).Cast<FeeTitles1200>().Where(title => title.GetDBValue() == costName).FirstOrDefault();
            return name.GetStringValue();
        }
        public static void SetTitleAndEscrowModel( ManageFeesViewModel model )
        {
            var feeTitles801 = Enum.GetValues( typeof( FeeTitles801 ) ).Cast<FeeTitles801>().Select( title => title.GetStringValue() ).ToList<string>();
            var feeTitles804To820 = Enum.GetValues( typeof( FeeTitles804To820 ) ).Cast<FeeTitles804To820>().Select( title => title.GetStringValue() ).ToList<string>();
            var feeTitles900 = Enum.GetValues( typeof( FeeTitles900 ) ).Cast<FeeTitles900>().Select( title => title.GetStringValue() ).ToList<string>();
            var feeTitles1000 = Enum.GetValues( typeof( FeeTitles1000 ) ).Cast<FeeTitles1000>().Select( title => title.GetStringValue() ).ToList<string>();
            var feeTitles1100 = Enum.GetValues( typeof( FeeTitles1100 ) ).Cast<FeeTitles1100>().Select( title => title.GetStringValue() ).ToList<string>();
            var feeTitles1200 = Enum.GetValues( typeof( FeeTitles1200 ) ).Cast<FeeTitles1200>().Select( title => title.GetStringValue() ).ToList<string>();
            var feeTitles1302To1307 = Enum.GetValues( typeof( FeeTitles1302To1307 ) ).Cast<FeeTitles1302To1307>().Select( title => title.GetStringValue() ).ToList<string>();
            var feeTitles1308To1311 = Enum.GetValues( typeof( FeeTitles1308To1311 ) ).Cast<FeeTitles1308To1311>().Select( title => title.GetStringValue() ).ToList<string>();

            PrepareFeeTitlesDropdown( feeTitles801 );
            model.FeeTitles801 = feeTitles801;

            PrepareFeeTitlesDropdown( feeTitles804To820 );
            model.FeeTitles804To820 = feeTitles804To820;

            PrepareFeeTitlesDropdown( feeTitles900 );
            model.FeeTitles900 = feeTitles900;

            PrepareFeeTitlesDropdown( feeTitles1000 );
            model.FeeTitles1000 = feeTitles1000;

            PrepareFeeTitlesDropdown( feeTitles1100 );
            model.FeeTitles1100 = feeTitles1100;

            PrepareFeeTitlesDropdown( feeTitles1200 );
            model.FeeTitles1200 = feeTitles1200;

            PrepareFeeTitlesDropdown( feeTitles1302To1307 );
            model.FeeTitles1302To1307 = feeTitles1302To1307;

            PrepareFeeTitlesDropdown( feeTitles1308To1311 );
            model.FeeTitles1308To1311 = feeTitles1308To1311;

            var leadSource = LoanServiceFacade.RetrieveHearAboutUs( model.TitleAndEscrow.LoanId ); 
            model.LeadSourceInformation = leadSource != null ? leadSource.LeadSourceId + " " + leadSource.Description : String.Empty;
            model.TitleInformation = ConciergeWorkQueueServiceFacade.ExecuteSPGetBorrowerData( "GetBorrowerData", model.TitleAndEscrow.LoanId, model.TitleAndEscrow.UserAccountId );

        }

        public  static void PrepareFeeTitlesDropdown( List<string> values )
        {
            values.Sort();
            values.Insert( 0, String.Empty );
        }

        public static void PreselectDefaultCosts(CostGroupForTitleAndEscrow costs)
        {

            foreach (var cost in costs.Costs)
            {
                switch (costs.CostGroupNumber)
                {
                    
                    case 80:
                        switch ( cost.SubHUDLineNumber )
                        {
                            case "a":
                                cost.Title = FeeTitles801.AdministrationFee.GetStringValue();
                                break;
                        
                            case "b": cost.Title = FeeTitles801.ApplicationFees.GetStringValue();
                                break;
                            case "c":
                                cost.Title = FeeTitles801.ProcessingFees.GetStringValue();
                                break;
                            case "d":
                                cost.Title = FeeTitles801.BrokerFees.GetStringValue();
                                break;
                            case "e":
                                cost.Title = FeeTitles801.BrokerCompensationFees.GetStringValue();
                                break;
                            case "f":
                                cost.Title = FeeTitles801.UnderwritingFee.GetStringValue();
                                break;
                            case "g":
                                cost.Title = FeeTitles801.MERSFee.GetStringValue();
                                break;
                            case "h":
                                cost.Title = FeeTitles801.WireFees.GetStringValue();
                                break;

                        }
                        switch (cost.HUDLineNumber)
                        {
                            case 804:
                                cost.Title = FeeTitles804To820.AppraisalFee.GetStringValue();
                                break;
                            case 805:
                                cost.Title = FeeTitles804To820.CreditReport.GetStringValue();
                                break;
                            case 806:
                                cost.Title = FeeTitles804To820.TaxService.GetStringValue();
                                break;
                            case 807:
                                cost.Title = FeeTitles804To820.FloodCertification.GetStringValue();
                                break;
                            case 808:
                                cost.Title = FeeTitles804To820.AppraisalAutomatedValuation.GetStringValue();
                                break;
                            case 809:
                                cost.Title = FeeTitles804To820.AppraisalReview.GetStringValue();
                                break;
                            case 810:
                                cost.Title = FeeTitles804To820.AppraisalAdditionalCharges.GetStringValue();
                                break;
                            case 811:
                                cost.Title = FeeTitles804To820.AppraisalSecondAppraisal.GetStringValue();
                                break;
                            case 812:
                                cost.Title = FeeTitles804To820.AppraisalSupplement.GetStringValue();
                                break;
                            case 813:
                                cost.Title = FeeTitles804To820.HOAQuestionnaire.GetStringValue();
                                break;
                            case 814:
                                cost.Title = FeeTitles804To820.SubordinationFee.GetStringValue();
                                break;
                        }
                        break;
                    case 90:
                        switch (cost.HUDLineNumber)
                        {
                            case 905:
                                cost.Title = FeeTitles900.VAFundingFee.GetStringValue();
                                break;
                            case 906:
                                cost.Title = FeeTitles900.FloodInsurance.GetStringValue();
                                break;
                            case 910:
                                cost.Title = FeeTitles900.PropertyTaxesDueAtClosing.GetStringValue();
                                break;
                        }
                        break;
                    case 10:
                        switch ( cost.HUDLineNumber )
                        {
                            case 1005:
                                cost.Title = FeeTitles1000.CityPropertyTax.GetStringValue();
                                break;
                            case 1006:
                                cost.Title = FeeTitles1000.FloodInsurance.GetStringValue();
                                break;
                            case 1010:
                                cost.Title = FeeTitles1000.USDAAnnualFee.GetStringValue();
                                break;
                        }
                        break;
                    case 11:
                        switch (cost.SubHUDLineNumber)
                        {
                             case "a":
                            cost.Title = FeeTitles1100.TitleEndorsementFee.GetStringValue();
                            break;
                        case "b":
                            cost.Name = FeeTitles1100.SubescrowFee.GetStringValue();
                            break;
                        case "d":
                            cost.Name = FeeTitles1100.TitleSearchAbstract.GetStringValue();
                            break;
                        }
                        switch ( cost.HUDLineNumber )
                        {
                            case 1110:
                                cost.Title = FeeTitles1100.LoanTieIn.GetStringValue();
                                break;
                            case 1111:
                                cost.Title = FeeTitles1100.EDocDocumentStorageArchiveCopies.GetStringValue();
                                break;
                            case 1112:
                                cost.Title = FeeTitles1100.DocumentPreparationFees.GetStringValue();
                                break;
                            case 1113:
                                cost.Title = FeeTitles1100.OvernightFees.GetStringValue();
                                break;
                            case 1114:
                                cost.Title = FeeTitles1100.WireTransfer.GetStringValue();
                                break;
                        }
                        break;

                }
            }
        }
    }
}
