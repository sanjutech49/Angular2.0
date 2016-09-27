using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum CompletedLoansAttribute
    {
        [XmlEnum( Name = "ConciergeFullName" )]
        [StringValue( "ConciergeFullName" )]
        Concierge = 1,
        [XmlEnum( Name = "NumberOfAlerts" )]
        [StringValue( "NumberOfAlerts" )]
        Alerts = 2,
        [XmlEnum( Name = "NumberOfDocsToReview" )]
        [StringValue( "NumberOfDocsToReview" )]
        Docs = 3,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 4,
        [XmlEnum( Name = "OpenDate" )]
        [StringValue( "OpenDate" )]
        AppDate = 5,
        [XmlEnum( Name = "FullName" )]
        [StringValue( "FullName" )]
        BorrowerFullName = 6,
        [XmlEnum( Name = "ProgramName" )]
        [StringValue( "ProgramName" )]
        ProgramName = 7,
        [XmlEnum( Name = "MortgageAmount" )]
        [StringValue( "MortgageAmount" )]
        MortgageAmount = 8,
        [XmlEnum( Name = "Rate" )]
        [StringValue( "Rate" )]
        Rate = 9,
        [XmlEnum( Name = "LockExpireDate" )]
        [StringValue( "LockExpireDate" )]
        LockExpireDate = 10
    }
}