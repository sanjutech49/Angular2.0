using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Common.Helpers;
using MML.Web.LoanCenter.ViewModels;
using System.Web.WebPages.Html;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Commands
{
    /// <summary>
    /// Opens MailRoom tab showing MailRoom grid with state that is preserved in session
    /// </summary>
    public class OpenMailRoomTabCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;

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

        public void Execute()
        {
            String searchValue = CommonHelper.GetSearchValue( _httpContext );

            MailRoomListState mailroomListState = null;

            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.MailRoomListState ] != null ) )
                mailroomListState = ( MailRoomListState )_httpContext.Session[ SessionHelper.MailRoomListState ];
            else
                mailroomListState = new MailRoomListState();

            if ( InputParameters != null && InputParameters.ContainsKey( "DocumentTypeFilter" ) )
                mailroomListState.DocumentTypeFilter = InputParameters[ "DocumentTypeFilter" ].ToString();
            else
                mailroomListState.DocumentTypeFilter = "";

            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                userFilterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.MailRoom;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
                userFilterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.MailRoom;
            }

            UserAccount user = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );

            MailRoomViewModel mailRoomViewModel = null;

            if ( InputParameters != null && InputParameters.ContainsKey( "ChangeStatuses" ) && InputParameters[ "ChangeStatuses" ].ToString().Trim() == "true"
                && InputParameters.ContainsKey( "LoanId" ) )
            {
                Guid loanId;
                if ( Guid.TryParse( InputParameters[ "LoanId" ].ToString().Trim(), out loanId ) )
                {
                    if ( _httpContext.Session[ SessionHelper.MailRoomViewModel ] != null )
                        mailRoomViewModel = new MailRoomViewModel().FromXml( _httpContext.Session[ SessionHelper.MailRoomViewModel ].ToString() );

                    if ( mailRoomViewModel != null && mailRoomViewModel.MailRoomItems != null && mailRoomViewModel.MailRoomItems.Any() )
                    {
                        MailRoomView currentItem = mailRoomViewModel.MailRoomItems.FirstOrDefault( p => p.LoanId == loanId );
                        DocumentClass documentClass = currentItem != null ? currentItem.DocumentClass : DocumentClass.None;
                        MailRoomGridHelper.ChangeStatusesForDocumentsToSent( loanId, user.UserAccountId, documentClass );
                    }
                }
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";
            // reset Page Number to 1st on Tab change
            if ( !refresh )
                mailroomListState.CurrentPage = 1;

            mailRoomViewModel = new MailRoomViewModel();
            mailRoomViewModel = MailRoomDataHelper.RetrieveMailRoomViewModel( mailroomListState,
                                                           _httpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                               ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                                                               : new List<int> { }, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );

            _viewName = "Queues/_mailRoom";
            _viewModel = mailRoomViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.MailRoomViewModel ] = mailRoomViewModel.ToXml();
            _httpContext.Session[ SessionHelper.MailRoomListState ] = mailroomListState;
            _httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.MailRoom;
        }

        private List<SelectListItem> PopulateProspectLoanOfficers()
        {
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                var filterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                return filterViewModel.Users.Where( item => Convert.ToInt32( item.Value ) > 0 ).ToList();
            }
            else return new List<System.Web.WebPages.Html.SelectListItem>();
        }
    }
}