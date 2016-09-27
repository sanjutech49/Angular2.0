using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common.Helpers;
using System.Xml.Serialization;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum ContactViewAttribute
    {
        [XmlEnum( Name = "" )]
        [StringValue( "" )]
        None = 0,

        [XmlEnum( Name = "CreationDateTime" )]
        [StringValue( "CreationDateTime" )]
        CreationDateTime = 1,

        [XmlEnum( Name = "ContactName" )]
        [StringValue( "ContactName" )]
        Contact = 2,

        [XmlEnum(Name = "LoanType")]
        [StringValue("LoanType")]
        LoanPurpose = 3,

        [XmlEnum( Name = "Status" )]
        [StringValue( "Status" )]
        Status = 4,

        [XmlEnum( Name = "AppDate" )]
        [StringValue( "AppDate" )]
        Source = 5,

        [XmlEnum( Name = "Application" )]
        [StringValue( "Application" )]
        Application = 6,

        [XmlEnum(Name = "LastActivityOn")]
        [StringValue("LastActivityOn")]
        LastActivityOn = 7,

        [XmlEnum( Name = "ConciergeName" )]
        [StringValue( "ConciergeName" )]
        ConciergeName = 8
    }
}