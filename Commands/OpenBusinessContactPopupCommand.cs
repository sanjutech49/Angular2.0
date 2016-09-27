using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Contacts;
using MML.Web.Facade;
using MML.Contracts;
using MML.Common;
using MML.Common.Helpers;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Web.LoanCenter.Helpers.SystemAdmin;

namespace MML.Web.LoanCenter.Commands
{

    public class OpenBusinessContactPopupCommand : CommandsBase
    {
        public override void Execute()
        {
            base.Execute();

            try
            {
                var contactId = Guid.Empty;
                if ( InputParameters.ContainsKey( "ContactId" ) )
                    Guid.TryParse( InputParameters[ "ContactId" ].ToString().TrimEnd(), out contactId );

                String loanType = String.Empty;
                if ( InputParameters.ContainsKey( "LoanType" ) )
                    loanType = InputParameters[ "LoanType" ].ToString();

                int lCContactType = -1;
                if ( InputParameters.ContainsKey( "LCContactType" ) )
                    Int32.TryParse( InputParameters[ "LCContactType" ].ToString(), out lCContactType );

                int lCCompanyId = 0;
                if ( InputParameters.ContainsKey( "LCCompanyId" ) )
                    Int32.TryParse( InputParameters[ "LCCompanyId" ].ToString(), out lCCompanyId );

                int lCContactId = 0;
                if ( InputParameters.ContainsKey( "LCContactId" ) )
                    Int32.TryParse( InputParameters[ "LCContactId" ].ToString(), out lCContactId );

                Boolean isGlobalContact = false;
                if ( InputParameters.ContainsKey( "IsGlobalContact" ) )
                    isGlobalContact = bool.Parse( InputParameters[ "IsGlobalContact" ].ToString() );

                var loanId = Guid.Empty;
                if ( InputParameters.ContainsKey( "LoanId" ) )
                    Guid.TryParse( InputParameters[ "LoanId" ].ToString().TrimEnd(), out loanId );

                UserAccount user = null;
                if ( HttpContext.Session[ "UserData" ] != null )
                    user = ( UserAccount )HttpContext.Session[ "UserData" ];
                else
                {
                    user = UserAccountServiceFacade.GetUserByName( HttpContext.User.Identity.Name );
                    HttpContext.Session[ "UserData" ] = user;
                }

                if ( user == null )
                    throw new InvalidOperationException( "User is null" );

                var bussinesContactViewModel = new MML.Web.LoanCenter.ViewModels.BusinessContactInfoViewModel();
                BusinessContact businessContact = null;
                /*
                if ( contactId != Guid.Empty )
                    //businessContact = BusinessContactServiceFacade.RetrieveBusinessContact( contactId );
                    businessContact = BusinessContactServiceFacade.RetrieveBusinessContactAppraisal( contactId );
                */
                ContactHelper contactHelper = new ContactHelper();
                
                if ( isGlobalContact )
                {
                    var companyModel = contactHelper.CopyGlobalCompanyToLoanCompany( lCContactType, lCCompanyId, loanId );
                    var contactModel = contactHelper.CopyGlobalContactToLoanContact( lCContactType, lCContactId, loanId );

                    LoanRealtorCompany realtor = ( LoanRealtorCompany )companyModel;
                    LoanRealtorContact realtorContact = ( LoanRealtorContact )contactModel;
                    businessContact = contactHelper.PopulateBusinessContactFromLoanContact( realtor, realtorContact, loanId );

                }
                else if ( lCCompanyId != 0 && lCContactId != 0 )
                {

                    businessContact = contactHelper.GetAndPopulateBusinessContactModel( lCContactType, lCCompanyId, lCContactId, loanId );
                }

                if ( businessContact == null )
                {
                    businessContact = new BusinessContact();
                    businessContact.LoanContactsContactType = -1;
                    businessContact.LoanContactsContactSubType = 0;
                }

                if ( businessContact.Seller == null )                
                    businessContact.Seller = new Seller();

                if ( businessContact.SellerAlt == null )
                    businessContact.SellerAlt = new Seller();

                if ( businessContact.Address == null )
                    businessContact.Address = new Address();

                bussinesContactViewModel.BusinessContact = businessContact;
                if ( businessContact != null )
                {
                    bussinesContactViewModel.BusinessContact.BusinessContactId = contactId;
                }

                bussinesContactViewModel.UserAccountId = user.UserAccountId;
                //if ( loanType == LoanTransactionType.Purchase.GetStringValue() )
                //{
                //    bussinesContactViewModel.ContactBusinessTypes = LookupServiceFacade.Lookup( LookupKeywords.BusinessContactPurchase, bussinesContactViewModel.UserAccountId );
                //}
                //else
                //{
                //    bussinesContactViewModel.ContactBusinessTypes = LookupServiceFacade.Lookup( LookupKeywords.BusinessContactRefinance, bussinesContactViewModel.UserAccountId );
                //}



                //var lookupCollection = new LookupCollection();

                //var lookupList = bussinesContactViewModel.ContactBusinessTypes.ToList().OrderBy( c => c.Name );
                //foreach ( Lookup lookup in lookupList )
                //    lookupCollection.Add( lookup );

                //bussinesContactViewModel.ContactBusinessTypes = lookupCollection;
              
                bussinesContactViewModel.PhoneTypes = LookupServiceFacade.Lookup( LookupKeywords.PhoneType, bussinesContactViewModel.UserAccountId );
                bussinesContactViewModel.States = LookupServiceFacade.Lookup( LookupKeywords.States, bussinesContactViewModel.UserAccountId );
                if ( bussinesContactViewModel.States != null && bussinesContactViewModel.States.SingleOrDefault( x => x.Value == -1 ) == null )
                    bussinesContactViewModel.States.Insert( 0, new Lookup( -1, String.Empty ) );
                
                if ( lCCompanyId == 0 && lCContactId == 0 )
                    bussinesContactViewModel.BusinessContact.CompanyContactsType = -1;

                ViewName = "_bussinescontactinfo";
                ViewData = bussinesContactViewModel;
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "There is some issues in method OpenBusinessContactPopupCommand.Execute(): " + ex.Message, ex );
                throw;
            }
        }

    }
}