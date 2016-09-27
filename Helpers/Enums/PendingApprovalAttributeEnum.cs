using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum PendingApprovalAttribute
    {
        [XmlEnum( Name = "ConciergeFullName" )]
        [StringValue( "ConciergeFullName" )]
        Concierge = 1,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 2,
        [XmlEnum( Name = "FullName" )]
        [StringValue( "FullName" )]
        BorrowerFullName = 3,
        [XmlEnum( Name = "ProgramName" )]
        [StringValue( "ProgramName" )]
        ProgramName = 4,
        [XmlEnum( Name = "MortgageAmount" )]
        [StringValue( "MortgageAmount" )]
        Amount = 5,
        [XmlEnum( Name = "Rate" )]
        [StringValue( "Rate" )]
        Rate = 6,
        [XmlEnum( Name = "LockExpireDate" )]
        [StringValue( "LockExpireDate" )]
        LockDate = 7,
        [XmlEnum( Name = "Date" )]
        [StringValue( "Date" )]
        Date = 8,
        [XmlEnum( Name = "NumberOfDocs" )]
        [StringValue( "NumberOfDocs" )]
        NumberOfDocs = 9,
        [XmlEnum( Name = "SubmittedActivity" )]
        [StringValue( "SubmittedActivity" )]
        SubmittedActivity = 10
    }
}