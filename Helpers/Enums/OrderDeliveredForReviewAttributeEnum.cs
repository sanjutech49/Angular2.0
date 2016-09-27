using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum OrderDeliveredForReviewAttribute
    {
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "Loan Number" )]
        LoanNumber = 1,
        [XmlEnum( Name = "Borrower" )]
        [StringValue( "Borrower" )]
        Borrower = 2,
        [XmlEnum( Name = "Purpose" )]
        [StringValue( "Purpose" )]
        Purpose = 3,
        [XmlEnum( Name = "LoanAmount" )]
        [StringValue( "Loan Amount" )]
        LoanAmount = 4,
        [XmlEnum( Name = "PurchaseAmount" )]
        [StringValue( "Purchase Amount" )]
        PurchaseAmount = 5,
        [XmlEnum( Name = "EstimatedValue" )]
        [StringValue( "Estimated Value" )]
        EstimatedValue = 6,
        [XmlEnum( Name = "OnLine" )]
        [StringValue( "OnLine" )]
        OnLine = 7,
        [XmlEnum( Name = "ValueSupported" )]
        [StringValue( "Value Supported" )]
        ValueSupported = 8,
        [XmlEnum( Name = "Econsented" )]
        [StringValue( "eConsented" )]
        Econsented = 9,
        [XmlEnum( Name = "Edelivered" )]
        [StringValue( "eDelivered" )]
        Edelivered = 10,
        [XmlEnum( Name = "UploadedDate" )]
        [StringValue( "Uploaded Date" )]
        UploadedDate = 11,
        [XmlEnum( Name = "DeliveredDate" )]
        [StringValue( "Delivered Date" )]
        DeliveredDate = 12,
        [XmlEnum( Name = "Age" )]
        [StringValue( "Age" )]
        Age = 13
    }
}