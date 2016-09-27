using System.Xml.Serialization;
using MML.Common.Helpers;


namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum OrderExceptionAttribute
    {
        [XmlEnum( Name = "ExceptionType" )]
        [StringValue( "ExceptionType" )]
        ExceptionType = 1,
        [XmlEnum( Name = "LoanNumber" )]
        [StringValue( "LoanNumber" )]
        LoanNumber = 2,
        [XmlEnum( Name = "Borrower" )]
        [StringValue( "Borrower" )]
        Borrower = 3,
        [XmlEnum( Name = "LoanAmount" )]
        [StringValue( "LoanAmount" )]
        LoanAmount = 4,
        [XmlEnum( Name = "PurchaseAmount" )]
        [StringValue( "PurchaseAmount" )]
        PurchaseAmount = 5,
        [XmlEnum( Name = "EstimatedValue" )]
        [StringValue( "EstimatedValue" )]
        EstimatedValue = 6,
        [XmlEnum( Name = "ActualValue" )]
        [StringValue( "ActualValue" )]
        ActualValue = 7,
        [XmlEnum( Name = "ValueSupported" )]
        [StringValue( "ValueSupported" )]
        ValueSupported = 8,
        [XmlEnum( Name = "AppraisalCondition" )]
        [StringValue( "AppraisalCondition" )]
        AppraisalCondition = 9,
        [XmlEnum( Name = "LoanOfficer" )]
        [StringValue( "LoanOfficer" )]
        LoanOfficer = 10,
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