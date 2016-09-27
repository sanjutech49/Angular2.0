using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.XPath;
using MML.Contracts;
using MML.Common;
using System.Xml.Linq;
using MML.Web.Facade;
using System.Globalization;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    /// <summary>
    /// Appraisal order helper methods
    /// </summary>
    public class AppraisalOrderHelper
    {
        #region <<< Public implementation >>>

        /// <summary>
        /// Get payment status
        /// </summary>
        /// <param name="paymentStatus">Payment status</param>
        /// <returns>Payment status</returns>
        public PaymentStatus GetPaymentStatus( string paymentStatus )
        {
            PaymentStatus paymentStatusValue = PaymentStatus.Failed;
            switch ( paymentStatus.ToLower() )
            {
                case "pending":
                    paymentStatusValue = PaymentStatus.Pending;
                    break;
                case "processed":
                    paymentStatusValue = PaymentStatus.Processed;
                    break;
                case "failed":
                    paymentStatusValue = PaymentStatus.Failed;
                    break;
            }
            return paymentStatusValue;
        }

        /// <summary>
        /// Gets payment method value
        /// </summary>
        /// <param name="paymentMethodId">Payment method ID</param>
        /// <returns>Payment method string value</returns>
        public string GetPaymentMethodValue( int paymentMethodId )
        {
            string paymentMethodValue = String.Empty;
            switch ( paymentMethodId )
            {
                case 0:
                    paymentMethodValue = "Check";
                    break;
                case 1:
                    paymentMethodValue = "CC";
                    break;
                case 2:
                    paymentMethodValue = "PTC";
                    break;
                default:
                    paymentMethodValue = "Check";
                    break;
            }
            return paymentMethodValue;
        }

        /// <summary>
        /// Get PaidBy string value
        /// </summary>
        /// <param name="paidById">Paid by ID</param>
        /// <returns>Paid by string value</returns>
        public string GetPaidByValue( int paidById )
        {
            string paidByStringValue = String.Empty;
            switch ( paidById )
            {
                case 0:
                    paidByStringValue = "Borrower";
                    break;
                case 1:
                    paidByStringValue = "Loan Officer";
                    break;
            }
            return paidByStringValue;
        }

        /// <summary>
        /// Insert Seller with Seller Name, Type and BusinessCategory only for specific loan
        /// </summary>
        /// <param name="loanId"></param>
        /// <param name="sellerData"></param>
        /// <returns></returns>
        public BusinessContact InsertSimpleSeller( Guid loanId, FormSeller sellerData )
        {
            BusinessContact contact = new BusinessContact();
            contact.BusinessContactId = Guid.Empty;
            contact.SellerType = sellerData.SellerType;
            contact.BusinessContactCategory = BusinessContactCategory.SellerAgent;

            switch ( contact.SellerType )
            {
                case SellerType.Individual:
                    contact.FirstName = sellerData.SellerName;
                    break;
                case SellerType.Bank:
                case SellerType.LLC:
                    contact.CompanyName = sellerData.SellerName;
                    break;
                default:
                    contact.FirstName = sellerData.SellerName;
                    break;
            }
            return BusinessContactServiceFacade.CreateBusinessContactByLoan( loanId, contact );
        }

        #endregion
    }
}
