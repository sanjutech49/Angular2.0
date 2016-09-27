using System;

namespace MML.Web.LoanCenter.ViewModels.Conditions
{
    [Serializable]
    public class ConditionCommentHistoryViewModel
    {
        public string Comment { get; set; }
        public string UpdatedBy { get; set; }
        public string Date { get; set; }
        public bool Display { get; set; }
    }
}