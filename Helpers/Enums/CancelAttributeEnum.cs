using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum CancelAttribute
    {
        [XmlEnum( Name = "" )]
        [StringValue( "" )]
        None = 0,
        [XmlEnum( Name = "ConciergeFullName" )]
        [StringValue( "ConciergeFullName" )]
        ConciergeFullName = 1,
        [XmlEnum( Name = "NumberOfAlerts" )]
        [StringValue( "NumberOfAlerts" )]
        NumberOfAlerts = 2,
        [XmlEnum( Name = "NumberOfDocsToReview" )]
        [StringValue( "NumberOfDocsToReview" )]
        NumberOfDocsToReview = 3,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 4,
        [XmlEnum( Name = "OpenDate" )]
        [StringValue( "OpenDate" )]
        OpenDate = 5,
        [XmlEnum( Name = "FullName" )]
        [StringValue( "FullName" )]
        FullName = 6,
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
        LockExpireDate = 10,
        [XmlEnum( Name = "ActivityName" )]
        [StringValue( "ActivityName" )]
        ActivityName = 11,
        [XmlEnum( Name = "ActivityStatus" )]
        [StringValue( "ActivityStatus" )]
        ActivityStatus = 12,
        
    }
}