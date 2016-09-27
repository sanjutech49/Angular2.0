using System;
using MML.Contracts;
using MML.iMP.Common;

namespace MML.Web.LoanCenter.ViewModels
{
    public class ReDisclosureModel
    {
        public LoanChangeIndicators LoanChangeIndicators { get; set; }  
        public bool DisplayCounterOfferApproval { get; set; }
        public Guid LoanId { get; set; }        
        public AutomatedAlertConfiguration_Enum AlertType { get; set; }
        public bool IsOnlineBorrower { get; set; }
    }
}
