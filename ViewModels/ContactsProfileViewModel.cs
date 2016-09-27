using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Xml.Serialization;
using MML.Contracts;
using MML.Contacts;
namespace MML.Web.LoanCenter.ViewModels
{
    public class ContactsProfileViewModel
    {
        public CCompany cCompany { get; set; }
        public CCPACompany cCPACompany { get; set; }
        public CDocSigningCompany cDocSigningCompany { get; set; }
        public CEmployerCompany cEmployerCompany { get; set; }
        public CEscrowCompany cEscrowCompany { get; set; }
        public CFloodInsuranceCompany cFloodInsuranceCompany { get; set; }
        public CHazardInsuranceCompany cHazardInsuranceCompany { get; set; }
        public CHomeWarrantyCompany cHomeWarrantyCompany { get; set; }
        public CMortgageInsuranceCompany cMortgageInsuranceCompany { get; set; }
        public CPropertyManagementCompany cPropertyManagementCompany { get; set; }
        public CRealtorCompany cRealtorCompany { get; set; }
        public CSurveyCompany cSurveyCompany { get; set; }
        public CTermiteCompany cTermiteCompany { get; set; }
        public CTitleInsuranceCompany cTitleInsuranceCompany { get; set; }

        public CContact cContact { get; set; }
        public CCPAContact cCPAContact { get; set; }
        public CDocSigningContact cDocSigningContact { get; set; }
        public CEmployerContact cEmployerContact { get; set; }
        public CEscrowContact cEscrowContact { get; set; }
        public CFloodInsuranceContact cFloodInsuranceContact { get; set; }
        public CHazardInsuranceContact cHazardInsuranceContact { get; set; }
        public CHomeWarrantyContact cHomeWarrantyContact { get; set; }
        public CMortgageInsuranceContact cMortgageInsuranceContact { get; set; }
        public CPropertyManagementContact CPropertyManagementContact { get; set; }
        public CRealtorContact cRealtorContact { get; set; }
        public CSurveyContact cSurveyContact { get; set; }
        public CTermiteContact cTermiteContact { get; set; }
        public CTitleInsuranceContact cTitleInsuranceContact { get; set; }

        [XmlElement( ElementName = "States" )]
        [DataMember]
        public LookupCollection States
        {
            get;
            set;
        }
    }
}