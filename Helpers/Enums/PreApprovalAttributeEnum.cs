using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum PreApprovalAttribute
    {
        [XmlEnum( Name = "Empty" )]
        [StringValue( "" )]
        Empty = 0,
        [XmlEnum( Name = "ConciergeFullName" )]
        [StringValue( "ConciergeFullName" )]
        Concierge = 1,
        [XmlEnum( Name = "NumberOfDocs" )]
        [StringValue( "NumberOfDocs" )]
        NumberOfDocs = 2,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 3,
        [XmlEnum( Name = "PreApprovalRequestDate" )]
        [StringValue( "PreApprovalRequestDate" )]
        PreApprovalRequestDate = 4,
        [XmlEnum( Name = "FullName" )]
        [StringValue( "FullName" )]
        FullName = 5,
        [XmlEnum( Name = "ProgramName" )]
        [StringValue( "ProgramName" )]
        ProgramName = 6,
        [XmlEnum( Name = "Amount" )]
        [StringValue( "Amount" )]
        Amount = 7,
        [XmlEnum( Name = "Rate" )]
        [StringValue( "Rate" )]
        Rate = 8,
        [XmlEnum( Name = "PreApprovalStatus" )]
        [StringValue( "PreApprovalStatus" )]
        PreApprovalStatus = 9,
        [XmlEnum( Name = "ActivityName" )]
        [StringValue( "ActivityName" )]
        ActivityName = 10,
        [XmlEnum( Name = "ActivityStatus" )]
        [StringValue( "ActivityStatus" )]
        ActivityStatus = 11
    }
}