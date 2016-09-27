using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Web;
using APS.ServiceProxy;
using MML.Common.Configuration;
using MML.Contracts;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.iMP.AppraisalProducts.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using System.Web.WebPages.Html;
using MML.Common.Helpers;
using Telerik.Web.Mvc.UI;
using MML.Common;
using MML.Web.LoanCenter.Extensions;
using System.Text.RegularExpressions;

namespace MML.Web.LoanCenter.Commands
{
    public class ShowAppraisalFormCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;
        private Guid _loanId = Guid.Empty;

        public string ViewName
        {
            get { return _viewName; }
        }

        public dynamic ViewData
        {
            get { return _viewModel; }
        }

        public Dictionary<string, object> InputParameters
        {
            get
            {
                return _inputParameters;
            }
            set
            {
                _inputParameters = value;
            }
        }

        public HttpContextBase HttpContext
        {
            get { return _httpContext; }
            set { _httpContext = value; }
        }

        private static SelectListItem _genericItem = new SelectListItem()
        {
            Text = "(Select One)",
            Value = "-1"
        };

        public void Execute()
        {
            SetCurrentCulture();

            UserAccount user = null;
            if ( _httpContext.Session[ "UserData" ] != null )
                user = ( UserAccount )_httpContext.Session[ "UserData" ];
            else
                user = UserAccountServiceFacade.GetUserByName( _httpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            /* parameter processing */
            if ( !InputParameters.ContainsKey( "LoanId" ) )
                throw new ArgumentException( "LoanId was expected!" );

            Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out _loanId );

            Int32 prospectId = 0;
            Int32.TryParse( InputParameters[ "ProspectId" ].ToString(), out prospectId );

            /* Command processing */
            // TODO: retrieve data from db and initialize view model

            AppraisalViewModel userAppraisalViewModel = new AppraisalViewModel();

            //UserAccount details needed for displaying proper controls on view
            userAppraisalViewModel.UserAccount = user;

            // fill view model
            LoadOrderAppraisalDataFull( userAppraisalViewModel, user );
            LoadPhoneNumbers( userAppraisalViewModel );
            LoadLeadSourceInformation(userAppraisalViewModel, _loanId, prospectId, user);
            LoadBillingInformation( userAppraisalViewModel, user );
            
            LoadComboData( userAppraisalViewModel, user );
            LoadDisclosureSummary( userAppraisalViewModel, _loanId, user );

            userAppraisalViewModel.Documents = new List<Document>();

            AppraisalDocumentsHelper appraisalDocumentsHelper = new AppraisalDocumentsHelper();
            appraisalDocumentsHelper.GetAppraisalDocuments(_loanId, user.UserAccountId, ref userAppraisalViewModel);


            // Remove target investor from program name
            if ( userAppraisalViewModel.Loan != null )
            {
                string loanProgramNoDoubleSpaces = userAppraisalViewModel.Loan.ProgramName != null ? Regex.Replace( userAppraisalViewModel.Loan.ProgramName, @"\s+", " " ) : String.Empty;
                string targetInvestorNoDoubleSpaces = userAppraisalViewModel.Loan.InvestorName != null ? Regex.Replace( userAppraisalViewModel.Loan.InvestorName, @"\s+", " " ) : String.Empty;

                if ( !String.IsNullOrWhiteSpace( loanProgramNoDoubleSpaces ) && !String.IsNullOrWhiteSpace( targetInvestorNoDoubleSpaces ) )
                {
                    // Filter out Program Name
                    string loanProgram = String.Empty;
                    if ( loanProgramNoDoubleSpaces.ToLower().Contains( targetInvestorNoDoubleSpaces.ToLower() ) )
                    {
                        if ( loanProgramNoDoubleSpaces.Length > targetInvestorNoDoubleSpaces.Length )
                        {
                            loanProgram = loanProgramNoDoubleSpaces.Substring( targetInvestorNoDoubleSpaces.Length, loanProgramNoDoubleSpaces.Length - targetInvestorNoDoubleSpaces.Length );
                            if ( loanProgram != null )
                                userAppraisalViewModel.Loan.ProgramName = loanProgram.Trim();
                        }
                    }

                    // Show actual investor if loan is locked
                    if ( userAppraisalViewModel.Loan.LockStatus == LockStatus.Locked )
                    {
                        // Copy target investor into actual investor
                        userAppraisalViewModel.Loan.InvestorName = targetInvestorNoDoubleSpaces;
                    }
                }
            }

            _viewName = "_appraisalform";
            _viewModel = userAppraisalViewModel;
        }

        private void SetCurrentCulture()
        {
            // set current culture to US
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo( "en-US" );
        }

        /*private int GetSelectedIndex( List<DocumentCategory> documentCategories, Document document )
        {
            if ( documentCategories == null )
                throw new ArgumentNullException( "documentCategories", "Document Categories list is null" );

            if ( document == null )
                throw new ArgumentNullException( "document", "Document object is null." );

            int index = 0;
            int resultIndex = 0;
            foreach ( var documentCategory in documentCategories )
            {
                if ( documentCategory.DocumentCategoryId == document.DocumentCategory.DocumentCategoryId )
                {
                    resultIndex = index;
                    break;
                }
                index++;
            }
            return resultIndex;
        }*/

        private List<DropDownItem> ConvertDocumentCategoriesToListItems( List<DocumentCategory> documentCategories )
        {
            List<DropDownItem> listItems = null;
            try
            {
                listItems = new List<DropDownItem>();
                foreach ( DocumentCategory document in documentCategories )
                {
                    listItems.Add( new DropDownItem() {
                        Selected = false,
                        Text = document.Name,
                        Value = document.DocumentCategoryId.ToString()
                    } );
                }
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.ConciergeDocumentDownloader, "Unable to convert list of DocumentCategory to drop down items.", ex );
                throw;
            }
            return listItems;
        }

        private void LoadLeadSourceInformation( AppraisalViewModel userAppraisalViewModel, Guid loanId, Int32 prospectId, UserAccount user )
        {
            userAppraisalViewModel.TitleInformation = ConciergeWorkQueueServiceFacade.ExecuteSPGetBorrowerData( "GetBorrowerData", loanId, user.UserAccountId );

            var leadSourceInformation = ContactServiceFacade.RetrieveLeadSourceByContactIdAndLoanId( prospectId, loanId, user.UserAccountId );

            if ( leadSourceInformation != null )
                userAppraisalViewModel.LeadSourceInformation = leadSourceInformation.LeadSourceId + " " + leadSourceInformation.Description;
        }

        /// <summary>
        /// Get phone numbers
        /// </summary>
        /// <param name="userAppraisalViewModel">Appraisal view model</param>
        private void LoadBillingInformation( AppraisalViewModel userAppraisalViewModel, UserAccount user )
        {
            if ( userAppraisalViewModel.Loan.Borrower != null )
            {
                if ( !userAppraisalViewModel.BillingInformations.Any( bi => bi.Text == _genericItem.Text ) )
                    userAppraisalViewModel.BillingInformations.Add( _genericItem );

                //BillingInformationCollection billingInfos = UserAccountServiceFacade.GetBillingInfos( user.UserAccountId );
                BillingInformationCollection billingInfos = UserAccountServiceFacade.GetBillingInfos( userAppraisalViewModel.Loan.Borrower.UserAccountId );

                foreach ( BillingInformation billingInfo in billingInfos )
                {
                    userAppraisalViewModel.BillingInformations.Add( new SelectListItem()
                    {
                        Text = billingInfo.CreditCardType.GetStringValue() + ", " + StringHelper.MaskCreditCard( billingInfo.CreditCardNumber ),
                        Value = billingInfo.BillingInformationid.ToString(),
                        Selected = false
                    } );
                }
            }
        }

        private void LoadOrderAppraisalDataFull( AppraisalViewModel userAppraisalViewModel, UserAccount user )
        {
            // Create request object
            RetrieveOrderAppraisalDataFull request = new RetrieveOrderAppraisalDataFull()
            {
                LoanId = _loanId
            };

            // Call iMP platform
            var results = new Proxy().Send( "RetrieveOrderAppraisalWorkflow", new Dictionary<string, object> { { "Request", request } } );

            // Get results
            object responseMessageSuccess;
            results.TryGetValue( "Response", out responseMessageSuccess );
            Loan loanWithAppraisals = responseMessageSuccess as Loan;

            if ( loanWithAppraisals != null )
            {
                userAppraisalViewModel.Loan = loanWithAppraisals;

                if (userAppraisalViewModel.Loan.OrderAppraisals != null )
                {
                    for ( int i = 0; i < loanWithAppraisals.OrderAppraisals.Count; i++ )
                    {
                        if ( loanWithAppraisals.OrderAppraisals[ i ].OrderAppraisalProductsFees == null || loanWithAppraisals.OrderAppraisals[ i ].OrderAppraisalProductsFees.Count == 0 )
                        {
                            GetProductsAndFees( userAppraisalViewModel, i );
                        }
                        else if ( loanWithAppraisals.OrderAppraisals[ i ].OrderAppraisalProductsFees != null && loanWithAppraisals.OrderAppraisals[ i ].OrderAppraisalProductsFees.Count > 0 )
                        {
                            //Split Appraisal Condition string
                            loanWithAppraisals.OrderAppraisals[ i ].AppraisalCondition = loanWithAppraisals.OrderAppraisals[ i ].AppraisalCondition.SplitCamelCase();
                        }
                        // Need to refactor this later we don't want to add empty fees in list
                        var additionalItems = 7 - ( loanWithAppraisals.OrderAppraisals[ i ].OrderAppraisalProductsFees != null ? loanWithAppraisals.OrderAppraisals[ i ].OrderAppraisalProductsFees.Count : 0 );

                        for ( var j = 0; j < additionalItems; j++ )
                        {
                            loanWithAppraisals.OrderAppraisals[ i ].OrderAppraisalProductsFees.Add( new OrderAppraisalProductFee() );
                        }
                    }
                  

                    userAppraisalViewModel.ActualInvestor = LoanServiceFacade.RetrieveInvestorName(userAppraisalViewModel.Loan.ProgramName).InvestorName;

                } 

            }
            else
            {
                userAppraisalViewModel.Loan.OrderAppraisals.Add(new OrderAppraisalFull());
            }
        }
         

        /// <summary>
        /// Get phone numbers
        /// </summary>
        /// <param name="userAppraisalViewModel">Appraisal view model</param>
        private void LoadPhoneNumbers( AppraisalViewModel userAppraisalViewModel )
        {
            if ( userAppraisalViewModel.Loan.Borrower != null )
            {
                foreach ( PhoneNumber phoneNumber in userAppraisalViewModel.Loan.Borrower.PhoneNumbers )
                {
                    switch ( phoneNumber.PhoneNumberType )
                    {
                        case ( int )PhoneNumberType.Home:
                            userAppraisalViewModel.HomePhone = phoneNumber.Number;
                            break;
                        case ( int )PhoneNumberType.Work:
                            userAppraisalViewModel.WorkPhone = phoneNumber.Number;
                            break;
                        case ( int )PhoneNumberType.Cell:
                            userAppraisalViewModel.CellPhone = phoneNumber.Number;
                            break;
                    }

                    if ( phoneNumber.Preferred )
                    {
                        userAppraisalViewModel.Preferred = phoneNumber.PhoneNumberType;
                    }
                }
            }

        }

        private void LoadDisclosureSummary(AppraisalViewModel userAppraisalViewModel, Guid loanId, UserAccount user)
        {
            DisclosuresSummaryInfo disclosuresSummaryInfo = DocumentsServiceFacade.RetrieveDisclosuresSummaryInfo(loanId, user.UserAccountId);

            userAppraisalViewModel.DisclosuresSummaryInfo = disclosuresSummaryInfo;

            var channel = CompanyProfileServiceFacade.GetChannelByChannelId(userAppraisalViewModel.Loan.ChannelId);

            var activateOrderAppraisal = false;

            if (channel != null && channel.ActivateOrderAppraisalSettings != null)
            {
                switch (channel.ActivateOrderAppraisalSettings.DisclosuresESignTriggerType)
                {
                    case (int)OrderAppraisalTriggerEnum.FirstIntentToProceed:
                        IntegrationsSettings integrationSettings = LoanServiceFacade.RetrieveIntegrationsSettings(user.UserAccountId);
                        activateOrderAppraisal = (disclosuresSummaryInfo.IntentToProceedReceivedBorrower != null && disclosuresSummaryInfo.IntentToProceedReceivedCoBorrower != null) || (disclosuresSummaryInfo.IntentToProceedReceivedBorrower != null && integrationSettings != null && !integrationSettings.AllBorrowersMustESign);
                        break;
                    case (int)OrderAppraisalTriggerEnum.LastIntentToProceed:
                        activateOrderAppraisal = DocumentsServiceFacade.CheckItpSetForAllLoanApplications(loanId, user.UserAccountId);
                        break;
                    case (int)OrderAppraisalTriggerEnum.GFEandDisclosureActivity:
                        var activity = ActivitiesServiceFacade.RetrieveActivity(loanId, ActivityType.ReviewDisclosures, user.UserAccountId);
                        activateOrderAppraisal = channel.ActivateOrderAppraisalSettings.DisclosuresESignStatus == (int)ActivityStatus.Completed || channel.ActivateOrderAppraisalSettings.DisclosuresESignStatus == (int)ActivityStatus.Submitted;
                        if (((int)activity.Status == channel.ActivateOrderAppraisalSettings.DisclosuresESignStatus && channel.ActivateOrderAppraisalSettings.DisclosuresESignStatus == (int)ActivityStatus.Submitted) || activity.Status == ActivityStatus.Completed)
                            activateOrderAppraisal = true;
                        break;
                }
            }

            userAppraisalViewModel.IsAppraisalDisabled = !activateOrderAppraisal;

        }


        private void LoadComboData( AppraisalViewModel userAppraisalViewModel, UserAccount user )
        {
            userAppraisalViewModel.States.Clear();
            userAppraisalViewModel.PropertyTypes.Clear();
            userAppraisalViewModel.OcupancyTypes.Clear();
            userAppraisalViewModel.PhoneTypes.Clear();
            userAppraisalViewModel.CrediCardTypes.Clear();
            userAppraisalViewModel.AppraisalAccessInfo.Clear();
            userAppraisalViewModel.AppraisalProducts.Clear();

            if ( !userAppraisalViewModel.States.Any( s => s.Text == _genericItem.Text ) )
                userAppraisalViewModel.States.Add( _genericItem );
            if ( !userAppraisalViewModel.PropertyTypes.Any( pt => pt.Text == _genericItem.Text ) )
                userAppraisalViewModel.PropertyTypes.Add( _genericItem );
            if ( !userAppraisalViewModel.OcupancyTypes.Any( ot => ot.Text == _genericItem.Text ) )
                userAppraisalViewModel.OcupancyTypes.Add( _genericItem );
            //if ( !userAppraisalViewModel.PhoneTypes.Any( ph => ph.Text == _genericItem.Text ) )
            //    userAppraisalViewModel.PhoneTypes.Add( _genericItem );
            if ( !userAppraisalViewModel.CrediCardTypes.Any( cc => cc.Text == _genericItem.Text ) )
                userAppraisalViewModel.CrediCardTypes.Add( _genericItem );
            if ( !userAppraisalViewModel.AppraisalAccessInfo.Any( aa => aa.Text == _genericItem.Text ) )
                userAppraisalViewModel.AppraisalAccessInfo.Add( _genericItem );
            if ( !userAppraisalViewModel.AppraisalProducts.Any( ap => ap.Text == _genericItem.Text ) )
                userAppraisalViewModel.AppraisalProducts.Add( _genericItem );


            LookupCollection states = LookupServiceFacade.Lookup( LookupKeywords.States, user.UserAccountId );
            LookupCollection propertyTypes = LookupServiceFacade.Lookup( LookupKeywords.PropertyTypeSubjectProperty, user.UserAccountId );
            LookupCollection phoneTypes = LookupServiceFacade.Lookup( LookupKeywords.PhoneType, user.UserAccountId );
            LookupCollection crediCardTypes = LookupServiceFacade.Lookup( LookupKeywords.AppraisalCardTypes, user.UserAccountId );
            LookupCollection occupancyTypes = LookupServiceFacade.Lookup( LookupKeywords.OccupancyType, user.UserAccountId );
            LookupCollection appraisalAccessInfo;
       
            if (userAppraisalViewModel.Loan.LoanType == LoanTransactionType.Purchase)
            {
                appraisalAccessInfo = LookupServiceFacade.Lookup( LookupKeywords.AppraisalBusinessContactPurchase, user.UserAccountId );
            }
            else
                appraisalAccessInfo = LookupServiceFacade.Lookup( LookupKeywords.AppraisalBusinessContactRefinance, user.UserAccountId );

            foreach ( var state in states )
            {
                userAppraisalViewModel.States.Add( new SelectListItem()
                {
                    Text = state.Name,
                    Value = state.Value.ToString(),
                    //Selected = ( state.Value == userAppraisalViewModel.StateId )
                    Selected = ( state.Value == userAppraisalViewModel.Loan.SubjectProperty.Address.StateId )
                } );
            }

            foreach ( var propertyType in propertyTypes )
            {
                userAppraisalViewModel.PropertyTypes.Add( new SelectListItem()
                {
                    Text = propertyType.Name,
                    Value = propertyType.StringValue,
                    //Selected = ( propertyType.Value == userAppraisalViewModel.PropertyTypeId )
                    Selected = ( propertyType.Value == ( int )userAppraisalViewModel.Loan.SubjectProperty.PropertyType )
                } );
            }

            foreach ( var ocupancyType in occupancyTypes )
            {
                userAppraisalViewModel.OcupancyTypes.Add( new SelectListItem()
                {
                    Text = ocupancyType.Name,
                    Value = ocupancyType.StringValue,
                    //Selected = ( ocupancyType.Value == userAppraisalViewModel.OcupancyTypeId )
                    Selected = ( ocupancyType.Value == ( int )userAppraisalViewModel.Loan.SubjectProperty.OccupancyType )
                } );
            }

            foreach ( var phoneType in phoneTypes )
            {
                userAppraisalViewModel.PhoneTypes.Add( new SelectListItem()
                {
                    Text = phoneType.Name,
                    Value = phoneType.Value.ToString(),
                    //Selected = ( phoneType.Value == userAppraisalViewModel.Loan.Borrower.PhoneNumbers.PhoneTypeId )
                } );
            }

            foreach ( var crediCardType in crediCardTypes )
            {
                userAppraisalViewModel.CrediCardTypes.Add( new SelectListItem()
                {
                    Text = crediCardType.Name,
                    Value = crediCardType.Value.ToString(),
                    //Selected = ( crediCardType.Value == (int)userAppraisalViewModel.OrderAppraisals[0].BillingInformation.CreditCardType )
                } );
            }

            foreach ( var appraisalAccess in appraisalAccessInfo )
            {
                userAppraisalViewModel.AppraisalAccessInfo.Add( new SelectListItem()
                {
                    Text = appraisalAccess.Name,
                    Value = appraisalAccess.Value.ToString(),
                    Selected = ( appraisalAccess.Value == userAppraisalViewModel.AppraisalAccessInfoId )
                } );
            }


            //Years
            userAppraisalViewModel.Years.Add( new SelectListItem()
                                                  {
                                                      Text = "(Select year)",
                                                      Value = "-1",
                                                      Selected = true
                                                  } );

            int now = DateTime.Now.Year;

            if ( userAppraisalViewModel != null && userAppraisalViewModel.Loan != null && userAppraisalViewModel.Loan.OrderAppraisals != null
                && userAppraisalViewModel.Loan.OrderAppraisals.Count > 0 && userAppraisalViewModel.Loan.OrderAppraisals[ 0 ].BillingInformation != null
                && userAppraisalViewModel.Loan.OrderAppraisals[ 0 ].BillingInformation.ExpirationDate != null
                && userAppraisalViewModel.Loan.OrderAppraisals[ 0 ].BillingInformation.ExpirationDate > DateTime.MinValue && userAppraisalViewModel.Loan.OrderAppraisals[ 0 ].BillingInformation.ExpirationDate.Year < now )
            {
                userAppraisalViewModel.Years.FirstOrDefault( x => x.Selected ).Selected = false;
                userAppraisalViewModel.Years.Add( new SelectListItem()
                {
                    Text = ( userAppraisalViewModel.Loan.OrderAppraisals[ 0 ].BillingInformation.ExpirationDate.Year ).ToString(),
                    Value = ( userAppraisalViewModel.Loan.OrderAppraisals[ 0 ].BillingInformation.ExpirationDate.Year ).ToString(),
                    Selected = true
                } );
            }

            for ( int i = 0; i < 11; i++ )
            {
                userAppraisalViewModel.Years.Add( new SelectListItem()
                                                  {
                                                      Text = ( now + i ).ToString(),
                                                      Value = ( now + i ).ToString(),
                                                      Selected = false
                                                  } );
            }

            

            //Products
            var products = ProductServiceFacade.RetrieveProducts( new RetrieveProducts() { ProductId = null } );

            if ( products != null )
            {

                foreach ( var product in products )
                {
                    userAppraisalViewModel.AppraisalProducts.Add( new SelectListItem()
                    {
                        Text = product.Name,
                        Value = product.Value
                    } );
                }

            }
        }

        private void GetProductsAndFees( AppraisalViewModel userAppraisalViewModel, int position )
        {

            // Create request object
            AppraisalProductRequest request = new AppraisalProductRequest()
            {
                MortgageType = userAppraisalViewModel.Loan.MortgageType.GetStringValue(),
                EstimatedPropertyValue = ( double )userAppraisalViewModel.Loan.SubjectProperty.CurrentEstimatedValue,
                NoOfUnits = userAppraisalViewModel.Loan.SubjectProperty.NumberOfUnits.ToString(),
                OccupancyType = userAppraisalViewModel.Loan.SubjectProperty.OccupancyType.GetStringValue(),
                PropertyAddressCounty = userAppraisalViewModel.Loan.SubjectProperty.Address.CountyName,
                PropertyAddressState = userAppraisalViewModel.Loan.SubjectProperty.Address.StateName,
                PropertyType = userAppraisalViewModel.Loan.SubjectProperty.PropertyType.GetStringValue()
            };



            // Call iMP platform
            var results = new Proxy().Send( "GETAppraisalProductsWithFees", new Dictionary<string, object> { { "AppraisalProductRequest", request }, { "RequiresConversion", false } } );

            // Get results
            object responseMessageSuccess;
            results.TryGetValue( "AppraisalProductResponse", out responseMessageSuccess );
            AppraisalProductResponse response = responseMessageSuccess as AppraisalProductResponse;

            if ( response != null )
            {
                userAppraisalViewModel.Loan.OrderAppraisals[ position ].OrderAppraisalProductsFees = new List<OrderAppraisalProductFee>();
                
                decimal totalFee = 0;

                foreach ( ProductWithFee prod in response.Product )
                {
                    OrderAppraisalProductFee orderAppraisalProductFee = new OrderAppraisalProductFee();

                    if ( prod.ProductType != null )
                    {
                        orderAppraisalProductFee.ProductValue = prod.ProductType.Product.Value;
                        orderAppraisalProductFee.ProductMessage = prod.ProductType.Message;
                        orderAppraisalProductFee.ProductMessageStatus = prod.ProductType.Status;
                    }
                    if ( prod.ProductFee != null )
                    {
                        orderAppraisalProductFee.FeeAmount = ( decimal )prod.ProductFee.Fee;
                        orderAppraisalProductFee.FeeMessage = prod.ProductFee.Message;
                        orderAppraisalProductFee.FeeMessageStatus = prod.ProductFee.Status;
                        orderAppraisalProductFee.FeeComment = prod.ProductFee.Comment;

                        totalFee += orderAppraisalProductFee.FeeAmount ?? 0;
                    }

                    userAppraisalViewModel.Loan.OrderAppraisals[ position ].OrderAppraisalProductsFees.Add(orderAppraisalProductFee);
                    
                }

                userAppraisalViewModel.Loan.OrderAppraisals[ position ].PaymentAmount = totalFee;
            }

        }
    }
}
