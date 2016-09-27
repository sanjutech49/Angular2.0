using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum AlertsAttribute
    {
        [XmlEnum( Name = "ConciergeFullName" )]
        [StringValue( "ConciergeFullName" )]
        ConciergeFullName = 1,
        [XmlEnum( Name = "NumberOfAlerts" )]
        [StringValue( "NumberOfAlerts" )]
        NumberOfAlerts = 2,
        [XmlEnum( Name = "NumberOfDocsToReview" )]
        [StringValue( "NumberOfDocsToReview" )]
        NumberOfDocsToReview = 3,
        [XmlEnum(Name = "FullName")]
        [StringValue("FullName")]
        FullName = 4,
        [XmlEnum(Name = "LoanType")]
        [StringValue("LoanType")]
        LoanType = 5,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 6,
        [XmlEnum( Name = "OpenDate" )]
        [StringValue( "OpenDate" )]
        OpenDate = 8,
        [XmlEnum( Name = "ProgramName" )]
        [StringValue( "ProgramName" )]
        ProgramName = 7,
        [XmlEnum( Name = "MortgageAmount" )]
        [StringValue( "MortgageAmount" )]
        MortgageAmount = 9,
        [XmlEnum( Name = "Rate" )]
        [StringValue( "Rate" )]
        Rate = 10,
        [XmlEnum( Name = "LockExpireDate" )]
        [StringValue( "LockExpireDate" )]
        LockExpireDate = 11,
        [XmlEnum( Name = "ActivityName" )]
        [StringValue( "ActivityName" )]
        ActivityName = 12,
        [XmlEnum( Name = "ActivityStatus" )]
        [StringValue( "ActivityStatus" )]
        ActivityStatus = 13,

        
        
    }
}