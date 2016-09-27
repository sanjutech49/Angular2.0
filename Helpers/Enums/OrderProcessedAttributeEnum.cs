using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum OrderProcessedAttribute
    {
        [XmlEnum( Name = "OrderId" )]
        [StringValue( "OrderId" )]
        OrderId = 1,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 2,
        [XmlEnum( Name = "Borrower" )]
        [StringValue( "Borrower" )]
        Borrower = 3,
        [XmlEnum( Name = "Rush" )]
        [StringValue( "Rush" )]
        Rush = 4,
        [XmlEnum( Name = "LoanOfficer" )]
        [StringValue( "LoanOfficer" )]
        LoanOfficer = 5,
        [XmlEnum( Name = "RequestDate" )]
        [StringValue( "RequestDate" )]
        RequestDate = 6,
        [XmlEnum( Name = "OrderedDate" )]
        [StringValue( "OrderedDate" )]
        OrderedDate = 7,
        [XmlEnum( Name = "ActualInspection" )]
        [StringValue( "ActualInspection" )]
        ActualInspection = 8,
        [XmlEnum( Name = "ExpectedDelivery" )]
        [StringValue( "ExpectedDelivery" )]
        ExpectedDelivery = 9,
        [XmlEnum( Name = "Uploaded" )]
        [StringValue( "Uploaded" )]
        Uploaded = 10,
        [XmlEnum( Name = "OrderStatus" )]
        [StringValue( "OrderStatus" )]
        OrderStatus = 11,
        [XmlEnum( Name = "StatusDate" )]
        [StringValue( "StatusDate" )]
        StatusDate = 12,
        [XmlEnum( Name = "Age" )]
        [StringValue( "Age" )]
        Age = 13
    }
}