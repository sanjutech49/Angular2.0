using MML.Common;
using MML.Contacts;
using MML.Contracts;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.Facade;
using System.Collections.Generic;
using System;
using System.Web;

namespace MML.Web.LoanCenter.Helpers.SystemAdmin
{
    public class ContactHelper
    {
        private ContactsCompanyServiceFacade _facade = new ContactsCompanyServiceFacade();

        public static SystemAdminContactsViewModel GetCompaniesAndContacts(  HttpContextBase context, Dictionary<string, string> parameters = null, int currentPage = 0 )
        {
            if ( parameters == null )
            {
                parameters = new Dictionary<string, string>();
                parameters.Add( "contactType", "-1" );
                parameters.Add( "activeInactive", "false" );
                parameters.Add( "searchString", "Search" );
                parameters.Add( "currentPage", "1" );
                parameters.Add( "pageSize", "10" );
                parameters.Add( "requestMultiplePages", "null" );
                parameters.Add( "getNextPages", "null" );
                parameters.Add( "hasChildren", "null" );
                
            }

            bool? hasChildren = null;
            bool? requestMultiplePages = null;
            bool? getNextPages = null;
            bool? activInactive = null;
            int vCurrentPage = 1;

            if ( currentPage != 0 )
                vCurrentPage = currentPage;
            else
                vCurrentPage = Int32.Parse( parameters[ "currentPage" ] );

            SystemAdminContactsViewModel contactsViewModel = new SystemAdminContactsViewModel();
            ContactsCompanyServiceFacade contactsFacade = new ContactsCompanyServiceFacade();

            if ( !parameters[ "activeInactive" ].ToString().Equals( "null" ) ) activInactive = bool.Parse( parameters[ "activeInactive" ] );
            if ( !parameters[ "requestMultiplePages" ].ToString().Equals( "null" ) ) requestMultiplePages = bool.Parse( parameters[ "requestMultiplePages" ] );
            if ( !parameters[ "getNextPages" ].ToString().Equals( "null" ) ) getNextPages = bool.Parse( parameters[ "getNextPages" ] );
            if ( !parameters[ "hasChildren" ].ToString().Equals( "null" ) ) hasChildren = bool.Parse( parameters[ "hasChildren" ] );


            var contactsDetails = contactsFacade.GetAllCompaniesAndContacts(Int32.Parse(parameters["contactType"]), activInactive, parameters["searchString"], vCurrentPage, Int32.Parse(parameters["pageSize"]), hasChildren);
            contactsViewModel.ContactCompaniesAndUsers = contactsDetails.ContactCompaniesAndUsersList;
            contactsViewModel.TotalItems = contactsDetails.TotalItems;
            contactsViewModel.PageCount = contactsDetails.TotalPages;
            contactsViewModel.CurrentPage = contactsDetails.CurrentPage;
            contactsViewModel.CurrentContactType = Int32.Parse(parameters["contactType"]);
            contactsViewModel.CurrentActivity = activInactive == null ? -1 : Convert.ToInt32(activInactive);

            contactsViewModel = GridHelper.GetStartEndPage<SystemAdminContactsViewModel>( contactsViewModel, requestMultiplePages: requestMultiplePages,getNextPages: getNextPages );

            return contactsViewModel;
        }

        public static SystemAdminContactsViewModel GetLoanCompaniesAndContacts( HttpContextBase context, Dictionary<string, string> parameters = null, int currentPage = 0 )
        {
            if ( parameters == null )
            {
                parameters = new Dictionary<string, string>();
                parameters.Add( "contactType", "-1" );
                parameters.Add( "activeInactive", "null" );
                parameters.Add( "searchString", "Search" );
                parameters.Add( "currentPage", "1" );
                parameters.Add( "pageSize", "10" );
                parameters.Add( "requestMultiplePages", "null" );
                parameters.Add( "getNextPages", "null" );
                parameters.Add( "hasChildren", "null" );
                parameters.Add( "loanId", Guid.Empty.ToString() );

            }

            bool? hasChildren = null;
            bool? requestMultiplePages = null;
            bool? getNextPages = null;
            bool? activInactive = null;
            int vCurrentPage = 1;
            //Guid loanId = Guid.Empty;

            if ( currentPage != 0 )
                vCurrentPage = currentPage;
            else
                vCurrentPage = Int32.Parse( parameters[ "currentPage" ] );

            SystemAdminContactsViewModel contactsViewModel = new SystemAdminContactsViewModel();
            ContactsCompanyServiceFacade contactsFacade = new ContactsCompanyServiceFacade();

            if ( !parameters[ "activeInactive" ].ToString().Equals( "null" ) ) activInactive = bool.Parse( parameters[ "activeInactive" ] );
            if ( !parameters[ "requestMultiplePages" ].ToString().Equals( "null" ) ) requestMultiplePages = bool.Parse( parameters[ "requestMultiplePages" ] );
            if ( !parameters[ "getNextPages" ].ToString().Equals( "null" ) ) getNextPages = bool.Parse( parameters[ "getNextPages" ] );
            if ( !parameters[ "hasChildren" ].ToString().Equals( "null" ) ) hasChildren = bool.Parse( parameters[ "hasChildren" ] );
            //if ( !parameters[ "loanId" ].ToString().Equals( "null" ) ) Guid.TryParse( parameters[ "loanId" ], out loanId );

            var contactsDetails = contactsFacade.GetAllLoanCompaniesAndContacts( Int32.Parse( parameters[ "contactType" ] ), activInactive, parameters[ "searchString" ], vCurrentPage, Int32.Parse( parameters[ "pageSize" ] ), hasChildren, parameters[ "loanId" ] );
            contactsViewModel.LoanCompaniesAndContacts = contactsDetails.LoanCompaniesAndUsersList;
            contactsViewModel.TotalItems = contactsDetails.TotalItems;
            contactsViewModel.PageCount = contactsDetails.TotalPages;
            contactsViewModel.CurrentPage = contactsDetails.CurrentPage;
            contactsViewModel.CurrentContactType = contactsDetails.CurrentContactType;
            contactsViewModel.CurrentActivity = contactsDetails.CurrentActivity;

            contactsViewModel = GridHelper.GetStartEndPage<SystemAdminContactsViewModel>( contactsViewModel, requestMultiplePages: requestMultiplePages, getNextPages: getNextPages );

            return contactsViewModel;
        }

        public object CopyGlobalContactToLoanContact( int contactType, int contactId, Guid loanId )
        {

            switch ( ( SystemAdminContactTypesEnum )contactType )
            {
                case SystemAdminContactTypesEnum.CPA:

                    CCPAContact cCPAContact = _facade.LoadContactsContact<CCPAContact>( contactType, contactId );
                    LoanCPAContact loanCPAContact = new LoanCPAContact();
                    loanCPAContact = ( LoanCPAContact )CopyCContactToLoanContact( cCPAContact, loanCPAContact );
                    loanCPAContact.LoanId = loanId;
                    return loanCPAContact;
                case SystemAdminContactTypesEnum.DocSigning:

                    CDocSigningContact cDocSigningContact = _facade.LoadContactsContact<CDocSigningContact>( contactType, contactId );
                    LoanDocSigningContact loanDocSigningContact = new LoanDocSigningContact();
                    loanDocSigningContact = ( LoanDocSigningContact )CopyCContactToLoanContact( cDocSigningContact, loanDocSigningContact );
                    loanDocSigningContact.LoanId = loanId;
                    return loanDocSigningContact;
                //case SystemAdminContactTypesEnum.Employer:
                //    CEmployerContact cEmployerContact = _facade.LoadContactsContact<CEmployerContact>( contactType, contactId );
                //    LoanEmployerContact loanEmployerContact = new LoanEmployerContact();
                //    loanEmployerContact = ( LoanEmployerContact )CopyCContactToLoanContact( cEmployerContact, loanEmployerContact );
                //    loanEmployerContact.LoanId = loanId;
                //    loanEmployerContact.EnableIntegrations = cEmployerContact.EnableIntegrations;
                //    loanEmployerContact.ContactURLForReference = cEmployerContact.ContactURLForReference;
                //    loanEmployerContact.HBMId = cEmployerContact.HBMId;
                //    loanEmployerContact.LeadSourceId = cEmployerContact.LeadSourceId;
                //    loanEmployerContact.Description = cEmployerContact.Description;
                //    loanEmployerContact.CRMCampaignId = cEmployerContact.CRMCampaignId;
                //    return loanEmployerContact;
                case SystemAdminContactTypesEnum.Escrow:
                    CEscrowContact cEscrowContact = _facade.LoadContactsContact<CEscrowContact>( contactType, contactId );
                    LoanEscrowContact loanEscrowContact = new LoanEscrowContact();
                    loanEscrowContact = ( LoanEscrowContact )CopyCContactToLoanContact( cEscrowContact, loanEscrowContact );
                    loanEscrowContact.LoanId = loanId;
                    return loanEscrowContact;
                case SystemAdminContactTypesEnum.FloodInsurance:
                    CFloodInsuranceContact cFloodInsuranceContact = _facade.LoadContactsContact<CFloodInsuranceContact>( contactType, contactId );
                    LoanFloodInsuranceContact loanFloodInsuranceContact = new LoanFloodInsuranceContact();
                    loanFloodInsuranceContact = ( LoanFloodInsuranceContact )CopyCContactToLoanContact( cFloodInsuranceContact, loanFloodInsuranceContact );
                    loanFloodInsuranceContact.LoanId = loanId;
                    return loanFloodInsuranceContact;
                case SystemAdminContactTypesEnum.HazardInsurance:
                    CHazardInsuranceContact cHazardInsuranceContact = _facade.LoadContactsContact<CHazardInsuranceContact>( contactType, contactId );
                    LoanHazardInsuranceContact loanHazardInsuranceContact = new LoanHazardInsuranceContact();
                    loanHazardInsuranceContact = ( LoanHazardInsuranceContact )CopyCContactToLoanContact( cHazardInsuranceContact, loanHazardInsuranceContact );
                    loanHazardInsuranceContact.LoanId = loanId;
                    return loanHazardInsuranceContact;
                case SystemAdminContactTypesEnum.HomeWarranty:
                    CHomeWarrantyContact cHomeWarrantyContact = _facade.LoadContactsContact<CHomeWarrantyContact>( contactType, contactId );
                    LoanHomeWarrantyContact loanHomeWarrantyContact = new LoanHomeWarrantyContact();
                    loanHomeWarrantyContact = ( LoanHomeWarrantyContact )CopyCContactToLoanContact( cHomeWarrantyContact, loanHomeWarrantyContact );
                    loanHomeWarrantyContact.LoanId = loanId;
                    return loanHomeWarrantyContact;
                case SystemAdminContactTypesEnum.MortgageInsurance:
                    CMortgageInsuranceContact cMortgageInsuranceContact = _facade.LoadContactsContact<CMortgageInsuranceContact>( contactType, contactId );
                    LoanMortgageInsuranceContact loanMortgageInsuranceContact = new LoanMortgageInsuranceContact();
                    loanMortgageInsuranceContact = ( LoanMortgageInsuranceContact )CopyCContactToLoanContact( cMortgageInsuranceContact, loanMortgageInsuranceContact );
                    loanMortgageInsuranceContact.LoanId = loanId;
                    return loanMortgageInsuranceContact;
                case SystemAdminContactTypesEnum.PropertyManagement:
                    CPropertyManagementContact cPropertyManagementContact = _facade.LoadContactsContact<CPropertyManagementContact>( contactType, contactId );
                    LoanPropertyManagementContact loanPropertyManagementContact = new LoanPropertyManagementContact();
                    loanPropertyManagementContact = ( LoanPropertyManagementContact )CopyCContactToLoanContact( cPropertyManagementContact, loanPropertyManagementContact );
                    loanPropertyManagementContact.LoanId = loanId;
                    return loanPropertyManagementContact;
                case SystemAdminContactTypesEnum.Realtor:
                    CRealtorContact cRealtorContact = _facade.LoadContactsContact<CRealtorContact>( contactType, contactId );
                    LoanRealtorContact loanRealtorContact = new LoanRealtorContact();
                    loanRealtorContact = ( LoanRealtorContact )CopyCContactToLoanContact( cRealtorContact, loanRealtorContact );
                    loanRealtorContact.LoanId = loanId;
                    loanRealtorContact.EnableIntegrations = cRealtorContact.EnableIntegrations;
                    loanRealtorContact.ContactURLForReference = cRealtorContact.ContactURLForReference;
                    loanRealtorContact.HBMId = cRealtorContact.HBMId;
                    loanRealtorContact.LeadSourceId = cRealtorContact.LeadSourceId;
                    loanRealtorContact.Description = cRealtorContact.Description;
                    loanRealtorContact.CRMCampaignId = cRealtorContact.CRMCampaignId;
                    loanRealtorContact.RealtorLicenseNumber = cRealtorContact.RealtorLicenseNumber;
                    return loanRealtorContact;
                case SystemAdminContactTypesEnum.Survey:
                    CSurveyContact cSurveyContact = _facade.LoadContactsContact<CSurveyContact>( contactType, contactId );
                    LoanSurveyContact loanSurveyContact = new LoanSurveyContact();
                    loanSurveyContact = ( LoanSurveyContact )CopyCContactToLoanContact( cSurveyContact, loanSurveyContact );
                    loanSurveyContact.LoanId = loanId;
                    return loanSurveyContact;
                case SystemAdminContactTypesEnum.Termite:
                    CTermiteContact cTermiteContact = _facade.LoadContactsContact<CTermiteContact>( contactType, contactId );
                    LoanTermiteContact loanTermiteContact = new LoanTermiteContact();
                    loanTermiteContact = ( LoanTermiteContact )CopyCContactToLoanContact( cTermiteContact, loanTermiteContact );
                    loanTermiteContact.LoanId = loanId;
                    return loanTermiteContact;
                case SystemAdminContactTypesEnum.TitleInsurance:
                    CTitleInsuranceContact cTitleInsuranceContact = _facade.LoadContactsContact<CTitleInsuranceContact>( contactType, contactId );
                    LoanTitleInsuranceContact loanTitleInsuranceContact = new LoanTitleInsuranceContact();
                    loanTitleInsuranceContact = ( LoanTitleInsuranceContact )CopyCContactToLoanContact( cTitleInsuranceContact, loanTitleInsuranceContact );
                    loanTitleInsuranceContact.LoanId = loanId;
                    return loanTitleInsuranceContact;
            }
            return null;
        }

        public object CopyGlobalCompanyToLoanCompany( int contactType, int companyId, Guid loanId)
        {
            switch ( ( SystemAdminContactTypesEnum )contactType )
            {
                case SystemAdminContactTypesEnum.CPA:

                    CCPACompany cCPACompany = _facade.LoadContactsCompany<CCPACompany>( contactType, companyId );
                    LoanCPACompany loanCPACompany = new LoanCPACompany();
                    loanCPACompany = (LoanCPACompany) CopyCCompanyToLoanCompany( cCPACompany, loanCPACompany );
                    loanCPACompany.LoanId = loanId;
                    return loanCPACompany;
                case SystemAdminContactTypesEnum.DocSigning:
                    CDocSigningCompany cDocSigningCompany = _facade.LoadContactsCompany<CDocSigningCompany>( contactType, companyId );
                    LoanDocSigningCompany loanDocSigningCompany = new LoanDocSigningCompany();
                    loanDocSigningCompany = ( LoanDocSigningCompany )CopyCCompanyToLoanCompany( cDocSigningCompany, loanDocSigningCompany );
                    loanDocSigningCompany.LoanId = loanId;
                    return loanDocSigningCompany;
                //case SystemAdminContactTypesEnum.Employer:

                //    CEmployerCompany cEmployerCompany = _facade.LoadContactsCompany<CEmployerCompany>( contactType, companyId );
                //    LoanEmployerCompany loanEmployerCompany = new LoanEmployerCompany();
                //    loanEmployerCompany = ( LoanEmployerCompany )CopyCCompanyToLoanCompany( cEmployerCompany, loanEmployerCompany );
                //    loanEmployerCompany.LoanId = loanId;
                //    return loanEmployerCompany;
                case SystemAdminContactTypesEnum.Escrow:
                    CEscrowCompany cEscrowCompany = _facade.LoadContactsCompany<CEscrowCompany>( contactType, companyId );
                    LoanEscrowCompany loanEscrowCompany = new LoanEscrowCompany();
                    loanEscrowCompany = ( LoanEscrowCompany )CopyCCompanyToLoanCompany( cEscrowCompany, loanEscrowCompany );
                    loanEscrowCompany.LoanId = loanId;
                    loanEscrowCompany.RealECProviderId = cEscrowCompany.RealECProviderId;
                    loanEscrowCompany.ABANumber = cEscrowCompany.ABANumber;
                    loanEscrowCompany.RoutingNumber = cEscrowCompany.RoutingNumber;
                    return loanEscrowCompany;
                case SystemAdminContactTypesEnum.FloodInsurance:
                    CFloodInsuranceCompany cFloodInsuranceCompany  = _facade.LoadContactsCompany<CFloodInsuranceCompany>( contactType, companyId );
                    LoanFloodInsuranceCompany loanFloodInsuranceCompany = new LoanFloodInsuranceCompany();
                    loanFloodInsuranceCompany = ( LoanFloodInsuranceCompany )CopyCCompanyToLoanCompany( cFloodInsuranceCompany, loanFloodInsuranceCompany );
                    loanFloodInsuranceCompany.LoanId = loanId;
                    return loanFloodInsuranceCompany;
                case SystemAdminContactTypesEnum.HazardInsurance:
                    CHazardInsuranceCompany cHazardInsuranceCompany = _facade.LoadContactsCompany<CHazardInsuranceCompany>( contactType, companyId );
                    LoanHazardInsuranceCompany loanHazardInsuranceCompany = new LoanHazardInsuranceCompany();
                    loanHazardInsuranceCompany = ( LoanHazardInsuranceCompany )CopyCCompanyToLoanCompany( cHazardInsuranceCompany, loanHazardInsuranceCompany );
                    loanHazardInsuranceCompany.LoanId = loanId;
                    return loanHazardInsuranceCompany;
                case SystemAdminContactTypesEnum.HomeWarranty:
                    CHomeWarrantyCompany cHomeWarrantyCompany = _facade.LoadContactsCompany<CHomeWarrantyCompany>( contactType, companyId );
                    LoanHomeWarrantyCompany loanHomeWarrantyCompany = new LoanHomeWarrantyCompany();
                    loanHomeWarrantyCompany = ( LoanHomeWarrantyCompany )CopyCCompanyToLoanCompany( cHomeWarrantyCompany, loanHomeWarrantyCompany );
                    loanHomeWarrantyCompany.LoanId = loanId;
                    return loanHomeWarrantyCompany;
                case SystemAdminContactTypesEnum.MortgageInsurance:
                    CMortgageInsuranceCompany cMortgageInsuranceCompany = _facade.LoadContactsCompany<CMortgageInsuranceCompany>( contactType, companyId );
                    LoanMortgageInsuranceCompany loanMortgageInsuranceCompany = new LoanMortgageInsuranceCompany();
                    loanMortgageInsuranceCompany = ( LoanMortgageInsuranceCompany )CopyCCompanyToLoanCompany( cMortgageInsuranceCompany, loanMortgageInsuranceCompany );
                    loanMortgageInsuranceCompany.LoanId = loanId;
                    return loanMortgageInsuranceCompany;
                case SystemAdminContactTypesEnum.PropertyManagement:
                    CPropertyManagementCompany cPropertyManagementCompany = _facade.LoadContactsCompany<CPropertyManagementCompany>( contactType, companyId );
                    LoanPropertyManagementCompany loanPropertyManagementCompany = new LoanPropertyManagementCompany();
                    loanPropertyManagementCompany = ( LoanPropertyManagementCompany )CopyCCompanyToLoanCompany( cPropertyManagementCompany, loanPropertyManagementCompany );
                    loanPropertyManagementCompany.LoanId = loanId;
                    return loanPropertyManagementCompany;
                case SystemAdminContactTypesEnum.Realtor:
                    CRealtorCompany cRealtorCompany = _facade.LoadContactsCompany<CRealtorCompany>( contactType, companyId );
                    LoanRealtorCompany loanRealtorCompany = new LoanRealtorCompany();
                    loanRealtorCompany = ( LoanRealtorCompany )CopyCCompanyToLoanCompany( cRealtorCompany, loanRealtorCompany );
                    loanRealtorCompany.LoanId = loanId;
                    return loanRealtorCompany;
                case SystemAdminContactTypesEnum.Survey:
                    CSurveyCompany cSurveyCompany = _facade.LoadContactsCompany<CSurveyCompany>( contactType, companyId );
                    LoanSurveyCompany loanSurveyCompany = new LoanSurveyCompany();
                    loanSurveyCompany = ( LoanSurveyCompany )CopyCCompanyToLoanCompany( cSurveyCompany, loanSurveyCompany );
                    loanSurveyCompany.LoanId = loanId;
                    return loanSurveyCompany;
                case SystemAdminContactTypesEnum.Termite:
                    CTermiteCompany cTermiteCompany =  _facade.LoadContactsCompany<CTermiteCompany>( contactType, companyId );
                    LoanTermiteCompany loanTermiteCompany = new LoanTermiteCompany();
                    loanTermiteCompany = ( LoanTermiteCompany )CopyCCompanyToLoanCompany( cTermiteCompany, loanTermiteCompany );
                    loanTermiteCompany.LoanId = loanId;
                    return loanTermiteCompany;
                case SystemAdminContactTypesEnum.TitleInsurance:
                    CTitleInsuranceCompany cTitleInsuranceCompany = _facade.LoadContactsCompany<CTitleInsuranceCompany>( contactType, companyId );
                    LoanTitleInsuranceCompany loanTitleInsuranceCompany = new LoanTitleInsuranceCompany();
                    loanTitleInsuranceCompany = ( LoanTitleInsuranceCompany )CopyCCompanyToLoanCompany( cTitleInsuranceCompany, loanTitleInsuranceCompany );
                    loanTitleInsuranceCompany.LoanId = loanId;
                    loanTitleInsuranceCompany.RealECProviderId = cTitleInsuranceCompany.RealECProviderId;
                    loanTitleInsuranceCompany.ABANumber = cTitleInsuranceCompany.ABANumber;
                    loanTitleInsuranceCompany.RoutingNumber = cTitleInsuranceCompany.RoutingNumber;
                    return loanTitleInsuranceCompany;
            }
            return null;

        }

        public LoanCompany CopyCCompanyToLoanCompany(CCompany cCompany, LoanCompany loanCompany)
        {
            loanCompany.ContactType = cCompany.ContactType;
            loanCompany.CompanyName = cCompany.CompanyName;
            loanCompany.StreetAddress = cCompany.StreetAddress;
            loanCompany.Zip = cCompany.Zip;
            loanCompany.City = cCompany.City;
            loanCompany.StateId = cCompany.StateId;
            loanCompany.CompanyPhoneNumber = cCompany.CompanyPhoneNumber;
            loanCompany.LicenseNumber = cCompany.LicenseNumber;
            loanCompany.Deactivated = cCompany.Deactivated;
            loanCompany.WebURL = cCompany.WebURL;

            return loanCompany;
        }

        public LoanContact CopyCContactToLoanContact( CContact cContact, LoanContact loanContact )
        {
            loanContact.FirstName = cContact.FirstName;
            loanContact.LastName = cContact.LastName;
            loanContact.Email = cContact.Email;
            loanContact.PhoneNumber = cContact.PhoneNumber;
            loanContact.Deactivated = cContact.Deactivated;
            loanContact.LicenseNumber = cContact.LicenseNumber;
            loanContact.GlobalContactId = cContact.ContactId;

            return loanContact;
        }

        public LoanCompany SetLoanCompanyFromDictionary( Dictionary<string, string> parameters, LoanCompany loanCompany )
        {
            loanCompany.ContactType = Int32.Parse(parameters["CompanyType"].ToString());
            loanCompany.CompanyName = parameters["CompanyName"].ToString();
            loanCompany.StreetAddress = parameters["StreetAddress"].ToString();
            loanCompany.Zip = parameters["Zip"].ToString();
            loanCompany.City = parameters["City"].ToString();
            loanCompany.StateId = Int32.Parse(parameters["StateId"].ToString());
            Guid loanId = Guid.Empty;
            Guid.TryParse( parameters[ "LoanId" ].ToString(), out  loanId );
            loanCompany.LoanId = loanId;
            return loanCompany;
        }

        public LoanContact SetLoanContactFromDictionary( Dictionary<string, string> parameters, LoanContact loanContact )
        {
            loanContact.FirstName = parameters[ "FirstName" ].ToString();
            loanContact.LastName = parameters[ "LastName" ].ToString();
            loanContact.Email = parameters[ "Email" ].ToString();
            loanContact.PhoneNumber = parameters[ "PreferredPhone" ].ToString();
            loanContact.AlternatePhoneNumber = parameters["AlternatePhone"].ToString();
            loanContact.ReferenceNumber = parameters[ "ReferenceNumber" ].ToString();
            loanContact.PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() );
            loanContact.AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() );
            Guid loanId = Guid.Empty;
            Guid.TryParse( parameters[ "LoanId" ].ToString(), out  loanId );
            loanContact.LoanId = loanId;
            return loanContact;
        }


        public BusinessContact PopulateBusinessContactFromLoanContact(object loancompanyType, object loanContactType, Guid loanId)
        {
            LoanCompany loancompany = (LoanCompany) loancompanyType;
            LoanContact loanContact = (LoanContact) loanContactType;
            Seller seller = new Seller()
            {
                FirstNameSeller = loanContact.FirstName,
                LastNameSeller = loanContact.LastName,
                ContactPhonePreferredSeller = loanContact.PhoneNumber,
                ContactPhonePreferredSellerType = ( PhoneNumberType )loanContact.PhoneNumberType,
                ContactPhoneAlternateSeller = loanContact.AlternatePhoneNumber,
                ContactPhoneAlternateSellerType = ( PhoneNumberType )loanContact.AlternatePhoneNumberType,
                EmailSeller = loanContact.Email
                
            };

            // Address information

            Address address = new Address()
            {
                StreetName = loancompany.StreetAddress,
                ZipCode = loancompany.Zip,
                CityName = loancompany.City,
                StateId = loancompany.StateId,

            };

            // Business contact information

            BusinessContact businessContact = new BusinessContact()
            {
                BusinessContactCategory = ( BusinessContactCategory )loancompany.ContactType,
                CompanyContactsType = loancompany.ContactType,
                Seller = seller,
                LoanId = loanId,
                Address = address,
                CompanyName = loancompany.CompanyName,
                FirstName = loanContact.FirstName,
                LastName = loanContact.LastName,
                Email = loanContact.Email,
                ReferenceNumber = loanContact.ReferenceNumber,
                LoanContactsCompanyId = loancompany.CompanyId,
                LoanContactsContactId = loanContact.ContactId,
                LoanContactsContactType = loancompany.ContactType > -1 ? loancompany.ContactType : -1,
                IsLoanApplicationCompleted = loanContact.IsLoanApplicationCompleted,
                IsContactFromCoBrandedSite = loanContact.IsContactFromCoBrandedSite
            };

            if ( loanContactType is LoanRealtorContact )
            {
                LoanRealtorContact realtor = (LoanRealtorContact) loanContactType;
                businessContact.LoanContactsContactSubType = realtor.SubType;
            }
            return businessContact;
        }

        public object GetCorrectContactModel( Dictionary<string, string> parameters )
        {
            int loanContactsContactId;
            Int32.TryParse( parameters[ "LoanContactsContactId" ].ToString(), out loanContactsContactId );
            int contactType;
            Int32.TryParse( parameters[ "CompanyType" ].ToString(), out contactType );

            switch ( ( ContactsTypeEnum )contactType )
            {
                case ContactsTypeEnum.CPA:
                    LoanCPAContact loanCPAContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanCPAContact>( contactType, loanContactsContactId ) : new LoanCPAContact();
                    loanCPAContact = (LoanCPAContact) SetLoanContactFromDictionary( parameters, loanCPAContact );
                    return loanCPAContact;
                case ContactsTypeEnum.DocSigning:
                    LoanDocSigningContact loanDocSigningContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanDocSigningContact>( contactType, loanContactsContactId ) : new LoanDocSigningContact();
                    loanDocSigningContact = ( LoanDocSigningContact )SetLoanContactFromDictionary( parameters, loanDocSigningContact );
                    return loanDocSigningContact;

                case ContactsTypeEnum.Employer:
                    LoanEmployerContact loanEmployerContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanEmployerContact>( contactType, loanContactsContactId ) : new LoanEmployerContact();
                    loanEmployerContact = ( LoanEmployerContact )SetLoanContactFromDictionary( parameters, loanEmployerContact );
                    return loanEmployerContact;
                case ContactsTypeEnum.Escrow:
                    LoanEscrowContact loanEscrowContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanEscrowContact>( contactType, loanContactsContactId ) : new LoanEscrowContact();
                    loanEscrowContact = ( LoanEscrowContact )SetLoanContactFromDictionary( parameters, loanEscrowContact );
                    return loanEscrowContact;
                case ContactsTypeEnum.FloodInsurance:
                    LoanFloodInsuranceContact loanFloodInsuranceContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanFloodInsuranceContact>( contactType, loanContactsContactId ) : new LoanFloodInsuranceContact();
                    loanFloodInsuranceContact = ( LoanFloodInsuranceContact )SetLoanContactFromDictionary( parameters, loanFloodInsuranceContact );
                    return loanFloodInsuranceContact;
                case ContactsTypeEnum.HazardInsurance:
                    LoanHazardInsuranceContact loanHazardInsuranceContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanHazardInsuranceContact>( contactType, loanContactsContactId ) : new LoanHazardInsuranceContact();
                    loanHazardInsuranceContact = ( LoanHazardInsuranceContact )SetLoanContactFromDictionary( parameters, loanHazardInsuranceContact );
                    return loanHazardInsuranceContact;
                case ContactsTypeEnum.HomeWarranty:
                    LoanHomeWarrantyContact loanHomeWarrantyContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanHomeWarrantyContact>( contactType, loanContactsContactId ) : new LoanHomeWarrantyContact();
                    loanHomeWarrantyContact = ( LoanHomeWarrantyContact )SetLoanContactFromDictionary( parameters, loanHomeWarrantyContact );
                    return loanHomeWarrantyContact;
                case ContactsTypeEnum.MortgageInsurance:
                    LoanMortgageInsuranceContact loanMortgageInsuranceContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanMortgageInsuranceContact>( contactType, loanContactsContactId ) : new LoanMortgageInsuranceContact();
                    loanMortgageInsuranceContact = ( LoanMortgageInsuranceContact )SetLoanContactFromDictionary( parameters, loanMortgageInsuranceContact );
                    return loanMortgageInsuranceContact;
                case ContactsTypeEnum.PropertyManagement:
                    LoanPropertyManagementContact loanPropertyManagementContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanPropertyManagementContact>( contactType, loanContactsContactId ) : new LoanPropertyManagementContact();
                    loanPropertyManagementContact = ( LoanPropertyManagementContact )SetLoanContactFromDictionary( parameters, loanPropertyManagementContact );
                    return loanPropertyManagementContact;
                case ContactsTypeEnum.Realtor:
                    LoanRealtorContact loanRealtorContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanRealtorContact>( contactType, loanContactsContactId ) : new LoanRealtorContact();
                    loanRealtorContact = ( LoanRealtorContact )SetLoanContactFromDictionary( parameters, loanRealtorContact );
                    loanRealtorContact.SubType = Int32.Parse( parameters[ "LoanContactsContactSubType" ].ToString() );
                    return loanRealtorContact;
                case ContactsTypeEnum.Survey:
                    LoanSurveyContact loanSurveyContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanSurveyContact>( contactType, loanContactsContactId ) : new LoanSurveyContact();
                    loanSurveyContact = ( LoanSurveyContact )SetLoanContactFromDictionary( parameters, loanSurveyContact );
                    return loanSurveyContact;
                case ContactsTypeEnum.Termite:
                    LoanTermiteContact loanTermiteContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanTermiteContact>( contactType, loanContactsContactId ) : new LoanTermiteContact();
                    loanTermiteContact = ( LoanTermiteContact )SetLoanContactFromDictionary( parameters, loanTermiteContact );
                    return loanTermiteContact;
                case ContactsTypeEnum.TitleInsurance:
                    LoanTitleInsuranceContact loanTitleInsuranceContact = loanContactsContactId != 0 ? _facade.LoadLoanContact<LoanTitleInsuranceContact>( contactType, loanContactsContactId ) : new LoanTitleInsuranceContact();
                    loanTitleInsuranceContact = ( LoanTitleInsuranceContact )SetLoanContactFromDictionary( parameters, loanTitleInsuranceContact );
                    return loanTitleInsuranceContact;
            }
            return null;
        }


        public object GetCorrectCompanyModel( Dictionary<string, string> parameters )
        {
            int loanContactsCompanyId;
            Int32.TryParse( parameters[ "LoanContactsCompanyId" ].ToString(), out loanContactsCompanyId );
            int contactType;
            Int32.TryParse( parameters[ "CompanyType" ].ToString(), out contactType );

            switch ( ( ContactsTypeEnum )contactType  )
            {
                case ContactsTypeEnum.CPA:
                    LoanCPACompany loanCPACompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanCPACompany>( contactType, loanContactsCompanyId ) : new LoanCPACompany();
                    loanCPACompany = ( LoanCPACompany )SetLoanCompanyFromDictionary( parameters, loanCPACompany );
                    return loanCPACompany;
                case ContactsTypeEnum.DocSigning:
                    LoanDocSigningCompany loanDocSigningCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanDocSigningCompany>( contactType, loanContactsCompanyId ) : new LoanDocSigningCompany();
                    loanDocSigningCompany = ( LoanDocSigningCompany )SetLoanCompanyFromDictionary( parameters, loanDocSigningCompany );
                    return loanDocSigningCompany;
                case ContactsTypeEnum.Employer:
                    LoanEmployerCompany loanEmployerCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanEmployerCompany>( contactType, loanContactsCompanyId ) : new LoanEmployerCompany();
                    loanEmployerCompany = ( LoanEmployerCompany )SetLoanCompanyFromDictionary( parameters, loanEmployerCompany );
                    return loanEmployerCompany;
                case ContactsTypeEnum.Escrow:
                    LoanEscrowCompany loanEscrowCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanEscrowCompany>( contactType, loanContactsCompanyId ) : new LoanEscrowCompany();
                    loanEscrowCompany = ( LoanEscrowCompany )SetLoanCompanyFromDictionary( parameters, loanEscrowCompany );
                    return loanEscrowCompany;
                case ContactsTypeEnum.FloodInsurance:
                    LoanFloodInsuranceCompany loanFloodInsuranceCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanFloodInsuranceCompany>( contactType, loanContactsCompanyId ) : new LoanFloodInsuranceCompany();
                    loanFloodInsuranceCompany = ( LoanFloodInsuranceCompany )SetLoanCompanyFromDictionary( parameters, loanFloodInsuranceCompany );
                    return loanFloodInsuranceCompany;
                case ContactsTypeEnum.HazardInsurance:
                    LoanHazardInsuranceCompany loanHazardInsuranceCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanHazardInsuranceCompany>( contactType, loanContactsCompanyId ) : new LoanHazardInsuranceCompany();
                    loanHazardInsuranceCompany = ( LoanHazardInsuranceCompany )SetLoanCompanyFromDictionary( parameters, loanHazardInsuranceCompany );
                    return loanHazardInsuranceCompany;
                case ContactsTypeEnum.HomeWarranty:
                    LoanHomeWarrantyCompany loanHomeWarrantyCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanHomeWarrantyCompany>( contactType, loanContactsCompanyId ) : new LoanHomeWarrantyCompany();
                    loanHomeWarrantyCompany = ( LoanHomeWarrantyCompany )SetLoanCompanyFromDictionary( parameters, loanHomeWarrantyCompany );
                    return loanHomeWarrantyCompany;
                case ContactsTypeEnum.MortgageInsurance:
                    LoanMortgageInsuranceCompany loanMortgageInsuranceCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanMortgageInsuranceCompany>( contactType, loanContactsCompanyId ) : new LoanMortgageInsuranceCompany();
                    loanMortgageInsuranceCompany = ( LoanMortgageInsuranceCompany )SetLoanCompanyFromDictionary( parameters, loanMortgageInsuranceCompany );
                    return loanMortgageInsuranceCompany;
                case ContactsTypeEnum.PropertyManagement:
                    LoanPropertyManagementCompany loanPropertyManagementCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanPropertyManagementCompany>( contactType, loanContactsCompanyId ) : new LoanPropertyManagementCompany();
                    loanPropertyManagementCompany = ( LoanPropertyManagementCompany )SetLoanCompanyFromDictionary( parameters, loanPropertyManagementCompany );
                    return loanPropertyManagementCompany;
                case ContactsTypeEnum.Realtor:
                    LoanRealtorCompany loanRealtorCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanRealtorCompany>( contactType, loanContactsCompanyId ) : new LoanRealtorCompany();
                    loanRealtorCompany = ( LoanRealtorCompany )SetLoanCompanyFromDictionary( parameters, loanRealtorCompany );
                    return loanRealtorCompany;
                case ContactsTypeEnum.Survey:
                    LoanSurveyCompany loanSurveyCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanSurveyCompany>( contactType, loanContactsCompanyId ) : new LoanSurveyCompany();
                    loanSurveyCompany = ( LoanSurveyCompany )SetLoanCompanyFromDictionary( parameters, loanSurveyCompany );
                    return loanSurveyCompany;
                case ContactsTypeEnum.Termite:
                    LoanTermiteCompany loanTermiteCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanTermiteCompany>( contactType, loanContactsCompanyId ) : new LoanTermiteCompany();
                    loanTermiteCompany = ( LoanTermiteCompany )SetLoanCompanyFromDictionary( parameters, loanTermiteCompany );
                    return loanTermiteCompany;
                case ContactsTypeEnum.TitleInsurance:
                    LoanTitleInsuranceCompany loanTitleInsuranceCompany = loanContactsCompanyId != 0 ? _facade.LoadLoanCompany<LoanTitleInsuranceCompany>( contactType, loanContactsCompanyId ) : new LoanTitleInsuranceCompany();
                    loanTitleInsuranceCompany = ( LoanTitleInsuranceCompany )SetLoanCompanyFromDictionary( parameters, loanTitleInsuranceCompany );
                    return loanTitleInsuranceCompany;
            }
            return null;
        }

        public BusinessContact GetAndPopulateBusinessContactModel( int contactType, int companyId, int contactId, Guid loanId )
        {
            switch ( ( ContactsTypeEnum )contactType )
            {
                case ContactsTypeEnum.CPA:
                    LoanCPACompany companyModel = _facade.LoadLoanCompany<LoanCPACompany>( contactType, companyId );
                    LoanCPAContact contactModel = _facade.LoadLoanContact<LoanCPAContact>( contactType, contactId );
                   
                    return PopulateBusinessContactFromLoanContact( companyModel, contactModel, loanId );;
                case ContactsTypeEnum.DocSigning:
                    LoanDocSigningCompany loanDocSigningCompany = _facade.LoadLoanCompany<LoanDocSigningCompany>( contactType, companyId );
                    LoanDocSigningContact loanDocSigningContact = _facade.LoadLoanContact<LoanDocSigningContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanDocSigningCompany, loanDocSigningContact, loanId );

                case ContactsTypeEnum.Employer:
                    LoanEmployerCompany loanEmployerCompany = _facade.LoadLoanCompany<LoanEmployerCompany>( contactType, companyId );
                    LoanEmployerContact loanEmployerContact = _facade.LoadLoanContact<LoanEmployerContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanEmployerCompany, loanEmployerContact, loanId );

                case ContactsTypeEnum.Escrow:
                    LoanEscrowCompany loanEscrowCompany = _facade.LoadLoanCompany<LoanEscrowCompany>( contactType, companyId );
                    LoanEscrowContact loanEscrowContact = _facade.LoadLoanContact<LoanEscrowContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanEscrowCompany, loanEscrowContact, loanId );
                case ContactsTypeEnum.FloodInsurance:
                    LoanFloodInsuranceCompany loanFloodInsuranceCompany = _facade.LoadLoanCompany<LoanFloodInsuranceCompany>( contactType, companyId );
                    LoanFloodInsuranceContact loanFloodInsuranceContact = _facade.LoadLoanContact<LoanFloodInsuranceContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanFloodInsuranceCompany, loanFloodInsuranceContact, loanId );
                case ContactsTypeEnum.HazardInsurance:
                    LoanHazardInsuranceCompany loanHazardInsuranceCompany = _facade.LoadLoanCompany<LoanHazardInsuranceCompany>( contactType, companyId );
                    LoanHazardInsuranceContact loanHazardInsuranceContact = _facade.LoadLoanContact<LoanHazardInsuranceContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanHazardInsuranceCompany, loanHazardInsuranceContact, loanId );
                case ContactsTypeEnum.HomeWarranty:
                    LoanHomeWarrantyCompany loanHomeWarrantyCompany = _facade.LoadLoanCompany<LoanHomeWarrantyCompany>( contactType, companyId );
                    LoanHomeWarrantyContact loanHomeWarrantyContact = _facade.LoadLoanContact<LoanHomeWarrantyContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanHomeWarrantyCompany, loanHomeWarrantyContact, loanId );
                case ContactsTypeEnum.MortgageInsurance:
                    LoanMortgageInsuranceCompany loanMortgageInsuranceCompany = _facade.LoadLoanCompany<LoanMortgageInsuranceCompany>( contactType, companyId );
                    LoanMortgageInsuranceContact loanMortgageInsuranceContact = _facade.LoadLoanContact<LoanMortgageInsuranceContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanMortgageInsuranceCompany, loanMortgageInsuranceContact, loanId );
                case ContactsTypeEnum.PropertyManagement:
                    LoanPropertyManagementCompany loanPropertyManagementCompany = _facade.LoadLoanCompany<LoanPropertyManagementCompany>( contactType, companyId );
                    LoanPropertyManagementContact loanPropertyManagementContact = _facade.LoadLoanContact<LoanPropertyManagementContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanPropertyManagementCompany, loanPropertyManagementContact, loanId );
                case ContactsTypeEnum.Realtor:
                    LoanRealtorCompany loanRealtorCompany = _facade.LoadLoanCompany<LoanRealtorCompany>( contactType, companyId );
                    LoanRealtorContact loanRealtorContact = _facade.LoadLoanContact<LoanRealtorContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanRealtorCompany, loanRealtorContact, loanId );
                case ContactsTypeEnum.Survey:
                    LoanSurveyCompany loanSurveyCompany = _facade.LoadLoanCompany<LoanSurveyCompany>( contactType, companyId );
                    LoanSurveyContact loanSurveyContact = _facade.LoadLoanContact<LoanSurveyContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanSurveyCompany, loanSurveyContact, loanId );
                case ContactsTypeEnum.Termite:
                    LoanTermiteCompany loanTermiteCompany = _facade.LoadLoanCompany<LoanTermiteCompany>( contactType, companyId );
                    LoanTermiteContact loanTermiteContact = _facade.LoadLoanContact<LoanTermiteContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanTermiteCompany, loanTermiteContact, loanId );
                case ContactsTypeEnum.TitleInsurance:
                    LoanTitleInsuranceCompany loanTitleInsuranceCompany = _facade.LoadLoanCompany<LoanTitleInsuranceCompany>( contactType, companyId );
                    LoanTitleInsuranceContact loanTitleInsuranceContact = _facade.LoadLoanContact<LoanTitleInsuranceContact>( contactType, contactId );

                    return PopulateBusinessContactFromLoanContact( loanTitleInsuranceCompany, loanTitleInsuranceContact, loanId );
            }
            return null;
        }

        public int CheckIsDuplicateLoginLoanContact( LoanContact contact, int contactId )
        {
            return _facade.CheckIsDuplicateLoginLoanContact( contact, contactId );
        }

        public int CheckIsDuplicateLoginLoanCompany( LoanCompany company, int companyId )
        {
            return _facade.CheckIsDuplicateLoginLoanCompany( company, companyId );
        }


    }
}
