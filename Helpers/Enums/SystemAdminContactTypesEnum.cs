using System.Xml.Serialization;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum SystemAdminContactTypesEnum
    {
        [XmlEnum( Name = "CPA" )]
        [StringValue( "CPA" )]
        CPA = 0,

        [XmlEnum( Name = "DocSigning" )]
        [StringValue( "Doc Signing" )]
        DocSigning = 1,

        //[XmlEnum( Name = "Employer" )]
        //[StringValue( "Employer" )]
        //Employer = 2,

        [XmlEnum( Name = "Escrow" )]
        [StringValue( "Escrow" )]
        Escrow = 3,

        [XmlEnum( Name = "FloodInsurance" )]
        [StringValue( "Flood Insurance" )]
        FloodInsurance = 4,

        [XmlEnum( Name = "HazardInsurance" )]
        [StringValue( "Hazard Insurance" )]
        HazardInsurance = 5,

        [XmlEnum( Name = "PropertyManagement" )]
        [StringValue( "Property Management" )]
        PropertyManagement = 6,

        [XmlEnum( Name = "HomeWarranty" )]
        [StringValue( "Home Warranty" )]
        HomeWarranty = 7,

        [XmlEnum( Name = "Survey" )]
        [StringValue( "Survey" )]
        Survey = 8,

        [XmlEnum( Name = "Termite" )]
        [StringValue( "Termite" )]
        Termite = 9,

        [XmlEnum( Name = "MortgageInsurance" )]
        [StringValue( "Mortgage Insurance" )]
        MortgageInsurance = 10,

        [XmlEnum( Name = "Realtor" )]
        [StringValue( "Realtor" )]
        Realtor = 11,

        [XmlEnum( Name = "TitleInsurance" )]
        [StringValue( "Title Insurance" )]
        TitleInsurance = 12,
    }
}