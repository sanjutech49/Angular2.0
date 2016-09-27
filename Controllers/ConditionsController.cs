using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using APS.ServiceProxy;
using MML.Calculator;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.iMP.DocumentVault.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.ViewModels.Conditions;
using MML.iMP.Common.Configuration;
using MML.Services;
using MML.iMP.DocumentVault.Common;

namespace MML.Web.LoanCenter.Controllers
{
    public class ConditionsController : Controller
    {
        private readonly EnterpriseCacheAdapter _cacheProvider = new EnterpriseCacheAdapter();
        private const string ENVIRONMENT = "Environment";
        private const string KEY_DEFAULTCATEGORIES_BORROWER = "Condition.DefaultCategories.Borrower";
        private const string KEY_DEFAULTCATEGORIES_PARTY = "Condition.DefaultCategories.Property";
        private const string KEY_CONDITIONTYPE_PROPERTY = "Condition.Type.Property";
        private const string KEY_CONDITIONTYPE_BORROWER = "Condition.Type.Borrower";
        public JsonResult GetConditionsData( Guid loanId )
        {
            try
            {
                var model = RetrieveConditionsData(loanId);
                return model == null ? Json(new { success = false, message = "An error occuried while loading data. Please contact support for more information." }, JsonRequestBehavior.AllowGet) : Json(model, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                TraceHelper.Error(TraceCategory.LoanCenterController,
                                 "An error occurred in ConditionsController! GetConditionsData(Guid loanId)", ex);
                return Json(new { success = false, message = "An error occuried while loading data. Please contact support for more information." }, JsonRequestBehavior.AllowGet);
            }
          
        }

        /// <summary>
        /// Gets the privileges for the stips and conditions tab.
        /// </summary>
        /// <returns>Privileges viewmodel object.</returns>
        private Privileges GetConditionsPrivileges()
        {
            return new Privileges
            {
                ViewTab = AccountHelper.HasPrivilege( PrivilegeName.ConditionsViewTab ),
                Delete = AccountHelper.HasPrivilege( PrivilegeName.ConditionsDelete ),
                ChangeItemStatus = AccountHelper.HasPrivilege( PrivilegeName.ConditionsItemChangeStatus )
            };
        }

        private UserInfo GetCurrentUser()
        {
            var currentUser = new UserInfo();
            var user = (UserAccount)HttpContext.Session[SessionHelper.UserData];
            if ( user != null )
            {
                currentUser.UserAccountId = user.UserAccountId;
                currentUser.UserName = String.Format( "{0} {1}", user.Party.FirstName, user.Party.LastName );
            }
            return currentUser;
        }

        private IEnumerable<Role> GetCurrentUserRoles()
        {
            IEnumerable<Role> roles = null;
            var user = (UserAccount)HttpContext.Session[SessionHelper.UserData];
            if (user != null)
            {
                roles = user.Roles;
            }
            return roles.SafeEnumerate<Role>();
        }

        private UserInfo GetUserByUserAccountId(int userAccountId)
        {
            var currentUser = new UserInfo();
            UserAccount user = UserAccountServiceFacade.GetUserById(userAccountId);
            if (user != null)
            {
                currentUser.UserAccountId = user.UserAccountId;
                currentUser.UserName = String.Format("{0} {1}", user.Party.FirstName, user.Party.LastName);
            }
            return currentUser;
        }

        public JsonResult GetConditionHistoryItems( Guid conditionId )
        {
            var conditionHistory = StipsAndConditionsFacade.LoadConditionHistory(conditionId);
            ConditionHistory previous = null;
            foreach (var history in conditionHistory)
            {
                if ((previous == null || history.Comments != previous.Comments) && !String.IsNullOrEmpty(history.Comments))
                    history.Display = true;
                previous = history;
            }
            var commentHistoryItems = conditionHistory.Where(h => h.Display).OrderByDescending(h => h.DateCreated).Select(history => new ConditionCommentHistoryViewModel()
            {
                Comment = history.Comments,
                UpdatedBy = UserAccountServiceFacade.GetUserFullNameByUserAccountId(history.UserAccountCreatedId),
                Date = history.DateCreated.ToString("MM/dd/yyyy hh:mm tt")
            }).ToList().OrderByDescending(h => h.Date);

            return Json(commentHistoryItems, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetItemHistory( Guid itemId )
        {
            var itemHistory = StipsAndConditionsFacade.LoadItemHistory(itemId);
            var conditionsMainViewModel = Session[SessionHelper.ConditionsMainViewModel] as ConditionsMainViewModel;
            CurativeItemHistory previous = null;
            var commentHistoryItems = new List<ItemHistoryViewModel>();
            foreach (var curativeItemHistory in itemHistory.OrderByDescending(h => h.DateCreated))
            {

                if ((previous == null || curativeItemHistory.StatusCdId != previous.StatusCdId))
                    commentHistoryItems.Add(new ItemHistoryViewModel()
                    {
                        Status = conditionsMainViewModel.ConditionsSub.StatusList.Exists(a => a.EnumerationValueId == curativeItemHistory.StatusCdId) ?
                          conditionsMainViewModel.ConditionsSub.StatusList.FirstOrDefault(a => a.EnumerationValueId == curativeItemHistory.StatusCdId).Code : String.Empty,
                        UpdatedBy = UserAccountServiceFacade.GetUserFullNameByUserAccountId(curativeItemHistory.UserAccountCreatedId),
                        Date = curativeItemHistory.DateCreated.ToString("MM/dd/yyyy hh:mm tt")
                    });
                previous = curativeItemHistory;
            }

            return Json(commentHistoryItems, JsonRequestBehavior.AllowGet);
   
        }

        public JsonResult GetDecisionStatusHistory( Guid loanId )
        {
            if (loanId == null || loanId == Guid.Empty)
                return Json(null);

            List<DecisionStatusHistory> history = LoanServiceFacade.RetrieveLoanDecisionStatusHistory(loanId);
            if (history != null)
            {
                List<LoanDecisionStatusHistoryViewModel> viewmodel = ConvertDecisionStatusHistoryToViewModel(history);
                return Json(viewmodel, JsonRequestBehavior.AllowGet);
            }
            return Json(null);
        }

        private List<LoanDecisionStatusHistoryViewModel> ConvertDecisionStatusHistoryToViewModel(List<DecisionStatusHistory> decisionStatusHistoryList)
        {
            var viewModel = new List<LoanDecisionStatusHistoryViewModel>();
            var lookups = StipsAndConditionsFacade.LoadLookups();
            var statusTypes = lookups.EnumerationConfiguration
                .Where(ec => ec.Key == "LoanDecisionStatus")
                .Select(ec => ec.Value)
                .FirstOrDefault();

            foreach(DecisionStatusHistory decisionStatusHistory in decisionStatusHistoryList)
            {
                var statusCode = String.Empty;
                if (statusTypes != null)
                {
                    var status = statusTypes.Where(ec => ec.EnumerationValueId == decisionStatusHistory.NewDecisionStatus)
                    .FirstOrDefault();

                    statusCode = status != null ? status.Code : String.Empty;
                }

                viewModel.Add(new LoanDecisionStatusHistoryViewModel
                {

                    Status = statusCode,
                    UpdatedBy = GetUserByUserAccountId(decisionStatusHistory.UserAccountId).UserName,
                    Date = decisionStatusHistory.DateModified.ToString("MM/dd/yyyy hh:mm tt")
                });
            }
            return viewModel;
        }

        /// <summary>
        /// Maps the Loan and LoanSummary properties to view model object.
        /// </summary>
        /// <param name="loanWithSummary"></param>
        /// <returns></returns>
        private ConditionsLoanSummaryViewModel InitializeViewModelFromLoanWithSummary( LoanWithSummary loanWithSummary )
        {
            var viewModel = new ConditionsLoanSummaryViewModel();

            // Set the default label text.
            viewModel.ValueLabel = "Estimated Value";

            if ( loanWithSummary == null )
                return viewModel;

            var qualRateCalculator = new QualifyingRateCalculator();
            var loanHelper = new LoanDataHelper();

            // Map the loan details.
            if ( loanWithSummary.Loan != null )
            {
                viewModel.DecisionScore = LoanServiceFacade.GetBorrowerMiddleLowestFicoScore( loanWithSummary.Loan.LoanId );
                viewModel.LoanPosition = (short)loanWithSummary.Loan.LoanLienPositions.Where( p => p.Checked ).FirstOrDefault().LienPosition;
                viewModel.AmortType = loanWithSummary.Loan.AmortizationType.GetStringValue();
                viewModel.Cltv = loanWithSummary.Loan.Cltv;
                viewModel.Dti = loanWithSummary.Loan.DebtToIncomeRatio.GetValueOrDefault();
                viewModel.Hcltv = loanWithSummary.Loan.Hcltv;
                viewModel.HousingExpense = loanWithSummary.Loan.HousingRatio.GetValueOrDefault();
                viewModel.NoteRate = (decimal)loanWithSummary.Loan.Rate;
                viewModel.QualRate = loanWithSummary.Loan.QualifyingRate.SafeToString();
                viewModel.DecisionStatus = loanWithSummary.Loan.DecisionStatus;

                // Map the lock expiration date and build strings for view.
                if ( loanWithSummary.Loan.LockStatus == LockStatus.Locked )
                {
                    viewModel.IsLocked = true;
                    var lockExpireDate = loanWithSummary.Loan.LockExpireDate.GetValueOrDefault();
                    if ( lockExpireDate != DateTime.MinValue )
                        viewModel.LockExpirationDate = lockExpireDate.ToString( "MM/dd/yyyy" );

                    int? lockExpirationNumber = loanHelper.CalculateLockExpirationNumber( lockExpireDate );
                    viewModel.LockExpirationText = loanHelper.BuildLockExpirationText( lockExpirationNumber );
                    viewModel.LockExpirationNumber = lockExpirationNumber.SafeToString();
                }

                // Map the subject property estimated/appraised value.
                if ( loanWithSummary.Loan.SubjectProperty != null )
                {
                    if ( loanWithSummary.Loan.SubjectProperty.AppraisedValue.GetValueOrDefault() > 0 )
                    {
                        viewModel.EstimatedValue = loanWithSummary.Loan.SubjectProperty.AppraisedValue.GetValueOrDefault();
                        viewModel.ValueLabel = "Appraised Value";
                    }
                    else
                        viewModel.EstimatedValue = loanWithSummary.Loan.SubjectProperty.CurrentEstimatedValue.GetValueOrDefault();
                }
                viewModel.LoanLockHistoryData = LoanServiceFacade.RetrieveLoanLockHistoryData(loanWithSummary.Loan.LoanId);
            }

            // Map loan summary details.
            if ( loanWithSummary.LoanSummary != null )
            {

                viewModel.AusType = qualRateCalculator.GetAusTypes( loanWithSummary.LoanSummary.ProductRules );
                var investorProductRule = loanWithSummary.LoanSummary.ProductRules.FirstOrDefault();
                if (investorProductRule != null)
                {
                    viewModel.InvestorWebSiteUrl = investorProductRule.InvestorWebsiteURL;
                }
                viewModel.LoanType = loanWithSummary.LoanSummary.LoanTypeDescription;
                viewModel.MortgageType = loanWithSummary.LoanSummary.MortgageType.GetStringValue();
                viewModel.NumberOfUnitsOrStories = loanWithSummary.LoanSummary.NumberOfUnitStories;
                viewModel.Occupancy = loanWithSummary.LoanSummary.Occupancy.GetSplitedStringValue();
                viewModel.Product = loanWithSummary.LoanSummary.LoanProgramName;
                viewModel.PropertyType = loanWithSummary.LoanSummary.PropertyType.GetSplitedStringValue();
                viewModel.PurchasePrice = loanWithSummary.LoanSummary.PurchasePrice;
                viewModel.Subordinate = loanWithSummary.LoanSummary.Subordinate;
                viewModel.Term = loanWithSummary.LoanSummary.LoanAmortizationTerm;

                // Map the loan summary current information.
                if ( loanWithSummary.LoanSummary.CurrentInformation != null )
                {
                    viewModel.LoanAmount = loanWithSummary.LoanSummary.CurrentInformation.LoanAmount;
                    viewModel.Ltv = loanWithSummary.LoanSummary.CurrentInformation.Ltv;
                }
            }

            // Return the initialized view model.
            return viewModel;
        }


        private void InitializeDocuments( ConditionsMainViewModel conditionsMainViewModel )
        {
            const string docVaultStringFormat = "MM/dd/yy h:mm tt";
            List<VaultDocument> loanVaultDocumentList = null;
            IDictionary<string, object> iMPResult = null;

            try
            {
                var request = new FilterVaultDocumentListParameters
                {
                    TenantKey = "NewLeafLending",
                    Originator = "LoanId",
                    OriginatorReference = conditionsMainViewModel.LoanId.ToString()
                    // For testing purposes use this loanId which has prepared documents: OriginatorReference = "7a49ed2e-c9be-4b9c-8735-dde420355b7c"
                };

                iMPResult = new Proxy().Send( "DocVault_GetFilteredVaultDocuments", new Dictionary<string, object> { { "InFilterParameters", request } } );
            }
            catch ( Exception ex )
            {
                var errorMessage = "LoanCenter::ConditionsController - Failed to call iMP - DocVault_GetFilteredVaultDocuments. Loan Id: {0}";
                TraceHelper.Error( TraceCategory.LoanCenter, string.Format( errorMessage, conditionsMainViewModel.LoanId ), ex );
            }

            if ( iMPResult == null )
            {
                return;
            }

            object responseMessageSuccess;
            iMPResult.TryGetValue( "OutVaultDocumentList", out responseMessageSuccess );

            var filterVaultDocumentListRetrieved = responseMessageSuccess as FilterVaultDocumentListRetrieved;

            if ( filterVaultDocumentListRetrieved != null && filterVaultDocumentListRetrieved.VaultDocumentList != null )
            {
                loanVaultDocumentList = filterVaultDocumentListRetrieved.VaultDocumentList;
            }

            if ( loanVaultDocumentList == null )
            {
                return;
            }

            foreach ( var document in loanVaultDocumentList )
            {
				var conditionsDocument = new ConditionsDocument
                {
                    DocumentId = document.DocumentId.ToString(),
                    Category = document.DocumentType != null && document.DocumentType.Class != null ? document.DocumentType.Class.ToUpper() : "",					
                    Name = document.Name,
                    LastUpdated = document.ClassificationDate == DateTime.MinValue ? document.DateCreated.ToString( docVaultStringFormat ) : document.ClassificationDate.ToString( docVaultStringFormat ),
                    UploadedBy = document.User,
                    UploadedDate = document.DateCreated.ToString( docVaultStringFormat ),
                    Excluded = false,
                    DocumentTypeId = document.DocumentType != null ? document.DocumentType.DocumentTypeId : -1,
                    Rejected = document.Rejected,
                    Description = document.DocumentType != null ? document.DocumentType.Description ?? String.Empty : String.Empty,
                    NamingConvention = document.DocumentType != null ? document.DocumentType.NamingConvention : String.Empty
                };

                conditionsDocument.OriginalCategory = conditionsDocument.Category;
                conditionsDocument.OriginalDocumentTypeId = conditionsDocument.DocumentTypeId;

                var borrowerNames = document.Metadata.FirstOrDefault(m => m.Key == "BorrowerNames");
                if (borrowerNames != null)
                    conditionsDocument.BorrowerNames = borrowerNames.Value;

                var bankName = document.Metadata.FirstOrDefault(m => m.Key == "BankName");
                if (bankName != null)
                    conditionsDocument.BankName = bankName.Value;

                var accountNumber = document.Metadata.FirstOrDefault(m => m.Key == "AccountNumber");
                if (accountNumber != null)
                    conditionsDocument.AccountNumber = accountNumber.Value;

                Guid relatedRepositoryId = Guid.Empty;
                Guid.TryParse( document.RepositoryId, out relatedRepositoryId );

                conditionsDocument.RepositoryId = relatedRepositoryId;

                if ( conditionsMainViewModel.ConditionsSub != null && conditionsMainViewModel.ConditionsSub.Conditions != null && relatedRepositoryId != Guid.Empty )
                {
                    var conditionsWithAssociatedDocument = conditionsMainViewModel.ConditionsSub.Conditions.Where( c => c.CurativeItems.Any( i => i.RepositoryId == relatedRepositoryId ) );
                    if ( conditionsWithAssociatedDocument.Count() == 0 && conditionsDocument.Category.ToLower() != "unclassified" && conditionsDocument.Category.ToLower() != "rejected" )
                        conditionsDocument.Category = "unassigned".ToUpper();
                }

                if (conditionsDocument.Rejected)
                {
                    conditionsDocument.Category = "rejected".ToUpper();
                }

                switch ( conditionsDocument.Category.ToLower() )
                {
                    case "unclassified":
                        conditionsDocument.CategorySortName = "01";
                        break;
                    case "unassigned":
                        conditionsDocument.CategorySortName = "02";
                        break;
                    case "rejected":
                        conditionsDocument.CategorySortName = "03";
                        break;
                    default:
                        conditionsDocument.CategorySortName = "";
                        break;
                }

                conditionsDocument.CategorySortName += conditionsDocument.Category;

				conditionsMainViewModel.ConditionsDocuments.Add( conditionsDocument );				
            }
        }

        /// <summary>
        /// Build unclassified document's name based on naming convention rules defined for each document type
        /// </summary>
        /// <param name="document"></param>
        /// <returns>New document's name</returns>
        public JsonResult BuildVaultDocumentName(ConditionsDocument document)
        {
            try
            {
                if (document == null)
                    throw new ArgumentException("BuildVaultDocumentName - document is null");

                var documentName = document.Description;
                var namingConvention = document.NamingConvention;
                var description = document.Description;
                var allDocumentTypes = RetrieveAllVaultDocumentTypes();
                if (allDocumentTypes != null)
                {
                    var newDocType = allDocumentTypes.FirstOrDefault(d => d.DocumentTypeId == document.DocumentTypeId);
                    if (newDocType != null)
                    {
                        namingConvention = newDocType.NamingConvention;
                        description = newDocType.Description;
                    }
                }

                var metadata = new List<VaultMetadata>();
                if (!String.IsNullOrWhiteSpace(document.BorrowerNames))
                    metadata.Add(new VaultMetadata() { Key = "Borrower Name(s)", Value = document.BorrowerNames });
                if (!String.IsNullOrWhiteSpace(document.BorrowerNames))
                    metadata.Add(new VaultMetadata() { Key = "Bank Name", Value = document.BankName });
                if (!String.IsNullOrWhiteSpace(document.BorrowerNames))
                    metadata.Add(new VaultMetadata() { Key = "Account Number", Value = document.AccountNumber });

                DocumentVaultHelper docVaultHelper = new DocumentVaultHelper();
                documentName = docVaultHelper.BuildVaultDocumentName(namingConvention, description, metadata);

                return Json(new { documentName = documentName, JsonRequestBehavior.AllowGet });
            }
            catch (Exception ex)
            {
                TraceHelper.Error(TraceCategory.LoanCenterController, "An error occurred in ConditionsController -  BuildVaultDocumentName.", ex);
                return Json(new { success = false, message = "An error occuried while classifying a document. Please contact support for more information." }, JsonRequestBehavior.AllowGet);
            }
        }

        public void InitializeDecisionStatus( ConditionsMainViewModel conditionsMainViewModel, Guid loanId )
            {
            var decisionStatus = LoanServiceFacade.RetrieveLatestDecisionStatusChange(loanId);
            if (decisionStatus != null)
            {
                conditionsMainViewModel.LastChange = new LoanDecisionStatusHistoryViewModel()
            {
                    Status = decisionStatus.NewDecisionStatus.ToString(),
                    UpdatedBy = GetUserByUserAccountId(decisionStatus.UserAccountId).UserName,
                    Date = decisionStatus.DateModified.ToString("MM/dd/yyyy hh:mm tt")
                };
            }
        }

        [HttpPost]
        public JsonResult Save(ConditionsMainViewModel viewModel)
        {
            try
            {
                var conditionsViewModel = viewModel.ConditionsSub.Conditions;
                var conditions = new List<Condition>();
                var previousModel = Session[SessionHelper.ConditionsMainViewModel] as ConditionsMainViewModel;
                conditionsViewModel.Where(con=>!con.IsRemoved || con.ConditionId != Guid.Empty).ToList().ForEach(con => conditions.Add(ConvertDataViewModelToDatabaseModel(con, viewModel.LoanId, previousModel)));
                var conditionsSaved = StipsAndConditionsFacade.SaveConditions(conditions);

                int decisionStatus = (int)viewModel.LoanSummary.DecisionStatus;
                if (decisionStatus != previousModel.LoanSummary.DecisionStatus)
                {
                    var updated = LoanServiceFacade.UpdateLoanDecisionStatus(viewModel.LoanId, decisionStatus, viewModel.CurrentUser.UserAccountId);
                    if (updated)
                    {
                        LoanServiceFacade.InsertLoanDecisionStatusHistory(viewModel.LoanId, previousModel.LoanSummary.DecisionStatus, decisionStatus, viewModel.CurrentUser.UserAccountId);
                    }
                }

                // Save doc vault changes
                bool documentsUpdated = ClassifyVaultDocuments(viewModel.ConditionsDocuments, viewModel.CurrentUser.UserName);

                // Save delivery vault stacking order
                if (viewModel.DeliveryVault != null && viewModel.DeliveryVault.DeliveryVaultStackingOrder != null)
                    DeliveryVault_SaveStackingOrder(viewModel.DeliveryVault.DeliveryVaultStackingOrder);

                // Refresh model
                var model = RetrieveConditionsData(viewModel.LoanId);
                Session[SessionHelper.ConditionsMainViewModel] = model;

                if (model != null)
                    model.Error = conditionsSaved == null || !documentsUpdated;

                return model == null ? Json(new { success = false }) : Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TraceHelper.Error(TraceCategory.LoanCenterController, "An error occurred in ConditionsController!  Save( ConditionsMainViewModel viewModel )", ex);
                return Json(new { success = false, message = "An error occuried while saving data. Please contact support for more information." }, JsonRequestBehavior.AllowGet);
            }
        }

        #region *** RETRIEVE CONDITIONS FROM DATABASE ***

        private ConditionsMainViewModel RetrieveConditionsData( Guid loanId )
        {
            var user = (UserAccount)HttpContext.Session[SessionHelper.UserData];
            var stipsAndConditionsLookups = StipsAndConditionsFacade.LoadLookups();
            if ( stipsAndConditionsLookups == null )
                return null;

            var conditionsMainViewModel = new ConditionsMainViewModel { LoanId = loanId };
            var loanSummary = LoanServiceFacade.RetrieveLoanWithSummary( loanId, user.UserAccountId, retrieveProductRules: true );
            bool isOwnerOccupied = false;
            if (loanSummary.Loan != null && loanSummary.Loan.SubjectProperty != null)
                isOwnerOccupied = loanSummary.Loan.SubjectProperty.OccupancyType == OccupancyType.PrimaryResidence;

            conditionsMainViewModel.LoanSummary = InitializeViewModelFromLoanWithSummary( loanSummary );

            conditionsMainViewModel.Privileges = GetConditionsPrivileges();
            conditionsMainViewModel.CurrentUser = GetCurrentUser();
            conditionsMainViewModel.CurrentUserRoles = GetCurrentUserRoles();
            conditionsMainViewModel.IsOwnerOccupied = isOwnerOccupied;

            InitializeLookupValuesForConditions( conditionsMainViewModel );
            InitializeConditions( conditionsMainViewModel );
            InitializeDataForNewCondition( conditionsMainViewModel );
            InitializeDocuments( conditionsMainViewModel );
            InitializeDeliveryVault( conditionsMainViewModel );
            InitializeDecisionStatus( conditionsMainViewModel, loanId );
            InitialDefaultConditions(conditionsMainViewModel);

            Session[SessionHelper.ConditionsMainViewModel] = conditionsMainViewModel;

            return conditionsMainViewModel;
        }
        

        private string CreateConditionSectionNameForBorrowers( BorrowerCollection borrowers, Guid borrowerId )
        {
            var borrower = borrowers.FirstOrDefault( b => b.BorrowerId == borrowerId );

            var sectionName = String.Format( "{0} {1} {2}", borrower.IsCoBorrower ? "(C)" : "(B)",
                                            borrower.BorrowerPersonalInfo.FirstName,
                                            borrower.BorrowerPersonalInfo.LastName );
            var spouse = borrowers.FirstOrDefault( b => b.LoanId == borrower.LoanId && b.BorrowerId != borrower.BorrowerId );
            if ( spouse == null )
                return sectionName;

            return spouse.IsCoBorrower
                              ? String.Format( "{0}, (C) {1} {2}", sectionName, spouse.BorrowerPersonalInfo.FirstName, spouse.BorrowerPersonalInfo.LastName )
                              : String.Format( "(B) {0} {1}, {2}", spouse.BorrowerPersonalInfo.FirstName, spouse.BorrowerPersonalInfo.LastName, sectionName );

        }

        private string RetrieveSectionName(CurativeItem item, ConditionsMainViewModel conditionsMainViewModel)
        {
            var ownerId = RetrieveItemOwnerId(item);
            if (String.IsNullOrEmpty(ownerId))
                return null;

            return conditionsMainViewModel.ConditionsSub.ForList.Exists(i => i.Id == ownerId)
                              ? conditionsMainViewModel.ConditionsSub.ForList.Where(i => i.Id == ownerId).FirstOrDefault().SectionName : String.Empty;
        }

        private string RetrieveItemOwnerId(CurativeItem item)
        {
            var ownerId = String.Empty;
            switch (item.SourceRoleCdId)
            {
                case (int)SourceRole.JointAccount:
                case (int)SourceRole.CoBorrower:
                case (int)SourceRole.Borrower:
                    ownerId = item.CurativeItemPartyRefs != null && item.CurativeItemPartyRefs.Count > 0
                                  ? item.CurativeItemPartyRefs.First().PartyId.ToString() : String.Empty;
                    break;
                case (int)SourceRole.OtherContact:
                    ownerId = item.CurativeItemPartyRefs != null && item.CurativeItemPartyRefs.Count > 0
                                  ? item.CurativeItemPartyRefs.First().ContactId.ToString() : String.Empty;
                    break;
                case (int)SourceRole.ReoProperty:
                case (int)SourceRole.SubjectProperty:
                    ownerId = item.CurativeItemSubjectPropertyRefs != null && item.CurativeItemSubjectPropertyRefs.Count > 0
                                   ? item.CurativeItemSubjectPropertyRefs.First().AddressId.ToString() : String.Empty;
                    break;
            }
            
            return ownerId;
        }
        private ConditionItemViewModel CreateCurativeItem( ConditionsMainViewModel conditionsMainViewModel, CurativeItem item )
        {
            var ownerId = RetrieveItemOwnerId(item);
            var itemViewModel = new ConditionItemViewModel
            {
                CurativeItemId = item.CurativeItemId,
                Description = item.Comments,
                Status = conditionsMainViewModel.ConditionsSub.StatusList.FirstOrDefault(a => a.EnumerationValueId == item.StatusCdId) ?? new EnumerationValue(),
                PreviouslyAdded = true,
                For = conditionsMainViewModel.ConditionsSub.ForList.FirstOrDefault(i => i.Id == ownerId) ?? new ForConditionMenuModel(),
                UserAccountCreatedId = item.UserAccountCreatedId,
                DueDate = item.DueDate,
                DateCreated = item.DateCreated,
                Notes = InitializeCurativeItemNotes(item.CurativeItemNotes).ToList(),
                Item = conditionsMainViewModel.ConditionsSub.ItemsList.FirstOrDefault(a => a.EnumerationValueId == item.DocTypeId) ?? new EnumerationValue(),
                RepositoryId = item.CurativeItemFileRef != null ? item.CurativeItemFileRef.FileId : Guid.Empty,
                HistoryExists = item.CurativeItemHistoryExist,
                UpdatedBy = item.UpdatedBy,
                UpdatedDate = item.UpdatedDate.ToString("MM/dd/yyyy hh:mm tt"),
                Document = item.CurativeItemFileRef != null ? new ConditionsDocument() {  RepositoryId = item.CurativeItemFileRef.FileId  } : null
            };

            return itemViewModel;
        }

        /// <summary>
        /// Maps the curative item notes from the model to the viewmodel.
        /// </summary>
        /// <param name="curativeItemNotes"></param>
        /// <returns></returns>
        private IEnumerable<ViewModels.Conditions.CurativeItemNote> InitializeCurativeItemNotes( IEnumerable<Contracts.CurativeItemNote> curativeItemNotes )
        {
            var retVal = new List<ViewModels.Conditions.CurativeItemNote>();

            if ( curativeItemNotes == null )
                return retVal;

            foreach ( var curativeItemNote in curativeItemNotes )
            {
                bool markAsUnread;
                curativeItemNote.StatusCdId.SafeToString().TryParseToBool( out markAsUnread );

                retVal.Add( new ViewModels.Conditions.CurativeItemNote()
                {
                    Content = curativeItemNote.Content,
                    DateCreated = curativeItemNote.DateCreated.ToString( "MM/dd/yyyy hh:mmtt" ),
                    UserAccountCreatedId = curativeItemNote.UserAccountCreatedId,
                    UserAccountCreatedUserName = curativeItemNote.UserAccountCreatedUserName,
                    CurativeItemId = curativeItemNote.CurativeItemId,
                    CurativeItemNoteId = curativeItemNote.CurativeItemNoteId,
                    MarkAsUnread = markAsUnread,
                    AddNoteToFile = curativeItemNote.AddNoteToFile
                } );
            }

            return retVal;
        }

        /// <summary>
        /// Maps the curative item notes from the viewmodel to the model.
        /// </summary>
        /// <param name="curativeItemNotes"></param>
        /// <returns></returns>
        private IEnumerable<Contracts.CurativeItemNote> ParseViewModelCurativeItemNotesToModel( IEnumerable<ViewModels.Conditions.CurativeItemNote> curativeItemNotes )
        {
            var retVal = new List<Contracts.CurativeItemNote>();

            if ( curativeItemNotes == null )
                return retVal;

            foreach ( var curativeItemNote in curativeItemNotes )
            {
                DateTime dateCreated;
                DateTime.TryParse( curativeItemNote.DateCreated, out dateCreated );

                retVal.Add( new Contracts.CurativeItemNote
                {
                    Content = curativeItemNote.Content,
                    DateCreated = dateCreated,
                    UserAccountCreatedId = curativeItemNote.UserAccountCreatedId,
                    UserAccountCreatedUserName = curativeItemNote.UserAccountCreatedUserName,
                    CurativeItemId = curativeItemNote.CurativeItemId,
                    CurativeItemNoteId = curativeItemNote.CurativeItemNoteId,
                    StatusCdId = curativeItemNote.MarkAsUnread ? 1 : 0,
                    AddNoteToFile = curativeItemNote.AddNoteToFile
                } );
            }

            return retVal;
        }

        private List<EnumerationValue> RetrieveDefaultCategories(string key, string environment, ConditionsMainViewModel conditionsMainViewModel)
        {
            var categoryNames = new List<String>();
            var retVal = new List<EnumerationValue>();
            var configurationValue = Client.Instance.GetConfigurationValue(key, environment, new string[] { });
            string[] delimitedValues = configurationValue.Split(new char[] { ';' });

            if (delimitedValues != null)
                foreach (string value in delimitedValues)
                    categoryNames.Add((String)Convert.ChangeType(value.Trim(), typeof(String)));
            
            foreach (var name in categoryNames)
            {
                if(conditionsMainViewModel.ConditionsSub.CategoryList.Any(a => a.Code.ToLower() == name.ToLower()))
                    retVal.Add(conditionsMainViewModel.ConditionsSub.CategoryList.FirstOrDefault(a => a.Code.ToLower() == name.ToLower()));
            }

            return retVal;

        }
        private void InitialDefaultConditions(ConditionsMainViewModel conditionsMainViewModel)
        {
            var defaultCategoryListBorrower = RetrieveDefaultCategories(KEY_DEFAULTCATEGORIES_BORROWER, ENVIRONMENT, conditionsMainViewModel);
            var defaultCategoryListProperty = RetrieveDefaultCategories(KEY_DEFAULTCATEGORIES_PARTY, ENVIRONMENT, conditionsMainViewModel);

            foreach(var section in conditionsMainViewModel.ConditionsSub.ForList)
            {
                foreach (var defaultCategory in defaultCategoryListBorrower)
                {
                    if (defaultCategory != null && !String.IsNullOrEmpty(section.SectionName) && !conditionsMainViewModel.ConditionsSub.Conditions.Any(c => c.OwnerNames == section.SectionName && c.CategoryId == defaultCategory.EnumerationValueId))
                    {
                        conditionsMainViewModel.ConditionsSub.Conditions.Add(new ConditionViewModel()
                        {
                            CategoryId = defaultCategory.EnumerationValueId,
                            CategoryDescription = SetCategorySortingIndex(defaultCategory.Code,true),
                            IsRemoved = true,
                            OwnerNames = section.SectionName
                        });
                    }
                }
                foreach (var defaultCategory in defaultCategoryListProperty)
                {
                    if (defaultCategory != null && !conditionsMainViewModel.ConditionsSub.Conditions.Any(c => c.OwnerNames == String.Empty && c.CategoryId == defaultCategory.EnumerationValueId))
                    {
                        conditionsMainViewModel.ConditionsSub.Conditions.Add(new ConditionViewModel()
                        {
                            OwnerNames = String.Empty,
                            CategoryId = defaultCategory.EnumerationValueId,
                            CategoryDescription = SetCategorySortingIndex(defaultCategory.Code,false),
                            IsRemoved = true
                        });
                    }
                }
            }
            
        }

        private string SetCategorySortingIndex(string categoryName, bool borrower)
        {
            var index = String.Empty;
            switch (categoryName)
            {
                case "Assets":
                    index =  "3";
                    break;
                case "Collateral":
                    index = borrower ? "5" : "4";
                    break;
                case "Credit":
                    index = borrower ? "1" : "5";
                    break;
                case "Identity":
                    index = borrower ? "4" : "6";
                    break;
                case "Income":
                    index = borrower ? "2" : "7";
                    break;
                case "Escrow":
                    index = borrower ? "6" : "2";
                    break;
                case "Property":
                    index = borrower ? "7" : "1";
                    break;
                default:
                    break;
            }
            return String.Format("{0}{1}", index, categoryName);
        }
        private void InitializeConditions( ConditionsMainViewModel conditionsMainViewModel )
        {
            var conditions = StipsAndConditionsFacade.LoadConditionsPerLoan(conditionsMainViewModel.LoanId);

            foreach (var condition in conditions)
            {
                var categoryId = condition.ConditionConfigurations.First() != null
                                     ? condition.ConditionConfigurations.First().CategoryCdId
                                     : 0;
                var conditionViewModel = new ConditionViewModel
                {
                    ConditionId = condition.ConditionId,
                    AssignedTo = conditionsMainViewModel.ConditionsSub.AssignedToList.FirstOrDefault(a => a.RoleId == condition.CurativeRoleCdId),
                    Due = conditionsMainViewModel.ConditionsSub.DueList.FirstOrDefault(a => a.EnumerationValueId == condition.GateCdId) ?? new EnumerationValue(),
                    Status = conditionsMainViewModel.ConditionsSub.StatusList.Exists(a => a.EnumerationValueId == condition.StatusCdId) ?
                             conditionsMainViewModel.ConditionsSub.StatusList.Where(a => a.EnumerationValueId == condition.StatusCdId).FirstOrDefault().Code : String.Empty,
                    StatusId = conditionsMainViewModel.ConditionsSub.StatusList.Exists(a => a.EnumerationValueId == condition.StatusCdId) ?
                               conditionsMainViewModel.ConditionsSub.StatusList.Where(a => a.EnumerationValueId == condition.StatusCdId).FirstOrDefault().EnumerationValueId : 0,
                    InternalOnly = condition.ExternallyVisable,
                    ConfigurationCode = conditionsMainViewModel.ConditionsSub.CodesList.FirstOrDefault(a => a.ConditionConfigurationId == condition.ConditionConfigurationId) ?? new ConditionConfiguration(),
                    CategoryDescription = conditionsMainViewModel.ConditionsSub.CategoryList.Exists(a => a.EnumerationValueId == categoryId) ?
                                          conditionsMainViewModel.ConditionsSub.CategoryList.Where(a => a.EnumerationValueId == categoryId).FirstOrDefault().Description : string.Empty,
                    CategoryId = categoryId,
                    CurativeItems = new List<ConditionItemViewModel>(),

                    UserAccountCreatedId = condition.UserAccountCreatedId,
                    DateCreated = condition.DateCreated,
                    ConditionSource = conditionsMainViewModel.ConditionsSub.SourceList.FirstOrDefault(a => a.EnumerationValueId == condition.SourceCdId) ?? new EnumerationValue(),
                    SignOff = conditionsMainViewModel.ConditionsSub.SignedOffList.FirstOrDefault(a => a.RoleId == condition.CurativeRoleCdId),
                    IsSignedOff = condition.IsSignedOff,
                    SignOffDate = condition.SignOffDate.ToString("MM/dd/yyyy hh:mm tt"),
                    UserSignedOff = condition.UserSignedOff,
                    CommentHistoryExists = condition.ConditionHistoryExists,
                    Comment = condition.Comments
                };

                if (condition.CurativeItems != null && condition.CurativeItems.Count > 0)
                {
                    conditionViewModel.OwnerNames = RetrieveSectionName(condition.CurativeItems.First(), conditionsMainViewModel);
                    conditionViewModel.CategoryDescription = SetCategorySortingIndex(conditionViewModel.CategoryDescription, conditionViewModel.OwnerNames != String.Empty);
                    foreach (var item in condition.CurativeItems)
                    {
                        var itemViewModel = CreateCurativeItem(conditionsMainViewModel, item);
                        conditionViewModel.CurativeItems.Add(itemViewModel);

                        if (itemViewModel.Status.Code == "PastDue")
                        {
                            conditionViewModel.CurativeItemsVisible = true;
                        }
                    }
                }

                conditionsMainViewModel.ConditionsSub.Conditions.Add(conditionViewModel);
            }
        }
        
        #endregion

        #region ***SET UI VALUES FOR LOOKUPS**
        
        private void InitializeDataForNewCondition( ConditionsMainViewModel conditionsMainViewModel )
        {
            conditionsMainViewModel.ConditionsSub.NewCondition = new ConditionViewModel
            {
                CurativeItems = new List<ConditionItemViewModel>
                { 
                                                                 new ConditionItemViewModel
                                                                 {
                                                                     Status = conditionsMainViewModel.ConditionsSub.StatusList.FirstOrDefault( s => s.Code == "Needed" ),
                                                                 } 
                                                             },
                ConfigurationCode = conditionsMainViewModel.ConditionsSub.CodesList.FirstOrDefault(),
                ConditionSource = conditionsMainViewModel.ConditionsSub.SourceList.FirstOrDefault( s => s.Code == "Manual" )
            };
        }

        private void InitializeLookupValuesForConditions( ConditionsMainViewModel conditionsMainViewModel )
        {
            var userAccountServiceFacade = new UserAccountServiceFacade();
            List<Role> userRoles = UserAccountServiceFacade.GetRoles().SafeEnumerate<Role>().ToList();

            var lookups = StipsAndConditionsFacade.LoadLookups();
            conditionsMainViewModel.ConditionsSub.AssignedToList = userRoles;
            conditionsMainViewModel.ConditionsSub.SignedOffList = userRoles;
            conditionsMainViewModel.ConditionsSub.CodesList = StipsAndConditionsFacade.SearchConditionConfigurations( "*" ).ToList();
            conditionsMainViewModel.ConditionsSub.DueList = lookups.EnumerationConfiguration.Where( ec => ec.Key == "ConditionGate" ).Select( ec => ec.Value ).First();
            conditionsMainViewModel.ConditionFilter = lookups.EnumerationConfiguration.Where(ec => ec.Key == "ConditionGate").Select(ec => ec.Value).First();
            conditionsMainViewModel.ConditionsSub.ItemsList = InitializeVaultDocumentTypes();
            conditionsMainViewModel.ConditionsSub.ForList = PopulateForMenu( conditionsMainViewModel.LoanId );
            conditionsMainViewModel.ConditionsSub.CategoryList = lookups.EnumerationConfiguration.Where( ec => ec.Key == "ConditionCategory" ).Select( ec => ec.Value ).First();
            conditionsMainViewModel.ConditionsSub.SourceList = lookups.EnumerationConfiguration.Where( ec => ec.Key == "ConditionSource" ).Select( ec => ec.Value ).First();
            conditionsMainViewModel.ConditionsSub.StatusList = lookups.EnumerationConfiguration.Where( ec => ec.Key == "CurativeStatus" ).Select( ec => ec.Value ).First();
            conditionsMainViewModel.ConditionsSub.DecisionsList = lookups.EnumerationConfiguration.Where(ec => ec.Key == "LoanDecisionStatus").Select(ec => ec.Value).First();
            conditionsMainViewModel.ConditionsSub.BorrowerConditionList = RetrieveConditionTypeList(ENVIRONMENT, KEY_CONDITIONTYPE_BORROWER, conditionsMainViewModel.ConditionsSub.CategoryList);
            conditionsMainViewModel.ConditionsSub.PropertyConditionList = RetrieveConditionTypeList(ENVIRONMENT, KEY_CONDITIONTYPE_PROPERTY, conditionsMainViewModel.ConditionsSub.CategoryList);
        }

        private List<Int32> RetrieveConditionTypeList(string environment, string key, List<EnumerationValue> conditionCategoryList)
        {
            var conditionTypeList = new List<Int32>();
            var configurationValue = Client.Instance.GetConfigurationValue(key, environment, new string[] { });
            string[] delimitedValues = configurationValue.Split(new char[] { ';' });

            if (delimitedValues != null)
                foreach (string value in delimitedValues)
                {
                    int conditionTypeId = conditionCategoryList.Exists(cc => cc.Code == value.Trim()) ? conditionCategoryList.FirstOrDefault(cc => cc.Code == value.Trim()).EnumerationValueId : 0;
                    conditionTypeList.Add(conditionTypeId);

                }

            return conditionTypeList;
        }

        private List<ForConditionMenuModel> PopulateForMenu( Guid loanId )
        {
            var borrowers = BorrowerServiceFacade.GetBorrowersForLoan( loanId );
            var properties = PropertyServiceFacade.RetrieveProperties( loanId, 0 );
            var ccFacade = new ContactsCompanyServiceFacade();
            var contacts = ccFacade.GetAllLoanCompaniesAndContacts( -1, null, "Search", 1, 1000, null, loanId.ToString() );
            var forMenuList = new List<ForConditionMenuModel>();
            foreach ( var borrower in borrowers )
            {
                forMenuList.Add( new ForConditionMenuModel
                {
                    Id = borrower.BorrowerId.ToString(),
                    Value = String.Format( "{0} {1}", borrower.BorrowerPersonalInfo.FirstName, borrower.BorrowerPersonalInfo.LastName ),
                    IsCoborrower = borrower.IsCoBorrower,
                    Section = "Borrowers",
                    SourceId = borrower.IsCoBorrower ? (int)SourceRole.CoBorrower : (int)SourceRole.Borrower,
                    SourceDescription = borrower.IsCoBorrower ? "C" : "B",
                    SectionName = CreateConditionSectionNameForBorrowers( borrowers, borrower.BorrowerId )
                } );

                // add value for joint account
                if ( borrower.JointAccountId != null && forMenuList.All( b => b.JointId != borrower.BorrowerId.ToString() ) )
                {
                    var jointBorrower = borrowers.FirstOrDefault( b => b.UserAccountId == borrower.JointAccountId );
                    if ( jointBorrower != null )
                    {
                        forMenuList.Add( new ForConditionMenuModel
                        {
                            Id = borrower.BorrowerId.ToString(),
                            JointId = jointBorrower.BorrowerId.ToString(),
                            Value = String.Format( "{0} {1}, {2} {3}", borrower.BorrowerPersonalInfo.FirstName,
                                                  borrower.BorrowerPersonalInfo.LastName,
                                                  jointBorrower.BorrowerPersonalInfo.FirstName,
                                                  jointBorrower.BorrowerPersonalInfo.LastName ),
                            Section = "Borrowers",
                            SourceId = (int)SourceRole.JointAccount,
                            SourceDescription = "J",
                            SectionName = CreateConditionSectionNameForBorrowers( borrowers, borrower.BorrowerId )
                        } );
                    }
                }
            }
            // add properties to menu
            forMenuList.AddRange( properties.Select( property => new ForConditionMenuModel
            {
                Id = property.PropertyId.ToString(),
                Value = String.Format( "{0} {1} {2} {3}", property.Address.StreetName, property.Address.CityName, property.Address.StateName, property.Address.ZipCode ),
                Section = "Property",
                SourceId = property.IsSubjectProperty ? (int)SourceRole.SubjectProperty : (int)SourceRole.ReoProperty,
                SourceDescription = property.IsSubjectProperty ? "SP" : "R1",
                SectionName = String.Empty
            } ).ToList() );

            // add contacts to menu
            forMenuList.AddRange( contacts.LoanCompaniesAndUsersList.Where(c=>c.ContactId != -1).Select( contact => new ForConditionMenuModel
            {
                Id = contact.ContactId.ToString(),
                Value = String.Format( "{0} {1}", contact.FirstName, contact.LastName ),
                Section = "Contacts",
                SourceId = (int)SourceRole.OtherContact,
                SourceDescription = "OC",
                SectionName = String.Format( "(OC) {0} {1}", contact.FirstName, contact.LastName )
            } ) );


            return forMenuList;
        }

        private List<EnumerationValue> InitializeVaultDocumentTypes()
        {
            try
            {
                var allDocumentTypes = RetrieveAllVaultDocumentTypes();
                if (allDocumentTypes == null || allDocumentTypes.Count == 0)
                    return new List<EnumerationValue>();

                return allDocumentTypes.Select(vaultDocumentType => new EnumerationValue
                {
                    EnumerationValueId = (int)vaultDocumentType.DocumentTypeId,
                    Code = vaultDocumentType.Description
                } ).ToList();
            }
            catch ( Exception ex )
            {
                TraceHelper.Error(TraceCategory.LoanCenterController, ex.Message, ex);
                return new List<EnumerationValue>();
            }
        }

        private List<VaultDocumentType> RetrieveAllVaultDocumentTypes()
        {
            var allDocumentTypes = _cacheProvider.Retrieve<List<VaultDocumentType>>("VaultDocumentTypes");
            if (allDocumentTypes == null || allDocumentTypes.Count == 0)
            {
                var retieveDocumentTypes = new GetVaultDocumentTypeParameters
                {
                    TenantKey = "NewLeafLending",
                    RetrieveAll = false
                };

                object proxyResponseMessageSuccess;
                var resultsFromProxy = new Proxy().Send("DocVault_RetrieveDocumentTypes", new Dictionary<string, object> { { "InRetrieveDocumentTypes", retieveDocumentTypes } });
                resultsFromProxy.TryGetValue("VaultDocumentTypes", out proxyResponseMessageSuccess);
                allDocumentTypes = proxyResponseMessageSuccess as List<VaultDocumentType>;

                _cacheProvider.Add("VaultDocumentTypes", allDocumentTypes, 600); // 10 minutes.
            }

            return allDocumentTypes;
        }
        
        #endregion

        #region *** SAVE CONDITIONS TO DATABASE ***
        
        public Condition ConvertDataViewModelToDatabaseModel(ConditionViewModel conditionViewModel, Guid loanId, ConditionsMainViewModel previousModel)
        {
            var currenUserAcccountId = GetCurrentUser().UserAccountId;

            DateTime signOffDate;
            DateTime.TryParse( conditionViewModel.SignOffDate, out signOffDate );

            var condition = new Condition()
            {
                ConditionId =conditionViewModel.NewCondition ? Guid.Empty : conditionViewModel.ConditionId,
                ConditionConfigurationId = conditionViewModel.ConfigurationCode.ConditionConfigurationId,
                LoanId = loanId,
                UserAccountCreatedId = conditionViewModel.ConditionId.Equals( Guid.Empty ) ? currenUserAcccountId : conditionViewModel.UserAccountCreatedId,
                DateCreated = conditionViewModel.DateCreated == null ? DateTime.Now : (DateTime)conditionViewModel.DateCreated,
                Comments = conditionViewModel.Comment,
                SourceCdId = conditionViewModel.ConditionSource.EnumerationValueId,
                CurativeRoleCdId = conditionViewModel.AssignedTo != null ? conditionViewModel.AssignedTo.RoleId : Guid.Empty,
                AssignedToId = conditionViewModel.SignOff != null ? conditionViewModel.SignOff.RoleId : Guid.Empty,
                GateCdId = conditionViewModel.Due.EnumerationValueId,
                ExternallyVisable = conditionViewModel.InternalOnly,
                StatusCdId = Guid.Empty.Equals( conditionViewModel.ConditionId ) ? (int)CurativeStatusCode.Added : conditionViewModel.StatusId,
                CurativeItems = new List<CurativeItem>(),
                SourceConditionDescription = "Manual",
                IsSignedOff = conditionViewModel.IsSignedOff,
                UserSignedOff = conditionViewModel.UserSignedOff,
                IsModified = CheckIfConditionIsModified(conditionViewModel, previousModel),
                SignOffDate = signOffDate,
                IsRemoved = conditionViewModel.IsRemoved ? conditionViewModel.IsRemoved : !conditionViewModel.CurativeItems.Any(i => !i.IsRemoved),
                SignOff = conditionViewModel.SignOff != null ? conditionViewModel.SignOff.RoleId : Guid.Empty
            };

            if (conditionViewModel.CurativeItems != null && conditionViewModel.CurativeItems.Count > 0)
            {
                foreach (var item in conditionViewModel.CurativeItems.Where(i => i.PreviouslyAdded))
                {
                    var userAccountId = item.CurativeItemId.Equals(Guid.Empty) ? currenUserAcccountId : item.UserAccountCreatedId;
                    var curativeItem = new CurativeItem()
                    {
                        CurativeItemId = item.CurativeItemId,
                        CurativeItemConfigurationId = conditionViewModel.ConfigurationCode.ItemConfigurations.Exists(ic => ic.DocTypeId == item.Item.EnumerationValueId) ?
                        conditionViewModel.ConfigurationCode.ItemConfigurations.FirstOrDefault(ic => ic.DocTypeId == item.Item.EnumerationValueId).CurativeItemConfigurationId : Guid.Empty,
                        ConditionId = conditionViewModel.ConditionId,
                        UserAccountCreatedId = userAccountId,
                        Comments = item.Description ?? String.Empty,
                        DocTypeId = item.Item != null ? item.Item.EnumerationValueId : 0,
                        // todo: check value for duedate
                        DueDate = DateTime.Now,
                        StatusCdId = item.Status.EnumerationValueId,
                        SourceRoleCdId = item.For.SourceId,
                        IsRemoved = item.IsRemoved,
                        DateCreated = item.DateCreated == null ? DateTime.Now : (DateTime)item.DateCreated,
                        CurativeItemNotes = ParseViewModelCurativeItemNotesToModel(item.Notes).ToList()
                    };
                    if (item.For.SourceId != (int)SourceRole.ReoProperty && item.For.SourceId != (int)SourceRole.SubjectProperty)
                    {
                        curativeItem.CurativeItemPartyRefs = new List<CurativeItemPartyRef>();
                        curativeItem.CurativeItemPartyRefs.Add(new CurativeItemPartyRef
                    {
                        ContactId = item.For.SourceId == (int)SourceRole.OtherContact ? Convert.ToInt32(item.For.Id) : 0,
                        CurativeItemId = item.CurativeItemId,
                        PartyId = item.For.SourceId != (int)SourceRole.OtherContact ? new Guid(item.For.Id) : Guid.Empty
                    });
                    }
                    else
                    {
                        curativeItem.CurativeItemSubjectPropertyRefs = new List<CurativeItemSubjectPropertyRef>
                        {
                            new CurativeItemSubjectPropertyRef()
                            {
                                CurativeItemId = item.CurativeItemId,
                                AddressId = new Guid(item.For.Id)
                            }
                        };
                    }

                    if (item.Document != null)
                    {
                        if (item.Document.RepositoryId != Guid.Empty)
                        {
                            curativeItem.CurativeItemFileRef = new CurativeItemFileRef
                            {
                                Active = true,
                                DateCreated = DateTime.Now,
                                FileId = item.Document.RepositoryId,
                                UserAccountCreatedId = userAccountId,
                                UserAccountId = GetCurrentUser().UserAccountId
                            };
                        }
                    }

                    condition.CurativeItems.Add(curativeItem);
                }
            }

            return condition;
        }
        
        private EnumerationValue RetrieveSelectedValue( string key, ConditionsSubViewModel conditionsSubViewModel, int value )
        {
            EnumerationValue selectedEnumerationValue = null;
            switch ( key )
            {
                case "StatusList":
                    selectedEnumerationValue = conditionsSubViewModel.StatusList.FirstOrDefault( a => a.EnumerationValueId == value );
                    break;
                case "DocumentList":
                    selectedEnumerationValue = conditionsSubViewModel.DocumentList.FirstOrDefault( a => a.EnumerationValueId == value );
                    break;
                case "SourceList":
                    selectedEnumerationValue = conditionsSubViewModel.SourceList.FirstOrDefault( a => a.EnumerationValueId == value );
                    break;
                case "ItemList":
                    selectedEnumerationValue = conditionsSubViewModel.ItemsList.FirstOrDefault( a => a.EnumerationValueId == value );
                    break;
                case "DueList":
                    selectedEnumerationValue = conditionsSubViewModel.DueList.FirstOrDefault( a => a.EnumerationValueId == value );
                    break;
                case "CategoryList":
                    selectedEnumerationValue = conditionsSubViewModel.CategoryList.FirstOrDefault( a => a.EnumerationValueId == value );
                    break;
            }

            return selectedEnumerationValue ?? new EnumerationValue();

        }

        private bool CheckIfConditionIsModified(ConditionViewModel condition, ConditionsMainViewModel model)
        {
            if (condition.ConditionId.Equals(Guid.Empty) || condition.IsRemoved  || condition.NewCondition)
                return true;
            var previousConditionState = model.ConditionsSub.Conditions.FirstOrDefault(c => c.ConditionId == condition.ConditionId);
            if (previousConditionState == null)
                return true;

            bool isAssignedToModified = true;
            if (condition.AssignedTo != null && previousConditionState.AssignedTo != null)
                isAssignedToModified = condition.AssignedTo.RoleId != previousConditionState.AssignedTo.RoleId;

            return condition.Comment != previousConditionState.Comment || 
                isAssignedToModified || 
                condition.Due.Code != previousConditionState.Due.Code ||
                condition.InternalOnly != previousConditionState.InternalOnly ||
                condition.IsSignedOff != previousConditionState.IsSignedOff;
        }

        private bool ClassifyVaultDocuments(List<ConditionsDocument> documents, string user)
        {
            try
            {
                foreach (var document in documents)
                {
                    long docId;

                    if (document.OriginalCategory.ToLower() != "unclassified" 
                        || !long.TryParse(document.DocumentId, out docId)
                        || (document.OriginalDocumentTypeId == document.DocumentTypeId && String.IsNullOrEmpty(document.BorrowerNames) 
                        && String.IsNullOrEmpty(document.BankName) && String.IsNullOrEmpty(document.AccountNumber) && !document.Rejected))
                        continue;

                    UpdateVaultDocumentStatusParameters requestUpdateStatus = new UpdateVaultDocumentStatusParameters()
                    {
                        DocumentId = docId,
                        ClassificationStatus = (int)ClassificationStatus.CLASSIFICATION_COMPLETED,
                        User = user                        
                    };

                    var result = new Proxy().Send("DocVault_UpdateVaultDocumentStatus", new Dictionary<string, object> { { "InUpdateVaultDocumentStatus", requestUpdateStatus } });
                    object responseMessageSuccess;
                    result.TryGetValue("Response", out responseMessageSuccess);

                    if (responseMessageSuccess is bool && (bool)responseMessageSuccess)
                    {
                        var request = new UpdateVaultDocumentParameters()
                        {
                            DocumentId = docId,
                            User = user,
                            DocumentTypeId = document.DocumentTypeId,
                            ClassificationStatus = (int)ClassificationStatus.DO_NOT_CLASSIFY,
                            Rejected = document.Rejected,
                            Name = document.Name,
                            Metadata = new List<VaultMetadata>() 
                            { 
                                new VaultMetadata() { Key = "Borrower Name(s)", Value = document.BorrowerNames ?? String.Empty },
                                new VaultMetadata() { Key = "Bank Name", Value = document.BankName ?? String.Empty },
                                new VaultMetadata() { Key = "Account Number", Value = document.AccountNumber ?? String.Empty }
                            }
                        };

                        new Proxy().Send("DocVault_UpdateVaultDocument", new Dictionary<string, object> { { "InUpdateVaultDocument", request } });
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                TraceHelper.Error(TraceCategory.LoanCenterController, ex.Message, ex);
                return false;
            }
        }

        #endregion

        #region *** Delivery Vault ***

        private void InitializeDeliveryVault( ConditionsMainViewModel conditionsMainViewModel )
        {
            try
            {
                DocumentsServiceFacade docFacade = new DocumentsServiceFacade();
                var stackingOrder = docFacade.GetDeliveryVaultStackingOrder( conditionsMainViewModel.LoanId.ToString() );
                if ( stackingOrder == null )
                    return;

                if ( String.IsNullOrEmpty( stackingOrder.TemplateName ) )
                    stackingOrder.TemplateName = conditionsMainViewModel.LoanId.ToString();

                conditionsMainViewModel.DeliveryVault.DeliveryVaultStackingOrder = stackingOrder;
                var maxStackingOrderCount = stackingOrder.DeliveryVaultDocumentsStackingOrder.SelectMany( x => x.StackingOrder ).Count();

                foreach ( var document in conditionsMainViewModel.ConditionsDocuments )
                {
                    var categorySortList = stackingOrder.DeliveryVaultDocumentsStackingOrder.Where( c => c.CategoryName == document.Category ).FirstOrDefault();
                    if ( categorySortList == null || categorySortList.StackingOrder == null )
                    {
                        document.SortOrder = maxStackingOrderCount++;
                        continue;
                    }

                    var sortIndex = categorySortList.StackingOrder.IndexOf( document.DocumentId );
                    if ( sortIndex == -1 )
                        sortIndex = maxStackingOrderCount++;

                    document.SortOrder = sortIndex;
                }
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "Error in ConditionsController - InitializeDeliveryVault", ex );
            }
        }

        public ActionResult DeliveryVault_SaveStackingOrder( DeliveryVaultStackingOrder deliveryVaultStackingOrder )
        {
            var conditionsMainViewModel = Session[SessionHelper.ConditionsMainViewModel] as ConditionsMainViewModel;
            if ( conditionsMainViewModel == null || deliveryVaultStackingOrder == null )
                return Json( new { success = false } );

            conditionsMainViewModel.DeliveryVault.DeliveryVaultStackingOrder.StackingOrder = deliveryVaultStackingOrder.StackingOrder;
            conditionsMainViewModel.DeliveryVault.DeliveryVaultStackingOrder.DeliveryVaultDocumentsStackingOrder = deliveryVaultStackingOrder.DeliveryVaultDocumentsStackingOrder;

            DocumentsServiceFacade docFacade = new DocumentsServiceFacade();
            var result = docFacade.SaveDeliveryVaultStackingOrder( conditionsMainViewModel.LoanId.ToString(), deliveryVaultStackingOrder, IdentityManager.GetUserAccountId() );

            return Json( new { success = result } );
        }

        #endregion
    }
}
