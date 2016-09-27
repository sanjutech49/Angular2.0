using System;

namespace MML.Web.LoanCenter.ViewModels.Conditions
{
    [Serializable]
    public class LoanDecisionStatusHistoryViewModel
    {
        public string Status { get; set; }
        public string UpdatedBy { get; set; }
        public string Date { get; set; }
    }
}