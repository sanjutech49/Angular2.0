using System;
using System.Collections.Generic;
using MML.Contacts;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    public class LoanDetailsViewModel
    {
        public string LoanType { get; set; }
        public string Apr { get; set; }
        public string LockDays { get; set; }
        public string LoanAmount { get; set; }
        public string ConciergeId { get; set; }
        public string Rate { get; set; }
        public string Points { get; set; }
        public string LockDate { get; set; }
        public string LoanNumber { get; set; }
        public string MonthlyPayment { get; set; }
        public string Price { get; set; }
        public string TotalPriceAdjustment { get; set; }
        public string ConciergeFullName { get; set; }
        public string PropertyAddress { get; set; }
        public string StreetName { get; set; }
        public string EstimatedValue { get; set; }
        public string PropertyType { get; set; }
        public string OccupancyType { get; set; }
        public string BorrowerFirstName { get; set; }
        public string BorrowerMiddleName { get; set; }
        public string BorrowerLastName { get; set; }
        public string BorrowerPreferredPhone { get; set; }
        public string BorrowerPreferredPhoneType { get; set; }
        public string BorrowerAlternatePhone { get; set; }
        public string BorrowerAlternatePhoneType { get; set; }
        public string CoBorrowerFirstName { get; set; }
        public string CoBorrowerMiddleName { get; set; }
        public string CoBorrowerLastName { get; set; }
        public string CoBorrowerPreferredPhone { get; set; }
        public string CoBorrowerAlternatePhone { get; set; }
        public string CoBorrowerPreferredPhoneType { get; set; }
        public string CoBorrowerAlternatePhoneType { get; set; }
        public string NMLSNumber { get; set; }
        public bool BorrowerESignNotSigned { get; set; }
        public bool CoBorrowerESignNotSigned { get; set; }
        public string IsBorrowerOnlineUser { get; set; }
        public string IsCoBorrowerOnlineUser { get; set; }
        public string TitleInformation { get; set; }
        public string LeadSourceInformation { get; set; }
        public string HearAboutUs { get; set; }
        public string LoanProgram { get; set; }
        public Decimal LTV { get; set; }
        public Decimal CLTV { get; set; }
        public string LoanPointsPercentage { get; set; }
        public string LoanPointsAmount { get; set; }
        public double? SecondMortgageAmount { get; set; }
        public List<BusinessContact> Contacts { get; set; }
        public Guid LoanId { get; set; }
        public bool CollapseDetails { get; set; }
        public List<LoanAdjustment> Adjustments { get; set; }
        public double? Margin { get; set; }
        public string IndexType { get; set; }
        public double? IndexValue { get; set; }
        public double? RateAdjustmentFirstChangeCapRate { get; set; }
        public double? RateAdjustmentSubsequentCapPercent { get; set; }
        public double? RateAdjustmentLifetimeCapPercent { get; set; }

        public SystemAdminContactsViewModel CompaniesAndContactsModel { get; set; } /*just for show*/
        public SystemAdminContactsViewModel LoanCompaniesAndContactsModel { get; set; } /*just for show*/
        public List<CCPAContact> PresentContacts { get; set; }
    }
}
