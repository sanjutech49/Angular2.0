using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Common;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Commands
{
    /// <summary>
    /// Opens Home tab showing Task grid with state that is preserved in session (Officer task list state, page number reset to 1)
    /// </summary>
    public class RetrieveLoanServicesCommand : ICommand
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
            var user = AccountHelper.GetUserAccount( HttpContext );
            if ( user == null )
                throw new InvalidOperationException( "UserData is null" );

            Guid loanId = Guid.Empty;
            if ( !InputParameters.ContainsKey( "LoanId" ) )
                throw new ArgumentException( "LoanId was expected!" );
            else
                Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId );

            LoanServicesViewModel loanServicesViewModel = new LoanServicesViewModel();

            if ( loanId != Guid.Empty )
            {
                // used for testing purposes only - REMOVE OTHERWISE
                //loanId = new Guid( "4DAE6B31-3DA8-42EB-BCAC-8F0D661646AB" );

                // Get filters
                var filters = LoanServiceFacade.RetrieveLoanServiceFilters( loanId );
                if ( filters == null )
                    filters = new LoanServiceFiltersContract();

                // If no product filters were returned init the array
                if ( filters.Products == null )
                    filters.Products = new string[ 0 ];
                List<string> productFilters = new List<string>( filters.Products.OrderBy( x => x ) );
                productFilters.Insert( 0, "[None]" );
                filters.Products = productFilters.ToArray();

                // If no vendor filters were returned init the array
                if ( filters.Vendors == null )
                    filters.Vendors = new string[ 0 ];
                List<string> vendorFilters = new List<string>( filters.Vendors.OrderBy( x => x ) );
                vendorFilters.Insert( 0, "[None]" );
                filters.Vendors = vendorFilters.ToArray();

                // If no status filters were returned init the array
                if ( filters.Statuses == null )
                    filters.Statuses = new string[ 0 ];
                List<string> statusFilters = new List<string>( filters.Statuses.OrderBy( x => x ) );
                statusFilters.Insert( 0, "[None]" );
                filters.Statuses = statusFilters.ToArray();

                loanServicesViewModel.AvailableFilters = filters;

                // Fetch the loan services themselves
                loanServicesViewModel.LoanServiceList = LoanServiceFacade.RetrieveLoanServices( loanId );
            }

            #region Update title information

            var leadSource = ContactServiceFacade.RetrieveLeadSourceByContactIdAndLoanId( -1, loanId, user.UserAccountId );
            loanServicesViewModel.LeadSourceInformation = leadSource != null ? leadSource.LeadSourceId + " " + leadSource.Description : String.Empty;
            loanServicesViewModel.TitleInformation = ConciergeWorkQueueServiceFacade.ExecuteSPGetBorrowerData( "GetBorrowerData", loanId, user.UserAccountId );

            #endregion
            
            _viewName = "_loanservices";
            _viewModel = loanServicesViewModel;
            
            // Rihad:This might be to big for keeping it in session:
            //_httpContext.Session[ SessionHelper.LoanServiceList ] = loanServicesViewModel.LoanServiceList.ToXml(); 
        }
    }
}