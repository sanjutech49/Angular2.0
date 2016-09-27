using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum MailRoomAttribute
    {
        [XmlEnum( Name = "ConciergeName" )]
        [StringValue( "ConciergeName" )]
        ConciergeName = 1,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 2,
        [XmlEnum( Name = "Borrower" )]
        [StringValue( "Borrower" )]
        BorrowerFullName = 3,
        [XmlEnum( Name = "MailingAddress" )]
        [StringValue( "MailingAddress" )]
        MailingAddress = 4,
        [XmlEnum( Name = "Document" )]
        [StringValue( "Document" )]
        Document = 5,
        [XmlEnum( Name = "DueDate" )]
        [StringValue( "DueDate" )]
        DueDate = 6,
        [XmlEnum( Name = "Sent" )]
        [StringValue( "Sent" )]
        Sent = 7
    }
}