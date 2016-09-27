using System;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    [Serializable]
    public enum FilterContextEnum
    {
        OfficerTask,
        Contact,
        Pipeline,
        NewLoanApplication,
        PendingApproval,
        Alerts,
        CompletedLoans,
        PreApproval,
        Cancel,
        OrderRequested,
        OrderProcessed,
        OrderDeliveredForReview,
        OrderException,
        MailRoom
    }
}
