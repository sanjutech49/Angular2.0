using System;
using System.Web;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using System.Collections.Generic;
using System.Linq;
using MML.Web.LoanCenter.ViewModels;
using MML.Common;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class CommonHelper
    {
        public static String GetPhoneNumber(PhoneNumberCollection numberCollection, bool preferredNumber)
        {
            if (numberCollection == null)
                return String.Empty;

            String phoneNumber = String.Empty;
            foreach (var item in numberCollection)
            {
                if (item.Preferred == preferredNumber)
                {
                    phoneNumber = item.Number;
                }
            }
            return phoneNumber;
        }

        public static String GetSearchValue( HttpContextBase httpContextBase )
        {
            return (httpContextBase != null && httpContextBase.Session[ SessionHelper.SearchTerm ] != null) ? httpContextBase.Session[ SessionHelper.SearchTerm ].ToString() : String.Empty;

        }

        public static bool ShowStartProspectButton( HttpContext httpContext )
        {
            List<GeneralSettings> generalSettings = null;

            if ( httpContext.Session[ "generalSettings" ] != null )
            {
                generalSettings = httpContext.Session[ "generalSettings" ] as List<GeneralSettings>;
            }
            else
            {
                generalSettings = GeneralSettingsServiceFacade.RetrieveGeneralSettings();
                httpContext.Session[ "generalSettings" ] = generalSettings;
            }

            if ( generalSettings == null )
                return false;

            string settingName = "Loan Center - Show Start Prospect button";
            return generalSettings.FirstOrDefault( s => s.SettingName == settingName ) != null && generalSettings.FirstOrDefault( s => s.SettingName == settingName ).Status;
        }

        public static void RetreiveContactDetailsFromWorkQueueItemDetails( WorkQueueItemDetails workQueueItemDetails, LoanDetailsViewModel loanDetails, UserAccount user, string emptyField )
        {
            loanDetails.BorrowerFirstName = !workQueueItemDetails.BorrowerFirstName.IsNullOrEmpty() ? StringHelper.ReduceTextSize( workQueueItemDetails.BorrowerFirstName, 10 ) : emptyField;
            loanDetails.BorrowerLastName = !workQueueItemDetails.BorrowerLastName.IsNullOrEmpty() ? StringHelper.ReduceTextSize( workQueueItemDetails.BorrowerLastName, 10 ) : emptyField;
            loanDetails.BorrowerMiddleName = !workQueueItemDetails.BorrowerMiddleName.IsNullOrEmpty() ? StringHelper.ReduceTextSize( workQueueItemDetails.BorrowerMiddleName, 10 ) : emptyField;
            loanDetails.BorrowerPreferredPhone = !workQueueItemDetails.BorrowerPreferredPhone.IsNullOrEmpty() ? StringHelper.FormatPhoneNumber( workQueueItemDetails.BorrowerPreferredPhone ) : emptyField;
            loanDetails.BorrowerAlternatePhone = !workQueueItemDetails.BorrowerAlternatePhone.IsNullOrEmpty() ? StringHelper.FormatPhoneNumber( workQueueItemDetails.BorrowerAlternatePhone ) : emptyField;
            loanDetails.CoBorrowerFirstName = !workQueueItemDetails.CoBorrowerFirstName.IsNullOrEmpty() ? StringHelper.ReduceTextSize( workQueueItemDetails.CoBorrowerFirstName, 10 ) : emptyField;
            loanDetails.CoBorrowerLastName = !workQueueItemDetails.CoBorrowerLastName.IsNullOrEmpty() ? StringHelper.ReduceTextSize( workQueueItemDetails.CoBorrowerLastName, 10 ) : emptyField;
            loanDetails.CoBorrowerMiddleName = !workQueueItemDetails.CoBorrowerMiddleName.IsNullOrEmpty() ? StringHelper.ReduceTextSize( workQueueItemDetails.CoBorrowerMiddleName, 10 ) : emptyField;
            loanDetails.CoBorrowerPreferredPhone = !workQueueItemDetails.CoBorrowerPreferredPhone.IsNullOrEmpty() ? StringHelper.FormatPhoneNumber( workQueueItemDetails.CoBorrowerPreferredPhone ) : emptyField;
            loanDetails.CoBorrowerAlternatePhone = !workQueueItemDetails.CoBorrowerAlternatePhone.IsNullOrEmpty() ? StringHelper.FormatPhoneNumber( workQueueItemDetails.CoBorrowerAlternatePhone ) : emptyField;
            if ( !workQueueItemDetails.BorrowerPreferredPhone.IsNullOrEmpty() )
            {
                var borrowerPreferredPhoneNoType =
                    LookupServiceFacade.LookupName( Convert.ToInt32( workQueueItemDetails.BorrowerPreferredPhoneType ),
                                                   LookupKeywords.PhoneType,
                                                   user.UserAccountId );
                string borrowerPreferredPhoneType = !string.IsNullOrEmpty( borrowerPreferredPhoneNoType )
                                                        ? borrowerPreferredPhoneNoType
                                                        : emptyField;
                loanDetails.BorrowerPreferredPhoneType = " (" +
                                                         StringHelper.ReduceTextSize( borrowerPreferredPhoneType, 10 ) +
                                                         ") ";
            }
            else loanDetails.BorrowerPreferredPhoneType = emptyField;

            if ( !workQueueItemDetails.BorrowerAlternatePhone.IsNullOrEmpty() )
            {
                var borrowerAlternatePhoneNoType = LookupServiceFacade.LookupName( Convert.ToInt32( workQueueItemDetails.BorrowerAlternatePhoneType ), LookupKeywords.PhoneType,
                                                               user.UserAccountId );
                string borrowerAlternatePhoneType = !string.IsNullOrEmpty( borrowerAlternatePhoneNoType ) ? borrowerAlternatePhoneNoType : emptyField;
                loanDetails.BorrowerAlternatePhoneType = " (" + StringHelper.ReduceTextSize( borrowerAlternatePhoneType, 10 ) + ") ";
            }
            else loanDetails.BorrowerAlternatePhoneType = emptyField;

            if ( !workQueueItemDetails.CoBorrowerPreferredPhone.IsNullOrEmpty() )
            {
                var coborrowerPreferredPhoneNoType =
                    LookupServiceFacade.LookupName( Convert.ToInt32( workQueueItemDetails.CoBorrowerPreferredPhoneType ),
                                                   LookupKeywords.PhoneType,
                                                   user.UserAccountId );
                string coborrowerPreferredPhoneType = !string.IsNullOrEmpty( coborrowerPreferredPhoneNoType )
                                                          ? coborrowerPreferredPhoneNoType
                                                          : emptyField;
                loanDetails.CoBorrowerPreferredPhoneType = " (" +
                                                           StringHelper.ReduceTextSize(
                                                               coborrowerPreferredPhoneType, 10 ) + ") ";
            }
            else workQueueItemDetails.CoBorrowerPreferredPhoneType = emptyField;

            if ( !workQueueItemDetails.CoBorrowerAlternatePhone.IsNullOrEmpty() )
            {
                var coborrowerAlternatePhoneNoType = LookupServiceFacade.LookupName( Convert.ToInt32( workQueueItemDetails.CoBorrowerAlternatePhoneType ), LookupKeywords.PhoneType,
                                                               user.UserAccountId );
                string coborrowerAlternatePhoneType = !string.IsNullOrEmpty( coborrowerAlternatePhoneNoType ) ? coborrowerAlternatePhoneNoType : emptyField;
                loanDetails.CoBorrowerAlternatePhoneType = " (" + StringHelper.ReduceTextSize( coborrowerAlternatePhoneType, 10 ) + ") ";
            }
            else loanDetails.CoBorrowerAlternatePhoneType = emptyField;

            loanDetails.BorrowerESignNotSigned = workQueueItemDetails.BorrowerESign == "N";
            loanDetails.CoBorrowerESignNotSigned = workQueueItemDetails.CoBorrowerESign == "N";

            // Is Borrower online user
            if ( workQueueItemDetails.IsBorrowerOnlineUser.HasValue )
            {
                loanDetails.IsBorrowerOnlineUser = workQueueItemDetails.IsBorrowerOnlineUser.Value ? "Online User" : "Offline User";
            }
            else
            {
                loanDetails.IsBorrowerOnlineUser = String.Empty;
            }

            // Is CoBorrower online user
            if ( workQueueItemDetails.IsCoBorrowerOnlineUser.HasValue )
            {
                loanDetails.IsCoBorrowerOnlineUser = workQueueItemDetails.IsCoBorrowerOnlineUser.Value ? "Online User" : "Offline User";
            }
            else
            {
                loanDetails.IsCoBorrowerOnlineUser = String.Empty;
            }
        }

        public static void RetreiveLoanDetailsFromWorkQueueItemDetails( WorkQueueItemDetails workQueueItemDetails, LoanDetailsViewModel loanDetails, UserAccount user, string emptyField )
        {
            if ( workQueueItemDetails == null || loanDetails == null || user == null )
                return;

            loanDetails.LoanProgram = workQueueItemDetails.LoanProgram;           
            loanDetails.StreetName = workQueueItemDetails.StreetName ?? emptyField;
            loanDetails.PropertyAddress = workQueueItemDetails.PropertyAddress ?? emptyField;
            loanDetails.EstimatedValue = workQueueItemDetails.EstimatedValue != null
                                            ? String.Format( GlobalizationHelper.GetDefaultCulture(),
                                                            StringHelper.CurrencyFormatNoDecimals, workQueueItemDetails.EstimatedValue )
                                            : emptyField;
            loanDetails.PropertyType = workQueueItemDetails.PropertyType != 0
                                        ? LookupServiceFacade.LookupName( ( int )workQueueItemDetails.PropertyType, LookupKeywords.PropertyTypeSubjectProperty, user.UserAccountId )
                                        : emptyField;
            loanDetails.OccupancyType = workQueueItemDetails.OccupancyType != 0
                                            ? LookupServiceFacade.LookupName( ( int )workQueueItemDetails.OccupancyType,
                                                                             LookupKeywords.OccupancyType, user.UserAccountId )
                                            : emptyField;
            loanDetails.LoanType = workQueueItemDetails.LoanType.GetStringValue();
            loanDetails.Rate = String.Format( GlobalizationHelper.GetDefaultCulture(), StringHelper.InterestRateFormat,
                                             workQueueItemDetails.Rate );
            loanDetails.Apr = workQueueItemDetails.Apr != null
                                ? String.Format( GlobalizationHelper.GetDefaultCulture(), StringHelper.InterestRateFormat,
                                                workQueueItemDetails.Apr )
                                : emptyField;
            loanDetails.Points = workQueueItemDetails.Points != null ? workQueueItemDetails.Points.ToString() : emptyField;
            loanDetails.LockDate = workQueueItemDetails.LockDate != null ? workQueueItemDetails.LockDate.Value.ToString( "MM/dd/yyyy" ) : emptyField;
            loanDetails.LockDays = workQueueItemDetails.LockDays.ToString();
            loanDetails.LoanAmount =
                workQueueItemDetails.LoanAmount != null
                    ? String.Format( GlobalizationHelper.GetDefaultCulture(), StringHelper.CurrencyFormatNoDecimals, workQueueItemDetails.LoanAmount )
                    : emptyField;
            loanDetails.LoanNumber = !string.IsNullOrEmpty( workQueueItemDetails.LoanNumber ) ? workQueueItemDetails.LoanNumber : emptyField;
            loanDetails.Price = workQueueItemDetails.Price != null ? workQueueItemDetails.Price.ToString() : emptyField;
            loanDetails.TotalPriceAdjustment = workQueueItemDetails.TotalPriceAdjustment != null ? workQueueItemDetails.TotalPriceAdjustment.ToString() : emptyField;
            loanDetails.MonthlyPayment = workQueueItemDetails.MonthlyPayment != null
                                             ? String.Format(GlobalizationHelper.GetDefaultCulture(),
                                                             StringHelper.CurrencyFormat,
                                                             workQueueItemDetails.MonthlyPayment)
                                             : emptyField;
            loanDetails.NMLSNumber = workQueueItemDetails.ConciergeId.HasValue ? UserAccountServiceFacade.RetrieveNMLSNumber( ( int )workQueueItemDetails.ConciergeId ) : emptyField;

            string conciergeName = !string.IsNullOrEmpty( workQueueItemDetails.ConciergeFullName ) ? workQueueItemDetails.ConciergeFullName : emptyField;
            loanDetails.ConciergeFullName = StringHelper.ReduceTextSize( conciergeName, 10 );

            loanDetails.LoanPointsAmount = workQueueItemDetails.LoanPointsAmount.HasValue ?
                String.Format( GlobalizationHelper.GetDefaultCulture(), StringHelper.CurrencyFormat, workQueueItemDetails.LoanPointsAmount ) : emptyField;

            loanDetails.LoanPointsPercentage = workQueueItemDetails.LoanPointsPercentage.HasValue && workQueueItemDetails.LoanPointsPercentage.Value > 0 ?
                String.Format( GlobalizationHelper.GetDefaultCulture(), StringHelper.InterestRateFormat, workQueueItemDetails.LoanPointsPercentage ) : emptyField;

            if ( workQueueItemDetails.LoanAmount.HasValue && workQueueItemDetails.EstimatedValue.HasValue )
            {
                loanDetails.LTV = Calculator.Calculator.CalculateLtv( ( Decimal )workQueueItemDetails.LoanAmount, workQueueItemDetails.EstimatedValue.Value );
                loanDetails.CLTV = Calculator.Calculator.CalculateCombinedLtv( ( Decimal )workQueueItemDetails.LoanAmount, 0, workQueueItemDetails.EstimatedValue.Value );
            }

            loanDetails.IndexType = workQueueItemDetails.IndexType ?? emptyField;
            loanDetails.IndexValue = workQueueItemDetails.IndexValue;
            loanDetails.Margin = workQueueItemDetails.Margin;
            loanDetails.RateAdjustmentFirstChangeCapRate = workQueueItemDetails.RateAdjustmentFirstChangeCapRate;
            loanDetails.RateAdjustmentLifetimeCapPercent = workQueueItemDetails.RateAdjustmentLifetimeCapPercent;
            loanDetails.RateAdjustmentSubsequentCapPercent = workQueueItemDetails.RateAdjustmentSubsequentCapPercent;
        }

        public static int SessionTimeout()
        {
            var min = System.Configuration.ConfigurationManager.AppSettings[ "SessionExpiration" ];

            int sessionExpiration;

            if ( !int.TryParse( min, out sessionExpiration ) )
                sessionExpiration = 720;

            return SessionHelper.CalculateSessionExpirationTimeout( sessionExpiration );
        }

        public static List<ActivityType> RetrieveActivityListForQueueFilter()
        {
            List<ActivityType> lstOfActivityTypes = new List<ActivityType>( Enum.GetValues( typeof( ActivityType ) ).Cast<ActivityType>() );
            lstOfActivityTypes.Remove( ActivityType.ReissueDisclosures );

            return lstOfActivityTypes;
        }
    }
}
