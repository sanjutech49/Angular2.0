using System;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    [Serializable]
    public enum LoanCenterTab
    {
        [StringValue( "Alerts" )]
        Alerts,
        [StringValue( "Cancelled Loans" )]
        Cancelled,
        [StringValue( "Completed Loans" )]
        CompletedLoans,
        [StringValue( "New Loan Applications" )]
        NewLoanApplication,
        [StringValue( "Pending Approval" )]
        PendingApproval,
        [StringValue( "Pipeline" )]
        Pipeline,
        [StringValue( "Prospects" )]
        Prospect,
        [StringValue( "PreApproval" )]
        PreApproval,
        [StringValue( "OfficerTask" )]
        OfficerTask,
        [StringValue( "Order Requested" )]
        OrderRequested,
        [StringValue( "Order Processed" )]
        OrderProcessed,
        [StringValue( "Order Delivered for Review" )]
        OrderDeliveredForReview,
        [StringValue( "Order Exception" )]
        OrderException,
        [StringValue( "Mail Room" )]
        MailRoom,
    }
}
