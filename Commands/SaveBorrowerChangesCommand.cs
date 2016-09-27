using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.Facade;
using MML.Contracts;
using MML.Common;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class SaveBorrowerChangesCommand : CommandsBase
    {
        public override void Execute()
        {
            base.Execute();

            Guid loanId = Guid.Empty;
            if ( !Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId ) )
            {
                InputParameters[ "LoanId" ] = EncryptionHelper.DecryptRijndael( InputParameters[ "LoanId" ].ToString(), EncriptionKeys.Default );
                Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId );
            }

            UserAccount user = null;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );

            String borrowersToBeRemoved = InputParameters.ContainsKey( "BorrowersToBeRemoved" ) ? InputParameters[ "BorrowersToBeRemoved" ].ToString().Substring( 0, InputParameters[ "BorrowersToBeRemoved" ].ToString().Length - 1 ) : String.Empty;

            RemoveBorrowers( borrowersToBeRemoved );

            ViewName = "_borrowerInformation";
            ViewData = GetBorrowers( loanId, 0, user, true );
        }

        #region <<< PRIVATE METHODS >>>

        /// <summary>
        /// Fill the Borrower Detail View
        /// </summary>
        /// <param name="loanId">Loan Id</param>
        /// <param name="prospectId"></param>
        /// <param name="user"></param>
        /// <param name="collapseSection"></param>
        /// <returns></returns>
        private BorrowerDetailsViewModel GetBorrowers( Guid loanId, int prospectId, UserAccount user, bool collapseSection )
        {

            BorrowerDetailsViewModel borrowerDetails = new BorrowerDetailsViewModel();
            if ( loanId == Guid.Empty )
                return borrowerDetails;

            borrowerDetails.Borrowers = BorrowerServiceFacade.GetBorrowersForLoan( loanId );

            borrowerDetails.LoanID = loanId;
            borrowerDetails.CollapseDetails = collapseSection;

            return borrowerDetails;
        }

        private void RemoveBorrowers( String borrowersToBeRemoved )
        {
            bool result = BorrowerServiceFacade.RemoveBorrowers( borrowersToBeRemoved );
        }

        #endregion


    }
}
