using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum PipelineAttribute
    {
        [XmlEnum( Name = "ConciergeFullName" )]
        [StringValue( "ConciergeFullName" )]
        Concierge = 1,
        [XmlEnum( Name = "BorrowerFullName" )]
        [StringValue( "BorrowerFullName" )]
        BorrowerFullName = 2,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 3,
        [XmlEnum( Name = "ProgramName" )]
        [StringValue( "ProgramName" )]
        ProgramName = 4,
        [XmlEnum( Name = "ApplicationDate" )]
        [StringValue( "ApplicationDate" )]
        ApplicationDate = 5,
        [XmlEnum( Name = "Amount" )]
        [StringValue( "Amount" )]
        Amount = 6,
        [XmlEnum( Name = "Rate" )]
        [StringValue( "Rate" )]
        Rate = 7,
        [XmlEnum( Name = "LockExpireDate" )]
        [StringValue( "LockExpireDate" )]
        LockExpiration = 8,
        [XmlEnum( Name = "CurrentActivity" )]
        [StringValue( "CurrentActivity" )]
        CurrentActivity = 9,
        [XmlEnum( Name = "ActivityStatus" )]
        [StringValue( "ActivityStatus" )]
        ActivityStatus = 10,
        [XmlEnum( Name = "Alerts" )]
        [StringValue( "Alerts" )]
        Alerts = 11,
        [XmlEnum( Name = "NumberOfDocsToReview" )]
        [StringValue( "NumberOfDocsToReview" )]
        NumberOfDocsToReview = 12
        
    }
}