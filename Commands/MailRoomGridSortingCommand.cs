using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Common.Helpers;
using System.Web.WebPages.Html;

namespace MML.Web.LoanCenter.Commands
{
    public class MailRoomGridSortingCommand : ICommand
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

            /* State retrieval */
            MailRoomViewModel mailRoomViewModel = null;
            if ( _httpContext.Session[ SessionHelper.MailRoomViewModel ] != null )
                mailRoomViewModel = new MailRoomViewModel().FromXml( _httpContext.Session[ "MailRoomViewModel" ].ToString() );
            else
                mailRoomViewModel = new MailRoomViewModel();

            MailRoomListState mailRoomListState = null;
            if ( _httpContext.Session[ SessionHelper.MailRoomListState ] != null )
                mailRoomListState = ( MailRoomListState )_httpContext.Session[ "MailRoomListState" ];
            else
                mailRoomListState = new MailRoomListState();

            UserAccount user = null;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( _httpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            /* parameter processing */
            MailRoomAttribute newSortColumn;
            if ( !InputParameters.ContainsKey( "Column" ) )
                throw new ArgumentException( "Column value was expected!" );
            else
                newSortColumn = ( MailRoomAttribute )Enum.Parse( typeof( MailRoomAttribute ), InputParameters[ "Column" ].ToString() );

            // switch direction
            if ( mailRoomListState.SortColumn == newSortColumn && mailRoomListState.SortDirection == "ASC" )
            {
                mailRoomListState.SortDirection = "DESC";
            }
            else
                mailRoomListState.SortDirection = "ASC";

            mailRoomListState.SortColumn = newSortColumn;
            mailRoomListState.CurrentPage = 1;

            /* Command processing */
            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }
            var mailRoomViewData = MailRoomDataHelper.RetrieveMailRoomViewModel( mailRoomListState,
                                                                                _httpContext.Session[ "UserAccountIds" ] !=
                                                                                null
                                                                                    ? ( List<int> )
                                                                                      _httpContext.Session[
                                                                                          "UserAccountIds" ]
                                                                                    : new List<int> { },
                                                                                user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );


            if ( mailRoomViewModel != null )
            {
                mailRoomViewModel.MailRoomItems = mailRoomViewData.MailRoomItems;
                mailRoomViewModel.PageCount = mailRoomViewData.PageCount;
                mailRoomViewModel.TotalItems = mailRoomViewData.TotalItems;

                MailRoomGridHelper.ProcessPagingOptions( mailRoomListState, mailRoomViewModel );
            }


            _viewName = "Queues/_mailRoom";
            _viewModel = mailRoomViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.MailRoomViewModel ] = mailRoomViewModel.ToXml();
            _httpContext.Session[ SessionHelper.MailRoomListState ] = mailRoomListState;
        }
    }
}