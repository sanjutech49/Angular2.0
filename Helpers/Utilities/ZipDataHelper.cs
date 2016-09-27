using System;
using System.Linq;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
     public class ZipDataHelper
    {
        /// <summary>
        /// GetZipData
        /// </summary>
        /// <param name="zipCode"></param>
        /// <param name="loanType"></param>
        /// <param name="userAccountId"></param>
        /// <returns></returns>
        public static ZipDataItem GetZipData( String zipCode, LoanTransactionType loanType, Int32 userAccountId, int? conciergeId = null, bool isForEquatorState = false, Int32 homeBuyingType = 0 )
        {
            var zipData = UsaZipFacade.GetZipData( zipCode, false );

            var isCallCenter = IdentityManager.IsInRole( RoleName.LoanProcessor ); 

            LookupCollection licStates = null;
            var errorMessage = "Your zip is not supported.";

            if ( ( HomeBuyingType )homeBuyingType == HomeBuyingType.WhatCanIAfford )
            {
                licStates = LicenseHelper.GetAffordabilityLicensedStates();
                errorMessage = "Zip is currently not supported.";
            }
            else
            {
                licStates = LicenseHelper.GetLicensedStates( LookupStates( loanType, userAccountId ), isCallCenter, conciergeId, IdentityManager.IsAuthorizedForAction( ActionCategory.ObtainingLoanApplicationinformation ), isForEquatorState );
            }

            if( zipData != null )
            {
                var contains = licStates.FirstOrDefault( l => l.Name == zipData.State );

                if( contains == null )
                {
                    zipData.City = String.Empty;
                    zipData.County = String.Empty;
                    zipData.State = String.Empty;
                    zipData.ErrorMessage = errorMessage;
                }
            }
            else
            {
                zipData = new ZipDataItem() { ErrorMessage = "Invalid zip code." };
            }

            return zipData;
        }

        /// <summary>
        /// LookupStates
        /// </summary>
        /// <param name="loanType"></param>
        /// <param name="userAccountId"></param>
        /// <returns></returns>
        public static LookupCollection LookupStates( LoanTransactionType loanType, Int32 userAccountId )
        {
            /// TODO:   THIS IS ONLY TEMPORARY FOR CLIENT TO GET TEST DOCUMENT THIS NEEDS TO BE REFACTORED CORRECTLY 
            ///         THESE VALUES SHOULD BE STORED IN DATABASE !!!!!
            ///         ADDED STATES WA, UT, OR
            String[] purchaseStateList = { "CA", "CO", "FL", "HI", "ID", "NM", "TX", "WA", "UT", "OR" };
            LookupCollection purchaseStates = new LookupCollection();

            purchaseStates.AddRange( LookupServiceFacade.LookupStates( userAccountId ).Where( l => purchaseStateList.Contains( l.Name ) ).ToArray() );

            return loanType == LoanTransactionType.Purchase ? purchaseStates : LookupServiceFacade.LookupStates( userAccountId );
        }
    }
}
 