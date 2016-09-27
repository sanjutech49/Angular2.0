using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Common.Helpers;
using System.Web.WebPages.Html;

namespace MML.Web.LoanCenter.Commands
{
    /// <summary>
    /// Handles new selected user from filter and retrieves new list of Tasks or Prospects, based on UserFilterContext value.
    /// Will be used by Administrators and Branch managers, other users don't have filters
    /// </summary>
    public class UserFilterSelectedUserChangedCommand : CommandsBaseUserFilter
    {

        public override void Execute()
        {
            base.Execute();

            FilterViewModel userFilterViewModel;
            if ( ( base.HttpContext != null ) && ( base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
            }
            UserAccount user;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ] ).Username == base.HttpContext.User.Identity.Name )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( base.HttpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );
            /* parameter processing */
            Int32 selectedUserId;
            if (!InputParameters.ContainsKey("UserId"))
                throw new ArgumentException("UserId was expected!");
            else
            {
                selectedUserId = Convert.ToInt32(InputParameters["UserId"]);
                userFilterViewModel.UserId = selectedUserId;
            }
           
            var newUserAccountIds = selectedUserId > 0 ? new List<int> { selectedUserId } : AccountHelper.PopulateUserAccountIdsList( user );
            HttpContext.Session[SessionHelper.UserAccountIds] = newUserAccountIds;

            String searchValue = CommonHelper.GetSearchValue( base.HttpContext );

            switch(userFilterViewModel.FilterContext)
            {
                case FilterContextEnum.OfficerTask:
                    RetrieveTasks( base.User, newUserAccountIds );
                    break;
                case FilterContextEnum.Contact:
                    RetrieveContacts( newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.Pipeline:
                    RetrieveQueueLoans<PipelineListState, PipelineViewModel>( new PipelineListState(), new PipelineViewModel(), SessionHelper.PipelineListState,
                        "Queues/_pipeline", SessionHelper.PipelineViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.NewLoanApplication:
                    RetrieveQueueLoans<NewLoanApplicationListState, NewLoanApplicationViewModel>( new NewLoanApplicationListState(), new NewLoanApplicationViewModel(), SessionHelper.NewLoanApplicationListState,
                        "Queues/_newLoanApplication", SessionHelper.NewLoanApplicationViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.Alerts:
                    RetrieveQueueLoans<AlertsListState, AlertsViewModel>( new AlertsListState(), new AlertsViewModel(), SessionHelper.AlertsListState,
                        "Queues/_alerts", SessionHelper.AlertViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.PendingApproval:
                    RetrieveQueueLoans<PendingApprovalListState, AlertsViewModel>( new PendingApprovalListState(), new AlertsViewModel(), SessionHelper.PendingApprovalListState,
                        "Queues/_pendingapproval", SessionHelper.PendingApprovalViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.CompletedLoans:
                    RetrieveQueueLoans<CompletedLoansListState, CompletedLoansViewModel>( new CompletedLoansListState(), new CompletedLoansViewModel(), SessionHelper.CompletedLoansListState,
                        "Queues/_completedloans", SessionHelper.CompletedLoansViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.Cancel:
                    RetrieveQueueLoans<CancelLoanListState, CancelViewModel>( new CancelLoanListState(), new CancelViewModel(), SessionHelper.CancelListState,
                        "Queues/_cancel", SessionHelper.CancelViewModel, newUserAccountIds, searchValue );    
                    break;
                case FilterContextEnum.PreApproval:
                    RetrieveQueueLoans<PreApprovalListState, PreApprovalViewModel>( new PreApprovalListState(), new PreApprovalViewModel(), SessionHelper.PreApprovalListState,
                        "Queues/_preapproval", SessionHelper.PreApprovalViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.OrderRequested:
                    RetrieveQueueLoans<OrderRequestedListState, OrderRequestedViewModel>( new OrderRequestedListState(), new OrderRequestedViewModel(), SessionHelper.OrderRequestedListState,
                        "Queues/_orderRequested", SessionHelper.OrderRequestedViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.OrderProcessed:
                    RetrieveQueueLoans<OrderProcessedListState, OrderProcessedViewModel>( new OrderProcessedListState(), new OrderProcessedViewModel(), SessionHelper.OrderProcessedListState,
                        "Queues/_orderProcessed", SessionHelper.OrderProcessedViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.OrderDeliveredForReview:
                    RetrieveQueueLoans<OrderDeliveredForReviewListState, OrderDeliveredForReviewViewModel>( new OrderDeliveredForReviewListState(), new OrderDeliveredForReviewViewModel(), SessionHelper.OrderDeliveredForReviewListState,
                        "Queues/_orderDeliveredForReview", SessionHelper.OrderDeliveredForReviewViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.OrderException:
                    RetrieveQueueLoans<OrderExceptionListState, OrderExceptionViewModel>( new OrderExceptionListState(), new OrderExceptionViewModel(), SessionHelper.OrderExceptionListState,
                        "Queues/_orderException", SessionHelper.OrderExceptionViewModel, newUserAccountIds, searchValue );
                    break;
                case FilterContextEnum.MailRoom:
                    RetrieveQueueLoans<MailRoomListState, MailRoomViewModel>( new MailRoomListState(), new MailRoomViewModel(), SessionHelper.MailRoomListState,
                        "Queues/_mailRoom", SessionHelper.MailRoomViewModel, newUserAccountIds, searchValue );
                    break;

                default:
                    base.ViewName = string.Empty;
                    base.ViewData = null;
                    break;
            }

            /* Persist new state */
            base.HttpContext.Session[SessionHelper.FilterViewModel] = userFilterViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.UserAccountIds ] = newUserAccountIds;
        }

        private void RetrieveQueueLoans<T, M>( T listState, M result, String listStateName, String viewName, String modelName,
            List<Int32> userAccounts, String searchValue )
            where T : IListState
        {
            if ( base.HttpContext.Session[ listStateName ] != null )
                listState = ( T )base.HttpContext.Session[ listStateName ];

            // reset Page Number to 1st on user change
            listState.CurrentPage = 1;
            base.HttpContext.Session[ SessionHelper.ActivityTypeFilter ] = null;

            result = ( M )HandleRetrieveQueueLoans<T>( listState, userAccounts, base.User.UserAccountId, searchValue );

            base.ViewName = viewName;
            base.ViewData = result;

            /* Persist new state */
            base.HttpContext.Session[ listStateName ] = listState;
            base.HttpContext.Session[ modelName ] = result.ToXml();
        }

        /// <summary>
        /// Based on Type calls different methods for retreiving data
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="listState"></param>
        /// <param name="userAccounts"></param>
        /// <param name="userId"></param>
        /// <param name="searchValue"></param>
        /// <returns></returns>
        private object HandleRetrieveQueueLoans<T>( T listState, List<int> userAccounts, int userId, String searchValue )
        {
            FilterViewModel userFilterViewModel = null;
            if ( ( base.HttpContext != null ) && ( base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }

            if ( listState is NewLoanApplicationListState )
            {
                return ( object )NewLoanApplicationDataHelper.RetrieveNewApplicationViewModel( ( listState as NewLoanApplicationListState ), userAccounts, userId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );
            }
            if ( listState is OrderExceptionListState )
            {
                return ( object )OrderExceptionDataHelper.RetrieveOrderExceptionViewModel( ( listState as OrderExceptionListState ), userAccounts, userId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );
            }
            if ( listState is OrderDeliveredForReviewListState )
            {
                return ( object )OrderDeliveredForReviewDataHelper.RetrieveOrderDeliveredForReviewViewModel( ( listState as OrderDeliveredForReviewListState ), userAccounts, userId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );
            }
            if ( listState is OrderProcessedListState )
            {
                return ( object )OrderProcessedDataHelper.RetrieveOrderProcessedViewModel( ( listState as OrderProcessedListState ), userAccounts, userId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );
            }
            if ( listState is OrderRequestedListState )
            {
                return ( object )OrderRequestedDataHelper.RetrieveOrderRequestedViewModel( ( listState as OrderRequestedListState ), userAccounts, userId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );
            }
            if ( listState is CompletedLoansListState )
            {
                return ( object )CompletedLoansDataHelper.RetrieveCompletedLoansViewModel( ( listState as CompletedLoansListState ), userAccounts, userId, searchValue, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId );
            }
            if ( listState is CancelLoanListState )
            {
                return ( object )CancelDataHelper.RetrieveCancelViewModel( ( listState as CancelLoanListState ), userAccounts,
                    ( ( listState as CancelLoanListState ) ).BoundDate, userId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );
            }
            if ( listState is AlertsListState )
            {
                return ( object )AlertsDataHelper.RetrieveAlertViewModel( ( listState as AlertsListState ), userAccounts,
                    ( listState as AlertsListState ).BoundDate, userId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId );
            }
            if ( listState is PendingApprovalListState )
            {
                return ( object )PendingApprovalDataHelper.RetrievePendingApprovalViewModel( ( listState as PendingApprovalListState ), userAccounts, userId, searchValue, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId 
                    );
            }
            if ( listState is PreApprovalListState )
            {
                return ( object )PreApprovalDataHelper.RetrievePreApprovalViewModel( ( listState as PreApprovalListState ), userAccounts, userId, searchValue, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId );
            }
            if ( listState is PipelineListState )
            {
                return ( object )PipelineDataHelper.RetrievePipelineViewModel( ( listState as PipelineListState ), userAccounts, userId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId,userFilterViewModel.BranchId, searchValue );
            }

            if ( listState is MailRoomListState )
            {
                return ( object )MailRoomDataHelper.RetrieveMailRoomViewModel( ( listState as MailRoomListState ), userAccounts, userId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );
            }

            return null;
        }

        private void RetrieveContacts( List<int> newUserAccountIds, String searchValue )
        {
            ContactListState contactListState = null;
            if ( ( base.HttpContext != null ) && ( base.HttpContext.Session[ SessionHelper.ContactListState ] != null ) )
            {
                contactListState = ( ContactListState )base.HttpContext.Session[ SessionHelper.ContactListState ];
            }
            else
            {
                contactListState = new ContactListState();
            }

            // reset page to 1st on user change
            FilterViewModel userFilterViewModel = null;
            if ( ( base.HttpContext != null ) && ( base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                userFilterViewModel.FilterContext = FilterContextEnum.Contact;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
                userFilterViewModel.FilterContext = FilterContextEnum.Contact;
            }

            contactListState.CurrentPage = 1;

            UserAccount user;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ] ).Username == base.HttpContext.User.Identity.Name )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( base.HttpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            var contactViewData = ContactServiceFacade.RetrieveContactsView(newUserAccountIds,
                                                                            contactListState.BoundDate,
                                                                            contactListState.CurrentPage,
                                                                            EnumHelper.GetStringValue(contactListState.SortColumn),
                                                                            contactListState.SortDirection, user.UserAccountId, searchValue, contactListState.ContactStatusFilter,
                                                                            userFilterViewModel.CompanyId,
                                                                            userFilterViewModel.ChannelId,
                                                                            userFilterViewModel.DivisionId,
                                                                            contactListState.LoanPurposeFilter,
                                                                            userFilterViewModel.BranchId,
                                                                            contactListState.ConciergeFilter
                                                                            );

            

            ContactViewModel contactViewModel = new ContactViewModel();

            if (contactViewData != null)
            {
                contactViewModel.Contacts = contactViewData.ContactsItems;
                contactViewModel.PageCount = contactViewData.TotalPages;
                contactViewModel.TotalItems = contactViewData.TotalItems;
                ContactGridHelper.ApplyClassCollection( contactViewModel );
                ContactGridHelper.ProcessPagingOptions(contactListState, contactViewModel);
            }

            contactViewModel.ProspectLOConciergeList = ContactViewModelHelper.PopulateProspectLoanOfficers( userFilterViewModel, base.HttpContext );

            // populate prospect statuses
            ContactViewModelHelper.PopulateProspectStatuses( contactViewModel );

            contactViewModel.ProspectStatusList = ContactViewModelHelper.PopulateProspectStatusList( contactViewModel );
            contactViewModel.LoanPurposeList = new List<LoanTransactionType>( Enum.GetValues( typeof( LoanTransactionType ) ).Cast<LoanTransactionType>().Skip( 1 ) );

            ContactDataHelper contactDataHelper = new ContactDataHelper();
            contactDataHelper.PopulateConciergeFilterList( contactListState, base.HttpContext, contactViewModel );

            base.ViewName = "Queues/_contact";
            base.ViewData = contactViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.ContactViewModel ] = contactViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.ContactListState ] = contactListState;
            base.HttpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
        }

        private void RetrieveTasks( UserAccount user, List<int> newUserAccountIds)
        {

            OfficerTaskListState officerTaskListState = new OfficerTaskListState();
            if ( base.HttpContext.Session[ SessionHelper.OfficerTaskListState ] != null )
                officerTaskListState = ( OfficerTaskListState )base.HttpContext.Session[ SessionHelper.OfficerTaskListState ];

            // reset page to 1st on user change
            officerTaskListState.CurrentPage = 1;

            var result = TaskServiceFacade.GetTasks( newUserAccountIds,
                                                   officerTaskListState.BoundDate,
                                                   officerTaskListState.CurrentPage,
                                                   officerTaskListState.SortColumn.GetStringValue(),
                                                   officerTaskListState.SortDirection,
                                                   user.UserAccountId
                                                   );

            OfficerTasksViewModel taskViewModel = new OfficerTasksViewModel
            {

                TaskOwners = PopulateTaskOwners()
            };

            if ( result != null )
            {
                taskViewModel.OfficerTasks = result.OfficerTasks;
                taskViewModel.PageCount = result.TotalPages;
                taskViewModel.TotalItems = result.TotalItems;
                taskViewModel.CurrentPage = officerTaskListState.CurrentPage;
            }

            OfficerTaskGridHelper.ProcessPagingOptions( officerTaskListState, taskViewModel );

            ApplyClassCollection( taskViewModel );

            base.ViewName = "_officertask";
            base.ViewData = taskViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OfficerTaskListState ] = officerTaskListState;
            base.HttpContext.Session[ SessionHelper.OfficerTaskViewModel ] = taskViewModel.ToXml();
        }
        
        private List<SelectListItem> PopulateTaskOwners()
        {
            if ( ( base.HttpContext != null ) && ( base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                var filterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                return filterViewModel.Users.Where(item => Convert.ToInt32(item.Value) > 0).ToList();
            }
            else return new List<SelectListItem>();
        }

        private void PopulateUserAccountIds( UserAccount user, List<int> newUserAccountIds, FilterViewModel userFilterViewModel, int selectedUserId)
        {
            if ( selectedUserId == 0 || selectedUserId == -1 ) // Select One option selected  OR  View All option selected
            {
                newUserAccountIds.Clear();

                // TODO: Refactor:
                // Branch Manager, Team Leader and Division Manager roles filter WQ records by assigned branch(es).
                // For others we filter by users which are currently in selected branch.
                if ( user.Roles.Any( r => r.RoleName.Equals( RoleName.BranchManager ) ) ||
                    user.Roles.Any( r => r.RoleName.Equals( RoleName.TeamLeader ) ) ||
                    user.Roles.Any( r => r.RoleName.Equals( RoleName.DivisionManager ) ) )
                {
                    return;
                }

                newUserAccountIds.AddRange( userFilterViewModel.Users.Where( u => Int32.Parse( u.Value ) > 0 ).Select( usr => Convert.ToInt32( usr.Value ) ) );
            }
            else // single user selected
            {
                newUserAccountIds.Clear();
                newUserAccountIds.Add( selectedUserId );
            }
        }

        private static void ApplyClassCollection(OfficerTasksViewModel taskViewModel)
        {
            if ( taskViewModel.OfficerTasks == null )
                return;

            // Business rule
            foreach (var item in taskViewModel.OfficerTasks)
            {
                if (item.DueDate < DateTime.Now.Date)
                {
                    item.ClassCollection = "tasktablelistduedate";
                }
                else
                {
                    item.ClassCollection = "tasktablelist";
                }
            }
        }
    }
}
