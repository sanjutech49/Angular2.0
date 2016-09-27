using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Models;
using MML.Web.Facade;
using MML.Common;
using System.Text;
using MML.Contracts;
using MML.Common.Helpers;
using System.Configuration;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Commands
{
    public class BorrowerDetailsSectionCommand : CommandsBase
    {
        #region <<< PUBLIC METHODS >>>

        public override void Execute()
        {
            Guid loanId = Guid.Empty;
            if ( !Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId ) )
            {
                InputParameters[ "LoanId" ] = EncryptionHelper.DecryptRijndael( InputParameters[ "LoanId" ].ToString(), EncriptionKeys.Default );
                Guid.TryParse( InputParameters[ "LoanId" ].ToString(), out loanId );
            }

            Int32 prospectId = 0;
            Int32.TryParse( InputParameters[ "ProspectId" ].ToString(), out prospectId );

            UserAccount user = null;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );

            bool collapseSection = true;
            if ( InputParameters.ContainsKey( "CollapseSection" ) && InputParameters[ "CollapseSection" ].ToString() == "1" )
                collapseSection = false;

            base.ViewName = "_borrowerInformation";
            base.ViewData = GetBorrowers( loanId, prospectId, user, collapseSection );
        }

        #endregion

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

            borrowerDetails.Borrowers = BorrowerServiceFacade.GetBorrowersForLoan(loanId);

            borrowerDetails.LoanID = loanId;
            borrowerDetails.CollapseDetails = collapseSection;

            return borrowerDetails;
        }

        #endregion
    }
}