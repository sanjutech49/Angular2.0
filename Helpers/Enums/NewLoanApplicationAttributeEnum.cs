using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum NewLoanApplicationAttribute
    {
        [XmlEnum( Name = "ConciergeFullName" )]
        [StringValue( "ConciergeFullName" )]
        Concierge = 1,
        [XmlEnum( Name = "BorrowerFullName" )]
        [StringValue( "BorrowerFullName" )]
        BorrowerFullName = 2,
        [XmlEnum( Name = "ApplicationDate" )]
        [StringValue( "ApplicationDate" )]
        ApplicationDate = 3,
        [XmlEnum( Name = "MortgageAmount" )]
        [StringValue( "MortgageAmount" )]
        MortgageAmount = 4,
        [XmlEnum( Name = "ProgramName" )]
        [StringValue( "ProgramName" )]
        ProgramName = 5,
        [XmlEnum( Name = "LockDays" )]
        [StringValue( "LockDays" )]
        LockDays = 6,
        [XmlEnum( Name = "LockExpireDate" )]
        [StringValue( "LockExpireDate" )]
        LockExpireDate = 7

    }
}