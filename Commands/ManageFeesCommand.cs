using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;
using System.Collections.ObjectModel;
using MML.Web.Facade;
using MML.Common;
using Resources;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class ManageFeesCommand : ICommand
    {
        #region Members

        public string ViewName
        {
            get;
            private set;
        }

        public dynamic ViewData
        {
            get;
            private set;
        }

        public Dictionary<string, object> InputParameters
        {
            get;
            set;
        }

        public HttpContextBase HttpContext
        {
            get;
            set;
        }

        #endregion

        #region Execute Command

        public void Execute()
        {

            #region Check and convert input parameters

            if ( !InputParameters.ContainsKey( "LoanId" ) )
                throw new ArgumentException( "LoanId value was expected!" );

            Guid loanId;
            Guid.TryParse( InputParameters[ "LoanId" ].ToString().TrimEnd(), out loanId );

            var user = AccountHelper.GetUserAccount( HttpContext );
            if ( user == null )
                throw new InvalidOperationException( "UserData is null" );

            #endregion

            var model = new ManageFeesViewModel();
            model.TitleAndEscrow = ManageFeesHelper.GetCostByLoanId( loanId, user, HttpContext );

            ManageFeesHelper.SetTitleAndEscrowModel( model );


            ViewName = "Commands/ManageFees/_manageFees";
            ViewData = model;
        }

        private void PrepareFeeTitlesDropdown( List<string> values )
        {
            values.Sort();
            values.Insert( 0, String.Empty );
        }

        #endregion
    }
}
