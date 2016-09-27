using MML.Contracts;
using System;
using System.Collections.Generic;

namespace MML.Web.LoanCenter.ViewModels
{
    [Serializable]
    public class ConditionsLoanSummaryViewModel
    {
        public string Product { get; set; }
        public string LockExpirationDate { get; set; }
        public string LockExpirationNumber { get; set; }
        public string LockExpirationText { get; set; }
        public string LoanType { get; set; }
        public string MortgageType { get; set; }
        public string AmortType { get; set; }
        public int Term { get; set; }
        public decimal LoanAmount { get; set; }
        public short LoanPosition { get; set; }
        public decimal Subordinate { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal EstimatedValue { get; set; }
        public string ValueLabel { get; set; }
        public int DecisionScore { get; set; }
        public string Occupancy { get; set; }
        public string PropertyType { get; set; }
        public int NumberOfUnitsOrStories { get; set; }
        public decimal HousingExpense { get; set; }
        public double? Dti { get; set; }
        public decimal NoteRate { get; set; }
        public string QualRate { get; set; }
        public decimal Ltv { get; set; }
        public decimal Cltv { get; set; }
        public decimal Hcltv { get; set; }
        public string AusType { get; set; }
        public bool IsLocked { get; set; }
        public string InvestorWebSiteUrl { get; set; }
        public int DecisionStatus { get; set; }
        public List<LoanLockHistoryData> LoanLockHistoryData { get; set; }
    }
}