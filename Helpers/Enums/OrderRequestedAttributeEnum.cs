using System.Xml.Serialization;
using MML.Common.Helpers;
using System;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    [Serializable]
    public enum OrderRequestedAttribute
    {
        [XmlEnum( Name = "OrderType" )]
        [StringValue( "OrderType" )]
        OrderType = 1,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 2,
        [XmlEnum( Name = "Borrower" )]
        [StringValue( "Borrower" )]
        Borrower = 3,
        [XmlEnum( Name = "Purpose" )]
        [StringValue( "Purpose" )]
        Purpose = 4,
        [XmlEnum( Name = "LoanAmount" )]
        [StringValue( "LoanAmount" )]
        LoanAmount = 5,
        [XmlEnum( Name = "PurchaseAmount" )]
        [StringValue( "PurchaseAmount" )]
        PurchaseAmount = 6,
        [XmlEnum( Name = "EstimatedValue" )]
        [StringValue( "EstimatedValue" )]
        EstimatedValue = 7,
        [XmlEnum( Name = "Seller" )]
        [StringValue( "Seller" )]
        Seller = 8,
        [XmlEnum( Name = "NonConforming" )]
        [StringValue( "NonConforming" )]
        NonConforming = 9,
        [XmlEnum( Name = "Rush" )]
        [StringValue( "Rush" )]
        Rush = 10,
        [XmlEnum( Name = "LoanOfficer" )]
        [StringValue( "LoanOfficer" )]
        LoanOfficer = 11,
        [XmlEnum( Name = "RequestDate" )]
        [StringValue( "RequestDate" )]
        RequestDate = 12,
        [XmlEnum( Name = "Age" )]
        [StringValue( "Age" )]
        Age = 13
    }
}