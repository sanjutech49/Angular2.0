using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum SystemAdminEnum
    {
        [XmlEnum( Name = "SystemAdminConcierge" )]
        [StringValue( "" )]
        SystemAdminConcierge = 0,
        [XmlEnum( Name = "SystemAdminLoanCenter" )]
        [StringValue( "" )]
        SystemAdminLoanCenter = 1
    }
}