using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Controllers
{
    public class LoanController : Controller
    {
        //
        // GET: /Loan/
        [OutputCache( NoStore = true, Duration = 0, VaryByParam = "*" )]
        [CompressFilter]
        public ActionResult Index()
        {
            return View();
        }

        public Boolean ManageProspectsSave( ManageProspectsViewModel manageProspectsViewModel )
        {
            var user = AccountHelper.GetUserAccount( HttpContext );

            Int32 status = 0;
            Int32 concierge = 0;
            Int32 callCenter = 0;
            Int32 loa = 0;

            if ( !String.IsNullOrEmpty( manageProspectsViewModel.SelectedCallCenter ) )
            {
                Int32.TryParse( manageProspectsViewModel.SelectedCallCenter, out callCenter );
            }

            if ( !String.IsNullOrEmpty( manageProspectsViewModel.SelectedLoa ) )
            {
                Int32.TryParse( manageProspectsViewModel.SelectedLoa, out loa );
            }

            if ( !String.IsNullOrEmpty( manageProspectsViewModel.SelectedStatus ) )
            {
                Int32.TryParse( manageProspectsViewModel.SelectedStatus, out status );
            }

            if ( !String.IsNullOrEmpty( manageProspectsViewModel.SelectedConcierge ) )
            {
                Int32.TryParse( manageProspectsViewModel.SelectedConcierge, out concierge );
            }

            Guid companyId = Guid.Empty;

            if ( !String.IsNullOrEmpty( manageProspectsViewModel.CompanyId ))
            {
                Guid.TryParse( manageProspectsViewModel.CompanyId, out companyId );
            }

            var updated = ContactServiceFacade.UpdateContactProspect( 
                manageProspectsViewModel.ProspectId, status, concierge, user.UserAccountId, companyId, manageProspectsViewModel.ChannelId, manageProspectsViewModel.DivisionId, manageProspectsViewModel.BranchId, callCenter, loa );

            if ( manageProspectsViewModel.LoanId == Guid.Empty )
            {
                return updated;
            }

            

            bool isSubmited = LoanServiceFacade.AssignOfficersToLoan( manageProspectsViewModel.LoanId,companyId, manageProspectsViewModel.ChannelId, manageProspectsViewModel.DivisionId, manageProspectsViewModel.BranchId, concierge, callCenter, loa );

            if ( !isSubmited ) 
                return false;

            ActivitiesServiceFacade.ExecuteActivityRulesConcierge( 
                ActivitiesServiceFacade.RetrieveActivity( manageProspectsViewModel.LoanId, ActivityType.CompleteLoanApplication, user.UserAccountId ).Id,
                ActivityStatus.Completed, ActivityMode.None, false, ActionIntent.LoanNoAndConciergeAssigned, user.Party.Id, user.UserAccountId );

            return true;
        }

        public Boolean SaveAssignInfo( AssignLoanInfoViewModel assignLoanInfoViewModel )
        {
            UserAccount user = null;
            if ( Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )Session[ SessionHelper.UserData ];
            try
            {
                var loaId = assignLoanInfoViewModel.LoaId.HasValue ? assignLoanInfoViewModel.LoaId.Value : -1;
                var conciergeId = assignLoanInfoViewModel.ConciergeId.HasValue ? assignLoanInfoViewModel.ConciergeId.Value : -1;

                var callCenterId = assignLoanInfoViewModel.CallCenterId.HasValue ? assignLoanInfoViewModel.CallCenterId.Value : -1;

                Guid companyId = Guid.Empty;

                if ( !String.IsNullOrEmpty( assignLoanInfoViewModel.CompanyId ) )
                {
                    Guid.TryParse( assignLoanInfoViewModel.CompanyId, out companyId );
                }

                int loanNumber;
                bool isLoanNumberAssigned = int.TryParse( assignLoanInfoViewModel.LoanNumber, out loanNumber ) && loanNumber > 0;

                if ( user != null && !isLoanNumberAssigned )
                {
                    string loanNum = LoanServiceFacade.RetrieveLoanNumber( assignLoanInfoViewModel.LoanId, user.UserAccountId );
                    isLoanNumberAssigned = int.TryParse( loanNum, out loanNumber ) && loanNumber > 0;
                }

                bool isSubmited = LoanServiceFacade.AssignConciergeLoanNumberAndLOA( assignLoanInfoViewModel.LoanId, conciergeId, assignLoanInfoViewModel.LoanNumber, assignLoanInfoViewModel.ConciergeNMLS, companyId, assignLoanInfoViewModel.ChannelId, assignLoanInfoViewModel.DivisionId, assignLoanInfoViewModel.BranchId, assignLoanInfoViewModel.EnableDigitalDocsCall, user.UserAccountId, loaId, callCenterId );

                if ( isSubmited )
                {
                    int losFolderId = int.Parse( assignLoanInfoViewModel.LosFolder );
                    isSubmited = LoanServiceFacade.UpdateLosFolderId( assignLoanInfoViewModel.LoanId, losFolderId, user.UserAccountId );
                }

                if ( isSubmited )
                    isSubmited = ActivitiesServiceFacade.ExecuteActivityRulesConcierge( ActivitiesServiceFacade.RetrieveActivity( assignLoanInfoViewModel.LoanId, ActivityType.CompleteLoanApplication, user.UserAccountId ).Id,
                                                                      ActivityStatus.Completed, ActivityMode.None, false, ActionIntent.LoanNoAndConciergeAssigned, user.Party.Id, user.UserAccountId, loanNumberAlreadyAssigned: isLoanNumberAssigned );

                return isSubmited;
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.Global, "ExportToLOS::LosFolderUpdated", exception, assignLoanInfoViewModel.LoanId, user != null ? user.UserAccountId : -1 );
                return false;
            }
        }

        public ActionResult ChangeProspectLO( int contactId, int newOwnerAccountId, string lid )
        {
            try
            {
                UserAccount loggedUser = null;
                if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
                {
                    loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
                }
                else
                {
                    // TODO: Handle if user don't have priviledges to see this log
                    throw new UnauthorizedAccessException( "User is not authorized to access this method!" );
                }

                var licenseExpiredClass = "notdisplayed";
                var licenseExpiredMessage = String.Empty;

                var updated = ContactServiceFacade.UpdateContactOwner( contactId, newOwnerAccountId, loggedUser.UserAccountId );
                
                if ( !updated || newOwnerAccountId == 0 || !WebCommonHelper.LicensingEnabled() )
                {
                    return Json( new
                    {
                        LicenseExpiredClass = licenseExpiredClass,
                        LicenseExpiredMessage = licenseExpiredMessage
                    }, JsonRequestBehavior.AllowGet );
                }

                Guid loanId;
                Guid.TryParse( lid, out loanId );

                // Check if concierge/branch is licensed
                var isUserStateLicensedForLoan = UserAccountServiceFacade.IsUserStateLicensedForLoan( newOwnerAccountId, loanId, contactId );

                licenseExpiredMessage = LicenseHelper.ConfigureLicenseExpiredMessage( licenseExpiredMessage, isUserStateLicensedForLoan );
                if ( !String.IsNullOrEmpty( licenseExpiredMessage ) )
                    licenseExpiredClass = "licenseExpiredNotification";               

                return Json( new
                {
                    LicenseExpiredClass = licenseExpiredClass,
                    LicenseExpiredMessage = licenseExpiredMessage
                }, JsonRequestBehavior.AllowGet );

            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.Global, "LoanController::ChangeProspectLO", ex );
                return Json( null, JsonRequestBehavior.AllowGet );
            }
        }

        public JsonResult GetDefaultPendingApprovalCommand( Guid loanId )
        {
            String result = String.Empty;
            Int32 numberOfDocuments = DocumentsServiceFacade.RetrieveNumberOfUploadedOrFaxedDocuments( loanId, IdentityManager.GetUserAccountId() );
            String submittedActivityName = ActivitiesServiceFacade.RetrieveSubmittedActivityName( loanId, IdentityManager.GetUserAccountId() );
            try
            {

                if ( numberOfDocuments > 0 && String.IsNullOrEmpty( submittedActivityName ) )
                {
                    result = "Manage Documents";
                }
                else if ( !String.IsNullOrEmpty( submittedActivityName ) )
                {
                    // evaluate command by submitted activity name

                    switch ( submittedActivityName )
                    {
                        case "Upload Documents":
                            result = "Manage Documents";
                            break;
                        case "Order Appraisal":
                            result = "Manage Appraisal";
                            break;
                        case "Review Disclosures":
                            result = "Manage Disclosures";
                            break;
                        default:
                             result = "Manage Activities";
                             break;
                    }

                }
                else // in case number of documents = 0 and submitted activity is blank
                {
                    result = "Manage Activities";
                }

                return Json( new { success = true, action = result } );
            }
            catch ( Exception ex )
            {
                return Json( new { success = false, msg = ex.Message } );
            }
        }

        public JsonResult GetLoanNumber( Guid loanId )
        {
            ConciergeIdAndLoanNumber toReturn = LoanServiceFacade.RetrieveConciergeIdAndLoanNumber( loanId, AccountHelper.GetUserAccountId( ) );
            return Json(toReturn, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// This method copies or duplicate a loan based upon its loandID
        /// </summary>
        /// <param name="loanId"></param>
        /// <returns></returns>
        public JsonResult CopyLoan(Guid loanId)
        {
            Boolean toReturn = LoanServiceFacade.CopyLoan(loanId, AccountHelper.GetUserAccountId());
            if (toReturn)
                return Json("OK", JsonRequestBehavior.AllowGet);
            else
                return Json("Error", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// This method import a loan from its XML. Loan data comes from a selected file. This could support multiple files.
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetLoanFromXml()
        {
            String _xml = string.Empty;
            HttpPostedFileBase file = Request.Files[0]; //Uploaded file, we use the first one asuming that at least one file has been selected.
            //Use the following properties to get file's name, size and MIMEType
            int fileSize = file.ContentLength;
            string fileName = file.FileName;
            string mimeType = file.ContentType;
            System.IO.Stream fileContent = file.InputStream;

            using (StreamReader reader = new StreamReader(fileContent))
            {
                _xml = reader.ReadToEnd();
            }

            Boolean toReturn = LoanServiceFacade.GetLoanFromXml(_xml, AccountHelper.GetUserAccountId());
            if (toReturn)
                return Json("OK", JsonRequestBehavior.AllowGet);
            else
                return Json("Error", JsonRequestBehavior.AllowGet);
        }

        // 
        /// <summary>
        /// This method import a loan into the prospect queue from its XML. Loan data comes from a selected file.
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetLoanFromXmlForPendingApproval()
        {
            String _xml = string.Empty;
            HttpPostedFileBase file = Request.Files[0]; //Uploaded file, we use the first one asuming that at least one file has been selected.
            //Use the following properties to get file's name, size and MIMEType
            int fileSize = file.ContentLength;
            string fileName = file.FileName;
            string mimeType = file.ContentType;
            System.IO.Stream fileContent = file.InputStream;

            using (StreamReader reader = new StreamReader(fileContent))
            {
                _xml = reader.ReadToEnd();
            }

            Boolean toReturn = LoanServiceFacade.GetLoanFromXmlForPendingApproval(_xml, AccountHelper.GetUserAccountId());
            if (toReturn)
                return Json("OK", JsonRequestBehavior.AllowGet);
            else
                return Json("Error", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="zip"></param>
        /// <param name="loanType"></param>
        /// <returns></returns>
        public JsonResult GetZipDataByLoanType(String zip, Int32 loanType)
        {
            try
            {
                var type = (LoanTransactionType)loanType;

                var zipDate = ZipDataHelper.GetZipData(zip, type, GetUserID());
                return Json(zipDate, JsonRequestBehavior.AllowGet);
            }
            catch (Exception exception)
            {
                TraceHelper.Error(TraceCategory.BorrowerService, "ZipData::GetZipDataByLoanType", exception, Guid.Empty, AccountHelper.GetUserAccountId());
                return Json("Invalid zip code.",  JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="zip"></param>
        /// <returns></returns>
        public ZipDataItem GetZipData(string zip)
        {
            return UsaZipFacade.GetZipData(zip, false);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        private int GetUserID()
        {
            UserAccount user;

            if (Session[SessionHelper.UserData] != null &&
                ((UserAccount)Session[SessionHelper.UserData]).Username == User.Identity.Name)
            {
                user = (UserAccount)Session[SessionHelper.UserData];
            }
            else
            {
                user = UserAccountServiceFacade.GetUserByName(User.Identity.Name);
            }
            if (user != null)
            {
                Session[SessionHelper.UserData] = user;
            }
            return user != null ? user.UserAccountId : -1;
        }
    }

    public class FileStringResult : FileResult
    {
        public string Data { get; set; }

        public FileStringResult(string data, string contentType)
            : base(contentType)
        {
            Data = data;
        }

        protected override void WriteFile(HttpResponseBase response)
        {
            if (Data == null) { return; }
            response.Write(Data);
        }
    }
}
