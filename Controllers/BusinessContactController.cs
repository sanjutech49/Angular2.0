using System;
using System.Collections.Generic;
using System.Web.Mvc;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Web.LoanCenter.Helpers.SystemAdmin;
using MML.Web.LoanCenter.Helpers.Utilities;
using System.Text.RegularExpressions;
using System.Web.Script.Services;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Contacts;
using Newtonsoft.Json;

namespace MML.Web.LoanCenter.Controllers
{

    public class BusinessContactController : Controller
    {
        [OutputCache( NoStore = true, Duration = 0, VaryByParam = "*" )]
        [CompressFilter]
        public ActionResult Index()
        {
            return View();
        }

        public void DeleteBusinessContact( Guid businessContactId )
        {
            try
            {
                if ( businessContactId != Guid.Empty )
                    BusinessContactServiceFacade.DeleteBusinessContact( businessContactId );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.Global, "Failed to delete bussines contact", exception, businessContactId, IdentityManager.GetUserAccountId() );
            }
        }

        [HttpPost]
        public ActionResult ValidateAndSaveBusinessContactNonSeller( String JSONParameters )/*String company, String contactFirstName, String contactLastName, String contactPreferredPhone,
            String contactPreferredPhoneType, String contactAlternatePhone, String contactAlternatePhoneType, String contactEmail, String streetAddress,
            String zipCode, String city, String stateId, String type, String loanId, String stateName, String operationType, String borrowerContactId, String referenceNumber*/ 
        {
            #region Helper Variables

            LoanCPACompany cpa = new LoanCPACompany();
            LoanDocSigningCompany docSigning = new LoanDocSigningCompany();
            LoanEmployerCompany employer = new LoanEmployerCompany();
            LoanEscrowCompany escrow = new LoanEscrowCompany();
            LoanFloodInsuranceCompany floodInsurance = new LoanFloodInsuranceCompany();
            LoanHazardInsuranceCompany hazardInsurance = new LoanHazardInsuranceCompany();
            LoanHomeWarrantyCompany homeWaranty = new LoanHomeWarrantyCompany();
            LoanMortgageInsuranceCompany mortgageInsurance = new LoanMortgageInsuranceCompany();
            LoanPropertyManagementCompany propertyManagement = new LoanPropertyManagementCompany();
            LoanRealtorCompany realtor = new LoanRealtorCompany();
            LoanSurveyCompany survey = new LoanSurveyCompany();
            LoanTermiteCompany termite = new LoanTermiteCompany();
            LoanTitleInsuranceCompany title = new LoanTitleInsuranceCompany();
            ContactsCompanyServiceFacade contactCompanyFacade = new ContactsCompanyServiceFacade();

            #endregion

            #region Deserialize JSON

            Dictionary<string, string> parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>( JSONParameters );

            #endregion

            #region Save Company

            ContactHelper contactHelper = new ContactHelper();
            var companyModel = contactHelper.GetCorrectCompanyModel( parameters );

            if ( companyModel is LoanCPACompany ) { cpa = contactCompanyFacade.SaveLoanContactsCompany<LoanCPACompany>( ( LoanCPACompany )companyModel ); }
            else if ( companyModel is LoanDocSigningCompany ) { docSigning = contactCompanyFacade.SaveLoanContactsCompany<LoanDocSigningCompany>( ( LoanDocSigningCompany )companyModel ); }
            else if ( companyModel is LoanEmployerCompany ) { employer = contactCompanyFacade.SaveLoanContactsCompany<LoanEmployerCompany>( ( LoanEmployerCompany )companyModel ); }
            else if ( companyModel is LoanEscrowCompany ) { escrow = contactCompanyFacade.SaveLoanContactsCompany<LoanEscrowCompany>( ( LoanEscrowCompany )companyModel ); }
            else if ( companyModel is LoanFloodInsuranceCompany ) { floodInsurance = contactCompanyFacade.SaveLoanContactsCompany<LoanFloodInsuranceCompany>( ( LoanFloodInsuranceCompany )companyModel ); }
            else if ( companyModel is LoanHazardInsuranceCompany ) { hazardInsurance = contactCompanyFacade.SaveLoanContactsCompany<LoanHazardInsuranceCompany>( ( LoanHazardInsuranceCompany )companyModel ); }
            else if ( companyModel is LoanHomeWarrantyCompany ) { homeWaranty = contactCompanyFacade.SaveLoanContactsCompany<LoanHomeWarrantyCompany>( ( LoanHomeWarrantyCompany )companyModel ); }
            else if ( companyModel is LoanMortgageInsuranceCompany ) { mortgageInsurance = contactCompanyFacade.SaveLoanContactsCompany<LoanMortgageInsuranceCompany>( ( LoanMortgageInsuranceCompany )companyModel ); }
            else if ( companyModel is LoanPropertyManagementCompany ) { propertyManagement = contactCompanyFacade.SaveLoanContactsCompany<LoanPropertyManagementCompany>( ( LoanPropertyManagementCompany )companyModel ); }
            else if ( companyModel is LoanRealtorCompany ) { realtor = contactCompanyFacade.SaveLoanContactsCompany<LoanRealtorCompany>( ( LoanRealtorCompany )companyModel ); }
            else if ( companyModel is LoanSurveyCompany ) { survey = contactCompanyFacade.SaveLoanContactsCompany<LoanSurveyCompany>( ( LoanSurveyCompany )companyModel ); }
            else if ( companyModel is LoanTermiteCompany ) { termite = contactCompanyFacade.SaveLoanContactsCompany<LoanTermiteCompany>( ( LoanTermiteCompany )companyModel ); }
            else if ( companyModel is LoanTitleInsuranceCompany ) { title = contactCompanyFacade.SaveLoanContactsCompany<LoanTitleInsuranceCompany>( ( LoanTitleInsuranceCompany )companyModel ); }


            #endregion

            #region Save Contact
            var contactModel = contactHelper.GetCorrectContactModel( parameters );

            if ( contactModel is LoanCPAContact )
            {
                ( ( LoanCPAContact )contactModel ).CompanyId = cpa.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanCPAContact>( ( LoanCPAContact )contactModel );
            }
            else if ( contactModel is LoanDocSigningContact )
            {
                ( ( LoanDocSigningContact )contactModel ).CompanyId = docSigning.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanDocSigningContact>( ( LoanDocSigningContact )contactModel );
            }
            else if ( contactModel is LoanEmployerContact )
            {
                ( ( LoanEmployerContact )contactModel ).CompanyId = employer.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanEmployerContact>( ( LoanEmployerContact )contactModel );
            }
            else if ( contactModel is LoanEscrowContact )
            {
                ( ( LoanEscrowContact )contactModel ).CompanyId = escrow.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanEscrowContact>( ( LoanEscrowContact )contactModel );
            }
            else if ( contactModel is LoanFloodInsuranceContact )
            {
                ( ( LoanFloodInsuranceContact )contactModel ).CompanyId = floodInsurance.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanFloodInsuranceContact>( ( LoanFloodInsuranceContact )contactModel );
            }
            else if ( contactModel is LoanHazardInsuranceContact )
            {
                ( ( LoanHazardInsuranceContact )contactModel ).CompanyId = hazardInsurance.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanHazardInsuranceContact>( ( LoanHazardInsuranceContact )contactModel );
            }
            else if ( contactModel is LoanHomeWarrantyContact )
            {
                ( ( LoanHomeWarrantyContact )contactModel ).CompanyId = homeWaranty.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanHomeWarrantyContact>( ( LoanHomeWarrantyContact )contactModel );
            }
            else if ( contactModel is LoanMortgageInsuranceContact )
            {
                ( ( LoanMortgageInsuranceContact )contactModel ).CompanyId = mortgageInsurance.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanMortgageInsuranceContact>( ( LoanMortgageInsuranceContact )contactModel );
            }
            else if ( contactModel is LoanPropertyManagementContact )
            {
                ( ( LoanPropertyManagementContact )contactModel ).CompanyId = propertyManagement.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanPropertyManagementContact>( ( LoanPropertyManagementContact )contactModel );
            }
            else if ( contactModel is LoanRealtorContact )
            {
                ( ( LoanRealtorContact )contactModel ).CompanyId = realtor.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanRealtorContact>( ( LoanRealtorContact )contactModel );
            }
            else if ( contactModel is LoanSurveyContact )
            {
                ( ( LoanSurveyContact )contactModel ).CompanyId = survey.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanSurveyContact>( ( LoanSurveyContact )contactModel );
            }
            else if ( contactModel is LoanTermiteContact )
            {
                ( ( LoanTermiteContact )contactModel ).CompanyId = termite.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanTermiteContact>( ( LoanTermiteContact )contactModel );
            }
            else if ( contactModel is LoanTitleInsuranceContact )
            {
                ( ( LoanTitleInsuranceContact )contactModel ).CompanyId = title.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanTitleInsuranceContact>( ( LoanTitleInsuranceContact )contactModel );
            }

            #endregion

            #region OLD CODE
            
            //bool contactUpdated = false;

            //if ( String.IsNullOrWhiteSpace( referenceNumber ) )
            //{
            //    referenceNumber = null;
            //}
            //try
            //{
            //    // Seller information
            //    int contactPrefferePhoneTypeValue;
            //    int.TryParse( contactPreferredPhoneType, out contactPrefferePhoneTypeValue );
            //    int contactAlternatePhoneTypeValue;
            //    int.TryParse( contactAlternatePhoneType, out contactAlternatePhoneTypeValue );

            //    int businessContactCategoryNumber;
            //    int.TryParse( type, out businessContactCategoryNumber );
            //    BusinessContactCategory businessContactCategoryValue = ( BusinessContactCategory )businessContactCategoryNumber;

            //    Guid businessContactIdValue;
            //    Guid.TryParse( borrowerContactId, out businessContactIdValue );

            //    Seller seller = new Seller()
            //    {
            //        FirstNameSeller = contactFirstName,
            //        LastNameSeller = contactLastName,
            //        ContactPhonePreferredSeller = contactPreferredPhone,
            //        ContactPhonePreferredSellerType = ( PhoneNumberType )contactPrefferePhoneTypeValue,
            //        ContactPhoneAlternateSeller = contactAlternatePhone,
            //        ContactPhoneAlternateSellerType = ( PhoneNumberType )contactAlternatePhoneTypeValue,
            //        EmailSeller = contactEmail
            //    };

            //    // Address information
            //    int stateIdValue;
            //    int.TryParse( stateId, out stateIdValue );
            //    Address address = new Address()
            //    {
            //        StreetName = streetAddress,
            //        ZipCode = zipCode,
            //        CityName = city,
            //        StateId = stateIdValue,
            //        StateName = stateName
            //    };

            //    // Business contact information
            //    Guid loanIdValue;
            //    Guid.TryParse( loanId, out loanIdValue );
            //    BusinessContact businessContact = new BusinessContact()
            //    {
            //        BusinessContactId = businessContactIdValue,
            //        BusinessContactCategory = businessContactCategoryValue,
            //        Seller = seller,
            //        LoanId = loanIdValue,
            //        Address = address,
            //        CompanyName = company,
            //        FirstName = contactFirstName,
            //        LastName = contactLastName,
            //        Email = contactEmail,
            //        ReferenceNumber = referenceNumber
            //    };

            //    if ( company != String.Empty || ( contactFirstName != String.Empty && contactLastName != String.Empty ) || contactEmail != String.Empty )
            //    {
            //        // Service operation
            //        if ( operationType == "save" )
            //            contactUpdated = BusinessContactServiceFacade.InsertBusinessContactAppraisal( businessContact );

            //        else if ( operationType == "update" )
            //            BusinessContactServiceFacade.UpdateBusinessContactAppraisal( businessContact );
            //    }
            //}
            //catch ( Exception ex )
            //{
            //    TraceHelper.Error( TraceCategory.BusinessContact, "Failed to save business contact data for non seller.", ex );
            //}

            //Session[ SessionHelper.ShowContacts + loanId ] = "1";

            #endregion

            return Json( true );
        }


        [HttpPost]
        public ActionResult ValidateAndSaveBusinessContactDataBankLLC( String sellerType, String company, String contact, String contactPreferredPhone,
            String contactPreferredPhoneType, String contactAlternatePhone, String contactAlternatePhoneType, String contactEmail, String streetAddress,
            String zipCode, String city, String stateId, String type, String loanId, String stateName, String operationType, String borrowerContactId, String referenceNumber)
        {
            

            #region OLD CODE


            bool contactUpdated = false;

            if ( String.IsNullOrWhiteSpace( referenceNumber ) )
            {
                referenceNumber = null;
            }

            try
            {
                // Seller information
                int contactPrefferePhoneTypeValue;
                int.TryParse( contactPreferredPhoneType, out contactPrefferePhoneTypeValue );
                int contactAlternatePhoneTypeValue;
                int.TryParse( contactAlternatePhoneType, out contactAlternatePhoneTypeValue );

                int sellerTypeNumber;
                int.TryParse( sellerType, out sellerTypeNumber );
                SellerType sellerTypeValue = ( SellerType )sellerTypeNumber;

                int businessContactCategoryNumber;
                int.TryParse( type, out businessContactCategoryNumber );
                BusinessContactCategory businessContactCategoryValue = ( BusinessContactCategory )businessContactCategoryNumber;

                Guid businessContactIdValue;
                Guid.TryParse( borrowerContactId, out businessContactIdValue );

                Seller seller = new Seller()
                {
                    ContactPhonePreferredSeller = contactPreferredPhone,
                    ContactPhonePreferredSellerType = ( PhoneNumberType )contactPrefferePhoneTypeValue,
                    ContactPhoneAlternateSeller = contactAlternatePhone,
                    ContactPhoneAlternateSellerType = ( PhoneNumberType )contactAlternatePhoneTypeValue,
                    EmailSeller = contactEmail
                };

                // Address information
                int stateIdValue;
                int.TryParse( stateId, out stateIdValue );
                Address address = new Address()
                {
                    StreetName = streetAddress,
                    ZipCode = zipCode,
                    CityName = city,
                    StateId = stateIdValue,
                    StateName = stateName
                };

                // Business contact information
                Guid loanIdValue;
                Guid.TryParse( loanId, out loanIdValue );
                BusinessContact businessContact = new BusinessContact()
                {
                    BusinessContactId = businessContactIdValue,
                    BusinessContactCategory = businessContactCategoryValue,
                    SellerType = sellerTypeValue,
                    Seller = seller,
                    LoanId = loanIdValue,
                    Address = address,
                    CompanyName = company,
                    CompanyContactName = contact,
                    Email = contactEmail,
                    ReferenceNumber = referenceNumber
                };

                if ( company != String.Empty || contactEmail != String.Empty )
                {
                    // Contact updated
                    if ( operationType == "save" )
                        contactUpdated = BusinessContactServiceFacade.InsertBusinessContactAppraisal( businessContact );

                    else if ( operationType == "update" )
                        BusinessContactServiceFacade.UpdateBusinessContactAppraisal( businessContact );
                }
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.BusinessContact, "Failed to save business contact data Bank/LLC.", ex );
            }

            Session[ SessionHelper.ShowContacts + loanId ] = "1";

            #endregion
            return Json( true );
        }

        [HttpPost]
        public ActionResult ValidateAndSaveBusinessContactData( String sellerType, String seller1FirstName, String seller1LastName,
            String seller1PreferredPhone, String seller1PreferredPhoneType, String seller1AlternatePhone, String seller1AlternatePhoneType,
            String seller1Email, String seller2FirstName, String seller2LastName, String seller2PreferredPhone, String seller2PreferredPhoneType,
            String seller2AlternatePhone, String seller2AlternatePhoneType, String seller2Email,
            String streetAddress, String zipCode, String city, String stateName, String stateId, String type, String userAccountId, String loanId, String operationType, String borrowerContactId, String referenceNumberSeller1, String referenceNumberSeller2 )
        {
            int sellerTypeNumber;
            int.TryParse( sellerType, out sellerTypeNumber );
            SellerType sellerTypeValue = ( SellerType )sellerTypeNumber;

            int businessContactCategoryNumber;
            int.TryParse( type, out businessContactCategoryNumber );
            BusinessContactCategory businessContactCategoryValue = ( BusinessContactCategory )businessContactCategoryNumber;

            Guid businessContactIdValue;
            Guid.TryParse( borrowerContactId, out businessContactIdValue );

            if ( String.IsNullOrWhiteSpace( referenceNumberSeller1 ) )
            {
                referenceNumberSeller1 = null;
            }

            if ( String.IsNullOrWhiteSpace( referenceNumberSeller2 ) )
            {
                referenceNumberSeller2 = null;
            }

            bool contactUpdated = false;
            try
            {
                // Convert to DC
                int seller1PrefferePhoneTypeValue;
                int.TryParse( seller1PreferredPhoneType, out seller1PrefferePhoneTypeValue );
                int seller1AlternatePhoneTypeValue;
                int.TryParse( seller1AlternatePhoneType, out seller1AlternatePhoneTypeValue );
                int seller2PrefferePhoneTypeValue;
                int.TryParse( seller2PreferredPhoneType, out seller2PrefferePhoneTypeValue );
                int seller2AlternatePhoneTypeValue;
                int.TryParse( seller2AlternatePhoneType, out seller2AlternatePhoneTypeValue );
                Guid loanIdValue;
                Guid.TryParse( loanId, out  loanIdValue );

                Seller seller1 = new Seller()
                {
                    FirstNameSeller = seller1FirstName,
                    LastNameSeller = seller1LastName,
                    EmailSeller = seller1Email,
                    ContactPhonePreferredSeller = seller1PreferredPhone,
                    ContactPhonePreferredSellerType = ( PhoneNumberType )seller1PrefferePhoneTypeValue,
                    ContactPhoneAlternateSeller = seller1AlternatePhone,
                    ContactPhoneAlternateSellerType = ( PhoneNumberType )seller1AlternatePhoneTypeValue,
                    ReferenceNumberAlternateSeller = referenceNumberSeller1
                };

                Seller seller2 = new Seller()
                {
                    FirstNameSeller = seller2FirstName,
                    LastNameSeller = seller2LastName,
                    EmailSeller = seller2Email,
                    ContactPhonePreferredSeller = seller2PreferredPhone,
                    ContactPhonePreferredSellerType = ( PhoneNumberType )seller2PrefferePhoneTypeValue,
                    ContactPhoneAlternateSeller = seller2AlternatePhone,
                    ContactPhoneAlternateSellerType = ( PhoneNumberType )seller2AlternatePhoneTypeValue,
                    ReferenceNumberAlternateSeller = referenceNumberSeller2
                };

                int stateIdValue;
                int.TryParse( stateId, out stateIdValue );
                BusinessContact businessContactSeller = new BusinessContact()
                {
                    BusinessContactId = businessContactIdValue,
                    BusinessContactCategory = businessContactCategoryValue,
                    FirstName = seller1.FirstNameSeller,
                    LastName = seller1.LastNameSeller,
                    SellerType = sellerTypeValue,
                    Seller = ( ( seller1.FirstNameSeller != String.Empty && seller1.LastNameSeller != String.Empty ) || seller1.EmailSeller != String.Empty ) ? seller1 : null,
                    SellerAlt = ( ( seller2.FirstNameSeller != String.Empty && seller2.LastNameSeller != String.Empty ) || seller2.EmailSeller != String.Empty ) ? seller2 : null,
                    Email = seller1Email,
                    LoanId = loanIdValue,
                    ReferenceNumber = referenceNumberSeller1,
                    Address = new Address()
                    {
                        StreetName = streetAddress,
                        ZipCode = zipCode,
                        CityName = city,
                        StateId = stateIdValue,
                        StateName = stateName
                    }
                };

                // Call repository
                if ( operationType == "save" )
                {
                    if ( businessContactSeller.Seller != null )
                    {
                        contactUpdated = BusinessContactServiceFacade.InsertBusinessContactAppraisal( businessContactSeller );
                    }
                }
                else if ( operationType == "update" )
                {
                    if ( ( businessContactSeller.FirstName != String.Empty && businessContactSeller.LastName != String.Empty ) || businessContactSeller.Email != String.Empty )
                    {
                        BusinessContactServiceFacade.UpdateBusinessContactAppraisal( businessContactSeller );
                    }
                }
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.BusinessContact, "Failed to save business contact data.", ex );
            }

            Session[ SessionHelper.ShowContacts + loanId ] = "1";

            return Json( true );
        }

        public void SaveBusinessContact( BusinessContact businessContactInfo, bool isValid )
        {
            try
            {

                var contactId = businessContactInfo.BusinessContactId;

                Guid loanId = Guid.Empty;
                if ( Session[ SessionHelper.CurrentLoanIdForBusinessContact ] != null )
                    Guid.TryParse( Session[ SessionHelper.CurrentLoanIdForBusinessContact ].ToString(), out loanId );

                if ( loanId != Guid.Empty )
                {
                    if ( businessContactInfo.CompanyName != String.Empty || ( businessContactInfo.FirstName != String.Empty && businessContactInfo.LastName != String.Empty ) || businessContactInfo.Email != String.Empty )
                    {
                        if ( contactId.Equals( Guid.Empty ) )
                            BusinessContactServiceFacade.CreateBusinessContactByLoan( loanId, businessContactInfo );
                        else
                            BusinessContactServiceFacade.UpdateBusinessContact( businessContactInfo );
                    }
                }
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.Global, "Failed to delete bussines contact", exception, businessContactInfo.BusinessContactId, IdentityManager.GetUserAccountId() );
            }
        }

        public ActionResult GetBusinessContactInformation( Guid businessContactId )
        {
            var messageModel = new ErrorMessage();

            try
            {
                BusinessContact businessContact = BusinessContactServiceFacade.RetrieveBusinessContactAppraisal( businessContactId );

                var preferedPhoneNumber = String.Empty;
                var alternatePhoneNumber = String.Empty;
                int preferedPhoneNumberType = -1;
                int alternatePhoneNumberType = -1;

                foreach ( var businessContactPhoneNumber in businessContact.BusinessContactPhoneNumbers )
                {
                    if ( businessContactPhoneNumber.Preferred )
                    {
                        preferedPhoneNumber = businessContactPhoneNumber.Number;
                        preferedPhoneNumberType = (int) businessContactPhoneNumber.NumberType;
                    }

                    else
                    {
                        alternatePhoneNumber = businessContactPhoneNumber.Number;
                        alternatePhoneNumberType = (int) businessContactPhoneNumber.NumberType;
                    }

                }

                var phoneNumbers = businessContact.BusinessContactPhoneNumbers;


                JsonResult jsonData = Json( new
                {
                    Company = businessContact.CompanyName,
                    Contact = businessContact.CompanyContactName,
                    FirstName = businessContact.FirstName,
                    LastName = businessContact.LastName,
                    StreetAddress = businessContact.Address.StreetName ?? businessContact.CompanyAddress,
                    ZipCode = businessContact.Address.ZipCode,
                    City = businessContact.Address.CityName,
                    StateId = businessContact.Address.StateId - 1,               
                    PrefPhoneNumber = preferedPhoneNumber != String.Empty ? preferedPhoneNumber : businessContact.Seller.ContactPhonePreferredSeller,
                    PrefPhoneNumberType = preferedPhoneNumberType != -1 ? preferedPhoneNumberType : (int)businessContact.Seller.ContactPhonePreferredSellerType,
                    AltPhoneNumber = alternatePhoneNumber != String.Empty ? alternatePhoneNumber : businessContact.Seller.ContactPhoneAlternateSeller,
                    AltPhoneNumberType= alternatePhoneNumberType != -1 ? alternatePhoneNumberType : (int)businessContact.Seller.ContactPhoneAlternateSellerType,
                    Email = businessContact.Email ?? businessContact.CompanyEmail,
                    ReferenceNumber = businessContact.ReferenceNumber,
                    //data for second seller
                    FirstNameAltSeller = businessContact.SellerAlt.FirstNameSeller,
                    LastNameAltSeller = businessContact.SellerAlt.LastNameSeller,
                    PrefPhoneNumberAltSeller = businessContact.SellerAlt.ContactPhonePreferredSeller,
                    PrefPhoneNumberTypeAltSeller = ( int )businessContact.SellerAlt.ContactPhonePreferredSellerType,
                    AltPhoneNumberAltSeller = businessContact.SellerAlt.ContactPhoneAlternateSeller,
                    AltPhoneNumberTypeAltSeller = ( int )businessContact.SellerAlt.ContactPhoneAlternateSellerType,
                    EmailAltSeller = businessContact.SellerAlt.EmailSeller,
                    ReferenceNumberAlterSeler = businessContact.SellerAlt.ReferenceNumberAlternateSeller

                }, JsonRequestBehavior.AllowGet );

                return jsonData;
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.BusinessContact, "Failed to retrieve business contact information", exception );
                messageModel.Message = "Failed to retrieve business contact information";
                messageModel.Title = "Failed to retrieve business contact information";

                return PartialView( "Message/_customMessage", messageModel );
            }
        }
        #region Save Loan Contacts
        /*
        private object GetCorrectCompanyModel( Dictionary<string, string> parameters )
        {
            switch ( ( ContactsTypeEnum )Int32.Parse(parameters["CompanyType"].ToString()) )
            {
                case ContactsTypeEnum.CPA:
                    return new LoanCPACompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.DocSigning:
                    return new LoanDocSigningCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.Employer:
                    return new LoanEmployerCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.Escrow:
                    return new LoanEscrowCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.FloodInsurance:
                    return new LoanFloodInsuranceCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.HazardInsurance:
                    return new LoanHazardInsuranceCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.HomeWarranty:
                    return new LoanHomeWarrantyCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.MortgageInsurance:
                    return new LoanMortgageInsuranceCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.PropertyManagement:
                    return new LoanPropertyManagementCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.Realtor:
                    return new LoanRealtorCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )                        
                    };
                case ContactsTypeEnum.Survey:
                    return new LoanSurveyCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.Termite:
                    return new LoanTermiteCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
                case ContactsTypeEnum.TitleInsurance:
                    return new LoanTitleInsuranceCompany()
                    {
                        ContactType = Int32.Parse( parameters[ "CompanyType" ].ToString() ),
                        CompanyName = parameters[ "CompanyName" ].ToString(),
                        StreetAddress = parameters[ "StreetAddress" ].ToString(),
                        Zip = parameters[ "Zip" ].ToString(),
                        City = parameters[ "City" ].ToString(),
                        StateId = Int32.Parse( parameters[ "StateId" ].ToString() )
                    };
            }
            return null;
        }


        private object GetCorrectContactModel( Dictionary<string, string> parameters )
        {
            switch ( ( ContactsTypeEnum )Int32.Parse( parameters[ "CompanyType" ].ToString() ) )
            {
                case ContactsTypeEnum.CPA:
                    return new LoanCPAContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.DocSigning:
                    return new LoanDocSigningContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.Employer:
                    return new LoanEmployerContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.Escrow:
                    return new LoanEscrowContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.FloodInsurance:
                    return new LoanFloodInsuranceContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.HazardInsurance:
                    return new LoanHazardInsuranceContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.HomeWarranty:
                    return new LoanHomeWarrantyContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.MortgageInsurance:
                    return new LoanMortgageInsuranceContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.PropertyManagement:
                    return new LoanPropertyManagementContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                       AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.Realtor:
                    return new LoanRealtorContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() ),
                        SubType = Int32.Parse( parameters[ "RealtorSubType" ].ToString() )
                        
                    };
                case ContactsTypeEnum.Survey:
                    return new LoanSurveyContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.Termite:
                    return new LoanTermiteContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
                case ContactsTypeEnum.TitleInsurance:
                    return new LoanTitleInsuranceContact()
                    {
                        FirstName = parameters[ "FirstName" ].ToString(),
                        LastName = parameters[ "LastName" ].ToString(),
                        PhoneNumber = parameters[ "PreferredPhone" ].ToString(),
                        AlternatePhoneNumber = parameters["AlternatePhone"].ToString(),
                        Email = parameters[ "Email" ].ToString(),
                        ReferenceNumber = parameters[ "ReferenceNumber" ].ToString(),
                        PhoneNumberType = Int32.Parse( parameters[ "PreferredPhoneType" ].ToString() ),
                        AlternatePhoneNumberType = Int32.Parse( parameters[ "AlternatePhoneType" ].ToString() )
                    };
            }
            return null;
        }*/
        #endregion    


        [HttpPost]
        public ActionResult AddGlobalContactToLoanContact( String JSONParameters )
        {
            Dictionary<string, string> parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>( JSONParameters );

            int _contactType;
            Int32.TryParse( parameters[ "contactType" ].ToString(), out _contactType );
            int _companyId;
            Int32.TryParse( parameters[ "companyId" ].ToString(), out _companyId );
            int _contactId;
            Int32.TryParse( parameters[ "contactId" ].ToString(), out _contactId );
            Guid _loanId;
            Guid.TryParse( parameters[ "loanId" ].ToString(), out _loanId );
            Int32.TryParse( parameters[ "contactId" ].ToString(), out _contactId );
            int _subType;
            Int32.TryParse( parameters[ "subType" ].ToString(), out _subType );

            if ( SystemAdminContactTypesEnum.Realtor == ( SystemAdminContactTypesEnum )_contactType && String.IsNullOrEmpty( parameters[ "subType" ] ) )
            {
                return Json( new { openView = true, isDuplicate = false, JsonRequestBehavior.AllowGet } );
            }

            LoanCPACompany cpa = new LoanCPACompany();
            LoanDocSigningCompany docSigning = new LoanDocSigningCompany();
            LoanEmployerCompany employer = new LoanEmployerCompany();
            LoanEscrowCompany escrow = new LoanEscrowCompany();
            LoanFloodInsuranceCompany floodInsurance = new LoanFloodInsuranceCompany();
            LoanHazardInsuranceCompany hazardInsurance = new LoanHazardInsuranceCompany();
            LoanHomeWarrantyCompany homeWaranty = new LoanHomeWarrantyCompany();
            LoanMortgageInsuranceCompany mortgageInsurance = new LoanMortgageInsuranceCompany();
            LoanPropertyManagementCompany propertyManagement = new LoanPropertyManagementCompany();
            LoanRealtorCompany realtor = new LoanRealtorCompany();
            LoanSurveyCompany survey = new LoanSurveyCompany();
            LoanTermiteCompany termite = new LoanTermiteCompany();
            LoanTitleInsuranceCompany title = new LoanTitleInsuranceCompany();

            ContactsCompanyServiceFacade contactCompanyFacade = new ContactsCompanyServiceFacade();
            
            ContactHelper contactHelper = new ContactHelper();

            var companyModel = contactHelper.CopyGlobalCompanyToLoanCompany( _contactType, _companyId, _loanId );
            var contactModel = contactHelper.CopyGlobalContactToLoanContact( _contactType, _contactId, _loanId );
    
            LoanCompany lcom = JsonConvert.DeserializeObject<LoanCompany>( JsonConvert.SerializeObject( companyModel ) );

            LoanContact lcon = JsonConvert.DeserializeObject<LoanContact>( JsonConvert.SerializeObject( contactModel ) );


            int duplicateCompanyId = contactHelper.CheckIsDuplicateLoginLoanCompany( lcom, 0 );
            lcon.CompanyId = duplicateCompanyId;
            int duplicateContactId = contactHelper.CheckIsDuplicateLoginLoanContact( lcon, 0 );

            if (duplicateContactId != 0)
            {
                return Json(new { openView = false, isDuplicate = true, JsonRequestBehavior.AllowGet });
            }

            if ( duplicateCompanyId == 0 )
            {
                    if ( companyModel is LoanCPACompany ) { cpa = contactCompanyFacade.SaveLoanContactsCompany<LoanCPACompany>( ( LoanCPACompany )companyModel ); }
                    else if ( companyModel is LoanDocSigningCompany ) { docSigning = contactCompanyFacade.SaveLoanContactsCompany<LoanDocSigningCompany>( ( LoanDocSigningCompany )companyModel ); }
                    else if ( companyModel is LoanEmployerCompany ) { employer = contactCompanyFacade.SaveLoanContactsCompany<LoanEmployerCompany>( ( LoanEmployerCompany )companyModel ); }
                    else if ( companyModel is LoanEscrowCompany ) { escrow = contactCompanyFacade.SaveLoanContactsCompany<LoanEscrowCompany>( ( LoanEscrowCompany )companyModel ); }
                    else if ( companyModel is LoanFloodInsuranceCompany ) { floodInsurance = contactCompanyFacade.SaveLoanContactsCompany<LoanFloodInsuranceCompany>( ( LoanFloodInsuranceCompany )companyModel ); }
                    else if ( companyModel is LoanHazardInsuranceCompany ) { hazardInsurance = contactCompanyFacade.SaveLoanContactsCompany<LoanHazardInsuranceCompany>( ( LoanHazardInsuranceCompany )companyModel ); }
                    else if ( companyModel is LoanHomeWarrantyCompany ) { homeWaranty = contactCompanyFacade.SaveLoanContactsCompany<LoanHomeWarrantyCompany>( ( LoanHomeWarrantyCompany )companyModel ); }
                    else if ( companyModel is LoanMortgageInsuranceCompany ) { mortgageInsurance = contactCompanyFacade.SaveLoanContactsCompany<LoanMortgageInsuranceCompany>( ( LoanMortgageInsuranceCompany )companyModel ); }
                    else if ( companyModel is LoanPropertyManagementCompany ) { propertyManagement = contactCompanyFacade.SaveLoanContactsCompany<LoanPropertyManagementCompany>( ( LoanPropertyManagementCompany )companyModel ); }
                    else if ( companyModel is LoanRealtorCompany ) { realtor = contactCompanyFacade.SaveLoanContactsCompany<LoanRealtorCompany>( ( LoanRealtorCompany )companyModel ); }
                    else if ( companyModel is LoanSurveyCompany ) { survey = contactCompanyFacade.SaveLoanContactsCompany<LoanSurveyCompany>( ( LoanSurveyCompany )companyModel ); }
                    else if ( companyModel is LoanTermiteCompany ) { termite = contactCompanyFacade.SaveLoanContactsCompany<LoanTermiteCompany>( ( LoanTermiteCompany )companyModel ); }
                    else if ( companyModel is LoanTitleInsuranceCompany ) { title = contactCompanyFacade.SaveLoanContactsCompany<LoanTitleInsuranceCompany>( ( LoanTitleInsuranceCompany )companyModel ); }
            }


            if ( contactModel is LoanCPAContact )
            {
                ( ( LoanCPAContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : cpa.CompanyId ;
                contactCompanyFacade.SaveLoanContactsContact<LoanCPAContact>( ( LoanCPAContact )contactModel );
            }
            else if ( contactModel is LoanDocSigningContact )
            {
                ( ( LoanDocSigningContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : docSigning.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanDocSigningContact>( ( LoanDocSigningContact )contactModel );
            }
            else if ( contactModel is LoanEmployerContact )
            {
                ( ( LoanEmployerContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : employer.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanEmployerContact>( ( LoanEmployerContact )contactModel );
            }
            else if ( contactModel is LoanEscrowContact )
            {
                ( ( LoanEscrowContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : escrow.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanEscrowContact>( ( LoanEscrowContact )contactModel );
            }
            else if ( contactModel is LoanFloodInsuranceContact )
            {
                ( ( LoanFloodInsuranceContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : floodInsurance.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanFloodInsuranceContact>( ( LoanFloodInsuranceContact )contactModel );
            }
            else if ( contactModel is LoanHazardInsuranceContact )
            {
                ( ( LoanHazardInsuranceContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : hazardInsurance.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanHazardInsuranceContact>( ( LoanHazardInsuranceContact )contactModel );
            }
            else if ( contactModel is LoanHomeWarrantyContact )
            {
                ( ( LoanHomeWarrantyContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : homeWaranty.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanHomeWarrantyContact>( ( LoanHomeWarrantyContact )contactModel );
            }
            else if ( contactModel is LoanMortgageInsuranceContact )
            {
                ( ( LoanMortgageInsuranceContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : mortgageInsurance.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanMortgageInsuranceContact>( ( LoanMortgageInsuranceContact )contactModel );
            }
            else if ( contactModel is LoanPropertyManagementContact )
            {
                ( ( LoanPropertyManagementContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : propertyManagement.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanPropertyManagementContact>( ( LoanPropertyManagementContact )contactModel );
            }
            else if ( contactModel is LoanRealtorContact )
            {
                ( ( LoanRealtorContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : realtor.CompanyId;
                ( ( LoanRealtorContact )contactModel ).SubType = _subType;
                contactCompanyFacade.SaveLoanContactsContact<LoanRealtorContact>( ( LoanRealtorContact )contactModel );
            }
            else if ( contactModel is LoanSurveyContact )
            {
                ( ( LoanSurveyContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : survey.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanSurveyContact>( ( LoanSurveyContact )contactModel );
            }
            else if ( contactModel is LoanTermiteContact )
            {
                ( ( LoanTermiteContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : termite.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanTermiteContact>( ( LoanTermiteContact )contactModel );
            }
            else if ( contactModel is LoanTitleInsuranceContact )
            {
                ( ( LoanTitleInsuranceContact )contactModel ).CompanyId = duplicateCompanyId != 0 ? duplicateCompanyId : title.CompanyId;
                contactCompanyFacade.SaveLoanContactsContact<LoanTitleInsuranceContact>( ( LoanTitleInsuranceContact )contactModel );
            }

            return Json( new { openView = false, isDuplicate = false, JsonRequestBehavior.AllowGet } );
             
         }

        public JsonResult CheckIsDuplicateLoginLoanCompanyAndContact( String JSONParameters )
        {

            try
            {

                Dictionary<string, string> parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>( JSONParameters );
                ContactHelper helper = new ContactHelper();
                LoanCompany company = new LoanCompany();
                company = helper.SetLoanCompanyFromDictionary( parameters, company );

                LoanContact contact = new LoanContact();
                contact = helper.SetLoanContactFromDictionary( parameters, contact );

                int loanContactsCompanyId;
                Int32.TryParse( parameters[ "LoanContactsCompanyId" ].ToString(), out loanContactsCompanyId );


                int loanContactsContactId;
                Int32.TryParse( parameters[ "LoanContactsContactId" ].ToString(), out loanContactsContactId );

                if ( (company == null || company.ContactType < 0 || string.IsNullOrEmpty( company.CompanyName ) || string.IsNullOrEmpty( company.StreetAddress )
                    || string.IsNullOrEmpty( company.City ) || company.StateId < 1 || string.IsNullOrEmpty( company.Zip ) ) && 
                    (contact == null || string.IsNullOrEmpty( contact.FirstName ) || string.IsNullOrEmpty( contact.LastName ) || string.IsNullOrEmpty( contact.Email )
                    || string.IsNullOrEmpty( contact.PhoneNumber )) )
                {
                    throw new ArgumentNullException( "ContactType, CompanyName, StreetAddress, City, StateId and Zip are required!" );
                }

                int duplicateCompanyId = helper.CheckIsDuplicateLoginLoanCompany( company, loanContactsCompanyId );
                contact.CompanyId = duplicateCompanyId;
                int duplicateContactId = helper.CheckIsDuplicateLoginLoanContact( contact, loanContactsContactId );

                return Json( new { success = true, isDuplicateCompany = duplicateCompanyId, isDuplicateContact = duplicateContactId } );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "_contacts.cshtml::CheckIsDuplicateLoginLoanCompanyAndContact", exception, Guid.Empty, IdentityManager.GetUserAccountId() );
                return Json( new { success = false } );
            }

        }

        public ActionResult GetContacts( string parametersJSON = null, bool isSystemAdminView = true )
        {

            Dictionary<string, string> parameters = null;
            if ( parametersJSON != null )
                parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>( parametersJSON );

            var contactsAndUsersModel = ContactHelper.GetLoanCompaniesAndContacts( HttpContext, parameters );

            return PartialView( "~/Views/Shared/_loanDetailsAndContactsInfoOtherSearchResult.cshtml", contactsAndUsersModel );

          

        }

    }
}
