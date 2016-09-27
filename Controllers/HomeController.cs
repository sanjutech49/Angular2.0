using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Web.LoanCenter.Helpers.SharedMethods;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.Models;
using MML.Common;
using MML.Web.LoanCenter.Extensions;
using MML.Web.LoanCenter.ViewModels;
using System.Linq;
using System.Web.Optimization;
using MML.Web.LoanCenter.Helpers.Classes;
using MML.iMP.Events.Contracts;
using MML.iMP.Common;
using MML.iMP.Aus.Contracts;

namespace MML.Web.LoanCenter.Controllers
{
    /// <summary>
    /// Home controler
    /// </summary>
    [OutputCache( NoStore = true, Duration = 0, VaryByParam = "*" )]
    [CompressFilter]
    public class HomeController : AsyncController
    {
        int _version = 2;

        public void IndexAsync(int v=2)
        {
            _version = v;
        }

        public ActionResult MainSection()
        {
            return View();
        }

        #region # IndexCompleted

        public ActionResult IndexCompleted()
        {

            if ( !User.Identity.IsAuthenticated ) {
                return RedirectToAction("SignOut", "Home", new { redirect=this.HttpContext.Request.RawUrl });
            }
                

            Session[ SessionHelper.DisplaySystemAdmin ] = null;
            Session[ SessionHelper.SearchTerm ] = null;
            
            UserAccount user = null;
            ViewBag.Title = "Loan Center";
            if ( Session[ SessionHelper.UserData ] != null && ( ( UserAccount )Session[ SessionHelper.UserData ] ).Username == User.Identity.Name )
            {
                user = ( UserAccount )Session[ SessionHelper.UserData ];
            }
            else
            {
                user = UserAccountServiceFacade.GetUserByName( User.Identity.Name );
            }

            if ( user != null )
            {
                LoginHelper loginHelper = new LoginHelper();
                loginHelper.SetBranding( user );

                Session[ SessionHelper.UserData ] = user;

                if ( !AccountHelper.IsInRole( RoleName.Administrator ) && !AccountHelper.IsInRole( RoleName.Hvm ) )
                {
                    // Show only records where user is assigned to (either if it's as LO/Concierge, LOA or Loan Processor )
                    Session[ SessionHelper.UserAccountIds ] = new List<int> { user.UserAccountId };
                }
                else
                {
                    // Don't filter result list
                    Session[ SessionHelper.UserAccountIds ] = null;
                }
            }

            if ( Session[ SessionHelper.PrivilegeForReviewPreApprovalQueue ] == null || Session[ SessionHelper.PrivilegeForManagingQueues ] == null ||
                 Session[ SessionHelper.PrivilegeForManagingAppraisalOrders ] == null || Session[ SessionHelper.DisplayAppraisalQueues ] == null )
            {
                List<RolePrivilege> privileges = ( UserAccountServiceFacade.GetRolePrivileges( user.UserAccountId ) ).ToList();
                Session[SessionHelper.PrivilegeForUser] = privileges;

                Session[ SessionHelper.PrivilegeForReviewPreApprovalQueue ] = false;
                if ( privileges != null && ( privileges.Any( p => p.Category == ( int )ActionCategory.ReviewPreApprovalQueue )  ) )
                    Session[ SessionHelper.PrivilegeForReviewPreApprovalQueue ] = true;
                else
                    Session[ SessionHelper.PrivilegeForReviewPreApprovalQueue ] = false;

                if ( privileges.Any( p => p.Category == ( int )ActionCategory.ManagingQueues ) )
                    Session[ SessionHelper.PrivilegeForManagingQueues ] = true;
                else
                    Session[ SessionHelper.PrivilegeForManagingQueues ] = false;

                if ( privileges.Any( p => p.Name.Trim().Equals( PrivilegeName.DisplayAppraisalQueues ) ) )
                    Session[ SessionHelper.DisplayAppraisalQueues ] = true;
                else
                    Session[ SessionHelper.DisplayAppraisalQueues ] = false;

                if ( privileges.Any( p => p.Name.Trim().Equals( PrivilegeName.ViewQueuesFilter ) ) )
                    Session[ SessionHelper.ViewQueuesFilter ] = true;
                else
                    Session[ SessionHelper.ViewQueuesFilter ] = false;

                if ( privileges.Any( p => p.Name.Trim().Equals( PrivilegeName.ViewSystemAdmin ) ) )
                    Session[ SessionHelper.PrivilegeForViewSystemAdmin ] = true;
                else
                    Session[ SessionHelper.PrivilegeForViewSystemAdmin ] = false;

                if ( privileges.Any( p => p.Name.Trim().Equals( PrivilegeName.ViewConciergeHome ) ) )
                    Session[ SessionHelper.PrivilegeForViewConciergeCenter ] = true;
                else
                    Session[ SessionHelper.PrivilegeForViewConciergeCenter ] = false;

                if ( privileges.Any( p => p.Name.Trim().Equals( PrivilegeName.ViewLoanCenter ) ) )
                    Session[ SessionHelper.PrivilegeForViewLoanCenter ] = true;
                else
                    Session[ SessionHelper.PrivilegeForViewLoanCenter ] = false;

                if ( privileges.Any( p => p.Name.Trim().Equals( PrivilegeName.MailRoomQueue ) ) && !privileges.Any( p => p.Category == ( int )ActionCategory.ManagingQueues ) )
                {
                    Session[ SessionHelper.CurrentTab ] = LoanCenterTab.NewLoanApplication;
                }
                else if ( privileges.Any( p => p.Name.Trim().Equals( PrivilegeName.DisplayAppraisalQueues ) ) && !privileges.Any( p => p.Category == ( int )ActionCategory.ManagingQueues ) )
                {
                    Session[ SessionHelper.CurrentTab ] = LoanCenterTab.OrderRequested;
                }
                else
                {
                    Session[ SessionHelper.CurrentTab ] = LoanCenterTab.Prospect;
                }
            }
            else
            {
                Session[ SessionHelper.CurrentTab ] = LoanCenterTab.Prospect;
            }

            Session[SessionHelper.LoanCenterVersion] = AccountHelper.HasPrivilege(MML.Common.PrivilegeName.ViewLoanCenter3) ? _version : 2;

            return View();
        }

        #endregion

        #region # SignOutFromPartial

        /// <summary>
        /// Sign out action to use from asynchronous actions (returning partial views).
        /// It returns a javascriptresult since that is the natural way to redirect in a partial view
        /// </summary>
        public ActionResult SignOutFromPartial()
        {
            AbandonSessionAndSignOutFromFormsAuthentication();

            return Json( ConfigurationManager.AppSettings[ "ConciergeLogOut" ] );
            //return Json( ConfigurationManager.AppSettings[ "SiteLoginPage" ] );
        }

        #endregion

        #region # SignOut

        /// <summary>
        /// Regular sign out action to use from synchronous actions
        /// </summary>
        /// <returns></returns>
        public ActionResult SignOut()
        {
            AbandonSessionAndSignOutFromFormsAuthentication();

            var q = "?";
            if (ConfigurationManager.AppSettings["ConciergeLogOut"].IndexOf("?") >= 0)
            {
                q = "&";
            }
            RedirectResult result = new RedirectResult( ConfigurationManager.AppSettings[ "ConciergeLogOut" ] + q + this.HttpContext.Request.QueryString  );

            return result;
        }

        #endregion


        #region # AbandonSessionAndSignOutFromFormsAuthentication

        /// <summary>
        /// Signout from formsauthentication and abandon session. Perform other cleanup.
        /// </summary>
        public void AbandonSessionAndSignOutFromFormsAuthentication()
        {
            try
            {
                Response.Clear();

                FormsAuthentication.SignOut();

                Session.Clear();
                Session.Abandon();

                BundleTable.Bundles.ResetAll();
                Response.Cache.SetCacheability( HttpCacheability.NoCache );
                Response.Cache.SetNoStore();

                HttpCookie formsCookie = FormsAuthentication.GetAuthCookie( User.Identity.Name, false );
                formsCookie.Expires = DateTime.Now.AddDays( -1 );
                HttpContext.Response.AppendCookie( formsCookie );

                HttpCookie cookie = HttpContext.Request.Cookies[ FormsAuthentication.FormsCookieName ];
                if ( cookie != null )
                {
                    cookie.Expires = DateTime.Now.AddDays( -1 );
                    Response.AppendCookie( cookie );
                }
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "SignOut error", ex );
            }
        }

        #endregion

        #region # RefreshNumberOfRecordsInTabsAsync

        /// <summary>
        /// Refresh Number of Records in Tabs Async
        /// </summary>
        [HttpGet]
        public void RefreshNumberOfRecordsInTabsAsync()
        {
            String searchValue = String.Empty;

            if ( Session[ SessionHelper.SearchTerm ] != null )
            {
                searchValue = Session[ SessionHelper.SearchTerm ].ToString();
            }

            UserAccount user = null;

            // Check if user is logged and put user data in session
            FilterViewModel userFilterViewModel = null;
            if ( ( Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }

            AsyncManager.QueueAction( () =>
            {
                if ( Session[ "UserData" ] != null && ( ( UserAccount )Session[ SessionHelper.UserData ] ).Username == User.Identity.Name )
                    user = ( UserAccount )Session[ "UserData" ];
                else
                    user = UserAccountServiceFacade.GetUserByName( User.Identity.Name );

                if ( user == null )
                    throw new InvalidOperationException( "User is null" );
                else
                    Session[ "UserData" ] = user;

                var userAccountIds = Session[ SessionHelper.UserAccountIds ] != null
                    ? ( List<int> )Session[ SessionHelper.UserAccountIds ]
                    : new List<int> { };

                var officerTaskListState = Session[ "OfficerTaskListState" ] != null ? ( OfficerTaskListState )Session[ "OfficerTaskListState" ] : new OfficerTaskListState();
                var cancelListState = Session[ SessionHelper.CancelListState ] != null ? ( CancelLoanListState )Session[ SessionHelper.CancelListState ] : new CancelLoanListState();
                var completedListState = Session[ SessionHelper.CompletedLoansListState ] != null ? ( CompletedLoansListState )Session[ SessionHelper.CompletedLoansListState ] : new CompletedLoansListState();
                var contactListState = Session[ "ContactListState" ] != null ? ( ContactListState )Session[ "ContactListState" ] : new ContactListState();
                var pipelineListState = Session[ "PipelineListState" ] != null ? ( PipelineListState )Session[ "PipelineListState" ] : new PipelineListState();
                var pendingApprovalListState = Session[ SessionHelper.PendingApprovalListState ] != null ? ( PendingApprovalListState )Session[ SessionHelper.PendingApprovalListState ] : new PendingApprovalListState();
                var newLoanApplicationListState = Session[ SessionHelper.NewLoanApplicationListState ] != null ? ( NewLoanApplicationListState )Session[ SessionHelper.NewLoanApplicationListState ] : new NewLoanApplicationListState();
                var alertListState = Session[ SessionHelper.AlertsListState ] != null ? ( AlertsListState )Session[ SessionHelper.AlertsListState ] : new AlertsListState();
                var completedLoansListState = Session[ SessionHelper.CompletedLoansListState ] != null ? ( CompletedLoansListState )Session[ SessionHelper.CompletedLoansListState ] : new CompletedLoansListState();
                var preapprovalListState = Session[ SessionHelper.PreApprovalListState ] != null ? ( PreApprovalListState )Session[ SessionHelper.PreApprovalListState ] : new PreApprovalListState();
                var cancelLoansListState = Session[ SessionHelper.CancelListState ] != null ? ( CancelLoanListState )Session[ SessionHelper.CancelListState ] : new CancelLoanListState();
                var orderRequestedListState = Session[ SessionHelper.OrderRequestedListState ] != null ? ( OrderRequestedListState )Session[ SessionHelper.OrderRequestedListState ] : new OrderRequestedListState();
                var orderProcessedListState = Session[ SessionHelper.OrderProcessedListState ] != null ? ( OrderProcessedListState )Session[ SessionHelper.OrderProcessedListState ] : new OrderProcessedListState();
                var orderDeliveredForReviewListState = Session[ SessionHelper.OrderDeliveredForReviewListState ] != null ? ( OrderDeliveredForReviewListState )Session[ SessionHelper.OrderDeliveredForReviewListState ] : new OrderDeliveredForReviewListState();
                var orderExceptionListState = Session[ SessionHelper.OrderExceptionListState ] != null ? ( OrderExceptionListState )Session[ SessionHelper.OrderExceptionListState ] : new OrderExceptionListState();
                var mailRoomListState = Session[ SessionHelper.MailRoomListState ] != null ? ( MailRoomListState )Session[ SessionHelper.MailRoomListState ] : new MailRoomListState();               

                var dashboardRecordNumber = new LoanCenterDashboardNumberOfRecords();
                var cancelledBorrowerStatusFilter = cancelListState.BorrowerStatusFilter == null ? null : cancelListState.BorrowerStatusFilter == BorrowerStatusType.Offline.GetStringValue() ? "0" : "1";
                var completedBorrowerStatusFilter = completedListState.BorrowerStatusFilter == null ? null : completedListState.BorrowerStatusFilter == BorrowerStatusType.Offline.GetStringValue() ? "0" : "1";
                var pipelineBorrowerStatusFilter = pipelineListState.BorrowerStatusFilter == null ? null : pipelineListState.BorrowerStatusFilter == BorrowerStatusType.Offline.GetStringValue() ? "0" : "1";
                var newLoanApplicationBorrowerStatusFilter = String.IsNullOrEmpty( newLoanApplicationListState.BorrowerStatusFilter )  ? String.Empty : newLoanApplicationListState.BorrowerStatusFilter == BorrowerStatusType.Offline.GetStringValue() ? "0" : "1";
                
                try
                {
                    dashboardRecordNumber = ContactServiceFacade.RetrieveDashboardNumberOfRecords(
                        userAccountIds, officerTaskListState.BoundDate, contactListState.BoundDate, pipelineListState.BoundDate,
                        pendingApprovalListState.ActivityType, newLoanApplicationListState.BoundDate, alertListState.BoundDate,
                        completedLoansListState.BoundDate, cancelLoansListState.BoundDate, preapprovalListState.BoundDate,
                        user.UserAccountId, searchValue, contactListState.ContactStatusFilter, alertListState.LoanPurposeFilter,
                        completedBorrowerStatusFilter, cancelledBorrowerStatusFilter, pipelineListState.LoanPurposeFilter,
                        pipelineListState.ActivityTypeFilter, pipelineBorrowerStatusFilter, alertListState.ActivityTypeFilter,
                        orderRequestedListState.BoundDate, orderRequestedListState.NonConforming, orderRequestedListState.OrderType,
                        orderRequestedListState.Rush, orderProcessedListState.BoundDate, orderProcessedListState.AppraisalOrderStatus,
                        orderDeliveredForReviewListState.BoundDate, orderDeliveredForReviewListState.AppraisalOrderStatus,
                        orderExceptionListState.BoundDate, orderExceptionListState.ExceptionType, userFilterViewModel.CompanyId,
                        userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, contactListState.LoanPurposeFilter, 
                        newLoanApplicationBorrowerStatusFilter, newLoanApplicationListState.LoanPurposeFilter,
                        mailRoomListState.BoundDate, mailRoomListState.DocumentTypeFilter, contactListState.ConciergeFilter );
                }
                catch ( Exception ex )
                {
                    TraceHelper.Error( TraceCategory.Global, "Error in RefreshNumberOfRecordsInTabsAsync", ex );
                }
                if ( dashboardRecordNumber != null )
                    AsyncManager.Parameters[ "numberOfRecords" ] = new[]
                                                                       {
                                                                           dashboardRecordNumber.TotalNumberOfTasks, 
                                                                           dashboardRecordNumber.TotalNumberOfContacts, 
                                                                           dashboardRecordNumber.TotalNumberOfPipelineItems, 
                                                                           dashboardRecordNumber.TotalNumberOfNewLoanApplicationItems, 
                                                                           dashboardRecordNumber.TotalNumberOfPendingApprovalItems, 
                                                                           dashboardRecordNumber.TotalNumberOfAlertItems, 
                                                                           dashboardRecordNumber.TotalNumberOfCompletedLoansItems,
                                                                           dashboardRecordNumber.TotalNumberOfCancelLoansItems,
                                                                           dashboardRecordNumber.TotalNumberOfPreApprovalItems,
                                                                           dashboardRecordNumber.TotalNumberOfOrderRequestedItems,
                                                                           dashboardRecordNumber.TotalNumberOfOrderProcessedItems,
                                                                           dashboardRecordNumber.TotalNumberOfOrderDeliveredForReviewItems,
                                                                           dashboardRecordNumber.TotalNumberOfOrderExceptionItems,
                                                                           dashboardRecordNumber.TotalNumberOfMailRoomItems
                                                                       };
            } );
        }

        #endregion

        #region # RefreshNumberOfRecordsInTabsCompleted

        /// <summary>
        /// Refresh Number of Records in Tabs Completed
        /// </summary>
        /// <param name="numberOfRecords"></param>
        /// <returns></returns>
        public ActionResult RefreshNumberOfRecordsInTabsCompleted( int[] numberOfRecords )
        {
            if ( AsyncManager.Parameters.ContainsKey( "AggregateException" ) && AsyncManager.Parameters[ "AggregateException" ] != null )
                return RedirectToAction( "InternalServerError", "Error" );

            if ( numberOfRecords != null )
            {
                return Json( numberOfRecords, JsonRequestBehavior.AllowGet );
            }
            else
            {
                return Json( null, JsonRequestBehavior.AllowGet );
            }
        }

        #endregion

        #region # ViewInBorrower

        /// <summary>
        /// View in Borrower
        /// </summary>
        /// <param name="loanId"></param>
        /// <returns></returns>
        public String ViewInBorrower( Guid loanId, string userAccId )
        {
            int userAccountId = 0;
            int.TryParse( userAccId, out userAccountId );

            if ( userAccountId == 0 )
                userAccountId = LoanServiceFacade.RetrieveUserAccountIdByLoanId( loanId, -1 );

            UserAccount concierge = ( UserAccount )HttpContext.Session[ "UserData" ];

            LoanServiceFacade.ViewInBorrower( concierge.UserAccountId, loanId, userAccountId );

            UserAccount user = UserAccountServiceFacade.GetUserById( userAccountId );

            Guid token = MML.Common.Impersonation.ImpersonationToken.GetToken();
            bool isInserted = ImpersonationTokenServiceFacade.InsertImpersonationToken( token, loanId, userAccountId );

            GetStartedHelper getStartedHelper = new GetStartedHelper();
            GetStarted getStarted = getStartedHelper.GetStarted( HttpContext, concierge, token, user.Username, false, loanId: loanId );
            return getStarted.BorrowerUrl;
        }

        #endregion

        #region # ShowLog

        /// <summary>
        /// Show Log
        /// </summary>
        /// <param name="loanId"></param>
        /// <returns></returns>
        public ActionResult ShowLog( String loanId, String prospectId, bool source = false )
        {
            UserAccount loggedUser = null;
            int prospect;
            Int32.TryParse( prospectId, out prospect );

            if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
            {
                loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
            }
            else
            {
                // TODO: Handle if user don't have priviledges to see this log
                throw new UnauthorizedAccessException( "User is not authorized to access this method!" );
            }

            var logItems = LogServiceFacade.RetrieveLogByTypeAndLoanId( new Guid( loanId ), prospect, LogItemType.ConversationLog,
                                                        loggedUser.UserAccountId );

            ViewBag.LogHeader = "Notes";
            ViewBag.Source = source;

            return PartialView( "Log/_log", new LogViewModel { Log = logItems, LoanId = new Guid( loanId ) } );
        }

        #endregion

        #region # Show RateOption

        /// <summary>
        /// Rate Options
        /// </summary>
        /// <param name="loanId"></param>
        /// <returns></returns>
        public ActionResult ShowRateOption( String loanId, String prospectId, bool builtInMode = false )
        {
            UserAccount loggedUser = null;
            int prospect;
            Int32.TryParse( prospectId, out prospect );
            Guid loan = Guid.Empty;

            if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
            {
                loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
            }
            else
            {
                // TODO: Handle if user don't have priviledges to see this log
                throw new UnauthorizedAccessException( "User is not authorized to access this method!" );
            }

            if ( prospect == 0 && !loanId.IsNullEmptyOrSpaces() )
            {

                Guid.TryParse( loanId, out loan );
                if ( loan != Guid.Empty )
                {
                    Contact contact = ContactServiceFacade.GetContact( loan, 0 );
                    if ( contact != null )
                    {
                        prospect = contact.ContactId;
                    }
                }
            }

            RateOptionViewModel mainItem = new RateOptionViewModel();
            mainItem.BuiltInMode = builtInMode;
            RateOptionItemViewModel rateOptionItem = null;
            List<SentEmailItem> emailList = ContactServiceFacade.RetrieveSentEmailItems( prospect, loggedUser.UserAccountId );
            if ( emailList != null && emailList.Count > 0 )
            {
                mainItem.RateOptionList = new List<RateOptionItemViewModel>();
                foreach ( SentEmailItem item in emailList )
                {
                    rateOptionItem = new RateOptionItemViewModel();
                    rateOptionItem.ContactId = item.ContactId;
                    rateOptionItem.DateCreated = item.DateCreated;
                    rateOptionItem.DistributionList = item.EmailAddress;
                    rateOptionItem.SentEmailId = item.Id;
                    rateOptionItem.IsWhatIfRateOption = item.IsWhatIfRateOption;
                    rateOptionItem.LoanAmount = item.LoanAmount;
                    rateOptionItem.LTV = item.LTV;
                    rateOptionItem.CLTV = item.CLTV;
                    rateOptionItem.DebtToIncomeRatio = item.DebtToIncomeRatio;
                    if ( item.Products != null && item.Products.Count > 0 && item.Products.Count < 2 )
                    {
                        rateOptionItem.Product = item.Products[ 0 ].ProductName;
                        rateOptionItem.Rate = item.Products[ 0 ].Rate;
                        rateOptionItem.Apr = item.Products[ 0 ].APR;
                        rateOptionItem.Points = ( item.Products[ 0 ].Points * ( double )item.LoanAmount ) / 100;
                        rateOptionItem.PointsPercents = item.Products[ 0 ].Points;

                    }
                    rateOptionItem.ReportRepositoryItemId = item.ReportRepositoryItemId;
                    mainItem.RateOptionList.Add( rateOptionItem );

                }
            }

            ViewBag.Source = builtInMode;

            return PartialView( "Commands/_rateOption", mainItem );
        }


        [HttpPost]
        public ActionResult UpdateRateOptionsNote( SentEmailItem data )
        {
            //var messageModelReload = new AppraisalConfirmationMessage();

            //var messageModel = new ErrorMessage();
            UserAccount loggedUser = null;

            try
            {


                if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
                {
                    loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
                }
                else
                {
                    // TODO: Handle if user don't have priviledges to see this log
                    throw new UnauthorizedAccessException( "User is not authorized to access this method!" );
                }
                ContactServiceFacade.UpdateSentEmailItemNote( data, loggedUser.UserAccountId );



            }
            catch ( Exception exception )
            {


                TraceHelper.Error( TraceCategory.OrderAppraisal, "Failed to save appraisal order", exception );
            }

            return Json( true );
        }

        #endregion
        #region # ShowConversationLog
        /// <summary>
        /// Show Conversation Log (popup)
        /// </summary>
        /// <param name="conversationLogId"></param>
        /// <param name="loanId"></param>
        /// <returns></returns>
        public ActionResult ShowConversationLog( String conversationLogId, String loanId, bool source = false )
        {
            UserAccount loggedUser = null;
            var logItem = new LogItem();
            Guid logId;
            Guid loan;

            if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
            {
                loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
            }
            else
            {
                // TODO: Handle if user don't have priviledges to see this log
                throw new UnauthorizedAccessException( "User is not authorized to access this method!" );
            }

            Guid.TryParse( loanId, out loan );

            if ( Guid.TryParse( conversationLogId, out logId ) )
            {
                logItem = LogServiceFacade.RetrieveLogByLogId( logId, loggedUser.UserAccountId );
            }

            var subjects = LogServiceFacade.RetrieveConversationSubject();
            if ( subjects != null )
                subjects = subjects.OrderBy( s => s.Name ).ToList();

            var topics = LogServiceFacade.RetrieveConversationTopic();
            if ( topics != null )
                topics = topics.OrderBy( t => t.Name ).ToList();
            if ( logItem.Id.Equals( Guid.Empty ) )
                ViewBag.ConversationLogItemHeader = "Add a Note";
            else
                ViewBag.ConversationLogItemHeader = "View a Note";

            ViewBag.Source = source;
            return PartialView( "Log/_conversationLogItem",
                               new LogItemViewModel { LogItem = logItem, ConversationSubjects = subjects, ConversationTopics = topics, LoanId = loan } );
        }

        #endregion

        #region # SaveConversationLog

        /// <summary>
        /// Save Conversation Log
        /// </summary>
        /// <param name="loanId"></param>
        /// <param name="logId"></param>
        /// <param name="subject"></param>
        /// <param name="topic"></param>
        /// <param name="comment"></param>
        /// <param name="viewableonborower"></param>
        /// <returns></returns>
        public String SaveConversationLog( String loanId, String logId, String subject, String topic, String comment, String viewableonborower, String prospectId )
        {
            UserAccount loggedUser = null;
            Guid id;
            Guid loan;
            Boolean viewable;
            int prospect;

            if ( HttpContext != null && HttpContext.Session != null && HttpContext.Session[ SessionHelper.UserData ] != null )
            {
                loggedUser = ( UserAccount )HttpContext.Session[ SessionHelper.UserData ];
            }
            else
            {
                // TODO: Handle if user don't have priviledges to see this log
                throw new UnauthorizedAccessException( "User is not authorized to access this method!" );
            }

            Guid.TryParse( logId, out id );
            Guid.TryParse( loanId, out loan );
            Boolean.TryParse( viewableonborower, out viewable );
            Int32.TryParse( prospectId, out prospect );

            var logItem = new LogItem
                                {
                                    Category = topic,
                                    LoanId = loan,
                                    Comment = comment,
                                    ViewableOnBorrower = viewable,
                                    Subject = subject,
                                    Type = LogItemType.ConversationLog,
                                    User = loggedUser.Username,
                                    ContactId = prospect
                                };

            if ( !loan.Equals( Guid.Empty ) || prospect > 0 )
            {
                LogServiceFacade.AddNewConversationLog( logItem, loggedUser.UserAccountId );
                return Boolean.TrueString;
            }

            return Boolean.FalseString;
        }

        #endregion

        #region # ShowEmailDetails

        /// <summary>
        /// Retrieve Email details for selected email
        /// </summary>
        /// <param name="emailId"></param>
        /// <returns></returns>
        public ActionResult ShowEmailDetails( String emailId )
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

            Int32 mailId = 0;
            if ( emailId != null )
                Int32.TryParse( emailId, out mailId );

            if ( mailId == 0 )
                throw new ArgumentNullException( "Email Id is not correct!" );

            var email = ContactServiceFacade.RetrieveSentEmailItem( mailId, loggedUser.UserAccountId );

            ViewBag.IsWhatIfRateOption = email.IsWhatIfRateOption.GetValueOrDefault() ? "WhatIfRateOption" : "EmailRateOption";

            ViewBag.EmailHeader = email.DateCreated.ToString( "ddd, dd MMM yyyy hh':'mm':'ss tt" );
            ViewBag.EmailContent = email.HtmlContent;

            return PartialView( "_emaildetails" );
        }

        #endregion

        #region # GetCurrentTabForSearc hData
        /// <summary>
        /// Get Current Tab For SearchData
        /// </summary>
        /// <param name="searchValue"></param>
        /// <returns></returns>
        public String GetCurrentTabForSearchData( String searchValue )
        {
            if ( searchValue != null )
                searchValue = searchValue.Trim();

            Session[ SessionHelper.SearchTerm ] = searchValue;

            //stay on current tab
            return GetCurrentTabForRefresh();
        }

        #endregion

        #region # GetCurrentTabForRefresh

        /// <summary>
        /// Get Current Tab for Refresh
        /// </summary>
        /// <returns></returns>
        public String GetCurrentTabForRefresh()
        {
            if ( Session[ SessionHelper.CurrentTab ] is LoanCenterTab )
                return (( LoanCenterTab )Session[ SessionHelper.CurrentTab ]).ToString();

            return String.Empty;
        }

        public String GetCurrentWorkQueue()
        {
            if ( Session[ SessionHelper.CurrentTab ] is LoanCenterTab )
                return ( ( LoanCenterTab )Session[ SessionHelper.CurrentTab ] ).GetStringValue();

            return String.Empty;
        }

        #endregion

        [HttpGet]
        public bool Aus_DU_Export(Guid loanId, string caseId)
        {
            return SubmitToAUS("Integration.AUS.DU", loanId, caseId);
        }

        [HttpGet]
        public bool Aus_LP_Export(Guid loanId, string caseId)
        {
            return SubmitToAUS("Integration.AUS.LP", loanId, caseId);
        }

        [HttpGet]
        public ActionResult GetServiceTrackingContract(Guid serviceTrackingId)
        {
            var errorReturn=Json(new ServiceTrackingContract() { ErrorMessage = "An error occured while retrieving the data" }, JsonRequestBehavior.AllowGet);
            try
            {
                var data = AUSServiceFacade.ServiceTrackingRetrieveByServiceTrackingId(serviceTrackingId, AusType.NotSpecified);
                return data != null && data.Count > 0 ?
                    Json(data[0], JsonRequestBehavior.AllowGet) :
                    errorReturn;                    
            }
            catch
            {
                return errorReturn;
            }
        }

        [HttpGet]
        public bool InitiateDisclosure( Guid loanId )
        {
            bool retVal = false;

            Int32 userAccountId = -1;
            UserAccount user = new UserAccount();
            if ( Session[ SessionHelper.UserData ] != null && ( ( UserAccount )Session[ SessionHelper.UserData ] ).Username == User.Identity.Name )
            {
                user = ( UserAccount )Session[ SessionHelper.UserData ];
            }
            else
            {
                user = UserAccountServiceFacade.GetUserByName( User.Identity.Name );
            }

            if ( user != null )
            {
                userAccountId = user.UserAccountId;
            }

            bool useDigitalDocsImpIntegration = GeneralSettingsServiceFacade.IsIMPIntegrationForDigitalDocsEnabled();
            
            DigitalDocsServiceFacade.RequestReDisclosuresPackage( loanId, userAccountId );
            
            if ( useDigitalDocsImpIntegration )
            {
                var eventContentDisclosures = new EventContentDisclosures();
                eventContentDisclosures.UserAccountId = userAccountId;
                string contentXml = Event.ContentObjectSerialize( eventContentDisclosures );

                var impEvent = new Event( "Event.Integration.Disclosures.ExecuteRules", User.Identity.Name, loanId, contentXml );
                retVal = EventsServiceFacade.CreateEvent( impEvent );
            }

            return retVal;
        }

        [HttpGet]
        public bool RetryLoanServiceEvent( string loanServiceEventType, string loanServiceEventIdEncrypted )
        {
            string rawLoanServiceEventId = EncryptionHelper.DecryptRijndael( loanServiceEventIdEncrypted.Trim(), EncriptionKeys.Default );
            long loanServiceEventId = 0;
            if ( !long.TryParse( rawLoanServiceEventId, out loanServiceEventId ) || loanServiceEventId == 0 )
                throw new Exception( "Valid Loan Service Event Id must be provided." );

            switch ( loanServiceEventType.ToLower() )
            {
                case "event":
                    return EventsServiceFacade.RetryEvent( loanServiceEventId );
                case "integrationstep":
                    return IntegrationsServiceFacade.RetryIntegrationService( loanServiceEventId );
                default:
                    return false;
            } 
        }

        [HttpGet]
        public bool TESTCreateServiceEvent( Guid loanId )
        {
            var eventContent = new EventContentTESTCreateService()
            {
                Party = "Test Party",
                ServiceType = "Test ServiceType",
                Product = "Test Product",
                Status = "Test Status",
                Vendor = "Test Vendor",
                VendorTransactionId = null // If left empty or null, this will be filled with Loan Service ID
            };
            //var eventContentXml = SerializationHelper.SerializeToXml( eventContent );
            //var eventContentXml = DataContractSerializationHelper.Serialize( eventContent );
            var eventContentXml = Event.ContentObjectSerialize( eventContent );

            var impEvent = new Event( "TEST.CreateService", User.Identity.Name, loanId, eventContentXml );
            return EventsServiceFacade.CreateEvent( impEvent );
        }

        private bool SubmitToAUS(string eventName, Guid loanId, string caseId)
        {
            var user = new UserAccount();
            var userAccountId = -1;

            user = Session[SessionHelper.UserData] != null && ((UserAccount)Session[SessionHelper.UserData]).Username == User.Identity.Name ?
                (UserAccount)Session[SessionHelper.UserData] : UserAccountServiceFacade.GetUserByName(User.Identity.Name);

            if (user != null)
                userAccountId = user.UserAccountId;

            var impEvent = new Event(eventName, UserAccountServiceFacade.GetUserFullNameByUserAccountId(userAccountId), loanId);
            impEvent.RelatedData.Add("CaseId", caseId.Trim());
            return EventsServiceFacade.CreateEvent(impEvent);
        }
    }
}