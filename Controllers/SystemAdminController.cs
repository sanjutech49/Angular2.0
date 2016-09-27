using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Web.LoanCenter.Helpers.SystemAdmin;
using MML.Web.LoanCenter.Helpers.Utilities;
using Newtonsoft.Json;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Contacts;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using MML.iMP.Common.Configuration;
using MML.Web.LoanCenter.Classes;

namespace MML.Web.LoanCenter.Controllers
{

    public class SystemAdminController : Controller
    {
        //DU
        private const string ENVIRONMENT = "Environment";
        private const string KEY_PDFSERVICEURI = "PdfServiceUri";

        private const string DU_KEY_SERVICEENDPOINT = "DUServiceEndPoint";
        private const string DU_KEY_LOGIN = "DUServiceLogin";
        private const string DU_KEY_PASSWORD = "DUServicePassword";
        private const string DU_KEY_DOCUMENTCATEGORY = "AUSFindingsDocumentCategory";
        private const string DU_KEY_CREDITAGENCYNAME = "DUCreditAgencyName";
        private const string DU_KEY_CREDITAGENCYACCOUNT = "DUCreditAccount";
        private const string DU_KEY_CREDITAGENCYPASSWORD = "DUCreditPassword";

        //LP
        private const string LP_KEY_SERVICEENDPOINT = "LPServiceEndPoint";
        private const string LP_KEY_LOGIN = "LPServiceUser";
        private const string LP_KEY_PASSWORD = "LPServicePassword";
        private const string LP_KEY_DOCUMENTCATEGORY = "AUSFindingsDocumentCategory";
        private const string LP_KEY_CREDITAGENCYNAME = "LPCreditAgencyName";

        //
        // GET: /SystemAdmin/
        private string html = string.Empty;

        private ContactsCompanyServiceFacade _facade = new ContactsCompanyServiceFacade();

        private List<ScrubItem> ScrubItems
        {
            get
            {
                var lookupItems = MML.Web.Facade.LookupServiceFacade.Lookup("CreditReport-ScrubItems", IdentityManager.GetUserAccountId()).ToList();

                var scrubItems = new List<ScrubItem>();
                foreach (var lookupItem in lookupItems)
                {
                    scrubItems.Add(new ScrubItem(lookupItem.Name, lookupItem.StringValue));
                }

                return scrubItems;
            }
        }

        public ActionResult Index( string pn, string cntrl )
        {
            if ( !User.Identity.IsAuthenticated )
                return RedirectToAction( "SignOut", "Home" );

            if ( !AccountHelper.HasPrivilege( PrivilegeName.ViewSystemAdmin ) )
                return Redirect( ConfigurationManager.AppSettings[ "LoanCenterStartPage" ].ToString() );

            if ( !string.IsNullOrWhiteSpace( pn ) && !string.IsNullOrWhiteSpace( cntrl ) )
            {
                Session[ SessionHelper.DisplaySystemAdmin ] = true;
                Session[ SessionHelper.CurrentSystemAdminPage ] = pn;
                Session[ SessionHelper.CurrentSystemAdminController ] = cntrl;
                Session[SessionHelper.SystemAdminLookupStates] = GetStatesLookupCollection();

                ViewBag.Title = "System Admin";
            
                return RedirectToAction( "Index" );       
            }
            else
            {
                return View("~/Views/Shared/SystemAdmin/_SystemAdmin.cshtml");
            }
        }

        public ActionResult GetActionResultForActionAndController(string pn, string cntrl)
        {
            Session[ SessionHelper.CurrentSystemAdminPage ] = pn;
            Session[ SessionHelper.CurrentSystemAdminController ] = cntrl;

            return PartialView( "~/Views/Shared/SystemAdmin/_SystemAdminPartialViewContainer.cshtml" );
        }
        public ActionResult GetMenu()
        {
            var userAccount = IdentityManager.GetUserAccountId();
            var companyId = new Guid();

            UserAccount currentUser = UserAccountServiceFacade.GetUserById( userAccount );

            if ( currentUser != null )
            {
                BrandingConfiguration brandingConfiguration = CompanyProfileServiceFacade.RetrieveBrandingConfigurationByHierarchy( new BrandingConfigurationHierarchy()
                {
                    BranchId = currentUser.BranchId,
                    ChannelId = currentUser.ChannelId,
                    DivisionId = currentUser.DivisionId
                    //CompanyProfileId = null
                } );


                companyId = brandingConfiguration != null && brandingConfiguration.CompanyProfileId != null ? ( Guid )( brandingConfiguration.CompanyProfileId ) : new Guid();

            }

            List<Navigation> menuItems = NavigationServiceFacade.GetNavigationItems( companyId, currentUser.UserAccountId, "SystemAdmin" ).ToList<Navigation>();
            menuItems = menuItems.OrderBy( x => x.Position ).ToList();

            return Content( RenderMenu( Guid.Empty, menuItems ) );
        }

        public ActionResult GetContacts( string parametersJSON = null, bool isSystemAdminView = true )
        {

            Dictionary<string, string> parameters = null;
            if ( parametersJSON != null )
                parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>( parametersJSON );

            var contactsAndUsersModel = ContactHelper.GetCompaniesAndContacts( HttpContext, parameters );

            if (parameters != null)
            {
                SetExpandableParents(contactsAndUsersModel, parameters);
            }

            if ( !isSystemAdminView )
                return PartialView( "~/Views/Shared/_loanDetailsAndContactsInfoSearchResult.cshtml", contactsAndUsersModel );

            return PartialView( "~/Views/Shared/SystemAdmin/Contacts/_contacts.cshtml", contactsAndUsersModel );

        }
        /// <summary>
        /// Set parents expandable fields to control which fields will be expanded after search
        /// </summary>
        /// <param name="contactsAndUsersModel"></param>
        /// <param name="parameters"></param>
        private void SetExpandableParents(SystemAdminContactsViewModel contactsAndUsersModel, Dictionary<string, string> parameters)
        {
            List<int> companyIds = new List<int>();
            List<CCompaniesAndContacts> children = contactsAndUsersModel.ContactCompaniesAndUsers.Where(m => m.ContactId != -1).ToList();

            foreach (var o in children)
            {
                if (
                    o.FirstName.ToLower().IndexOf(parameters["searchString"]) > -1 ||
                     o.LastName.ToLower().IndexOf(parameters["searchString"]) > -1 ||
                     o.CompanyName.ToLower().IndexOf(parameters["searchString"]) > -1 ||
                     o.Email.ToLower().IndexOf(parameters["searchString"]) > -1 ||
                     o.LicenceNumber.ToLower().IndexOf(parameters["searchString"]) > -1 ||
                     o.ContactLicenceNumber.ToLower().IndexOf(parameters["searchString"]) > -1
                         )
                {
                    companyIds.Add(o.CompanyId);
                }
            }

            foreach (var i in companyIds)
            {
                contactsAndUsersModel.ContactCompaniesAndUsers.Where(m => m.CompanyId == i && m.ContactId == -1).FirstOrDefault(c => c.IsExpandable = true);
            }
        }

        public Boolean DeleteLoanContact( String contactId )
        {
            int _contactId;
            Int32.TryParse( contactId, out _contactId );

            ContactsCompanyServiceFacade contactsCompanyFacade = new ContactsCompanyServiceFacade();

            Boolean deleteSuccessful = contactsCompanyFacade.DeleteLoanContact( _contactId );

            return deleteSuccessful;
        }

        public ActionResult DeleteContactCompany( string parametersJSON )
        {
            Dictionary<string, string> parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>( parametersJSON );

            int companyId = !String.IsNullOrEmpty( parameters[ "CompanyId" ].ToString() ) ? Int32.Parse( parameters[ "CompanyId" ].ToString() ) : -1;
            int contactId = !String.IsNullOrEmpty( parameters[ "ContactId" ].ToString() ) ? Int32.Parse( parameters[ "ContactId" ].ToString() ) : -1;
            int currentPage = !String.IsNullOrEmpty( parameters[ "CurrentPage" ].ToString() ) ? Int32.Parse( parameters[ "CurrentPage" ].ToString() ) : 1;
            ContactsCompanyServiceFacade contactsCompanyFacade = new ContactsCompanyServiceFacade();

            if ( contactId != -1 )
            {
                contactsCompanyFacade.DeleteContact( contactId );
            }
            else if ( companyId != -1 )
            {
                contactsCompanyFacade.DeleteCompany( companyId );
            }

            var contactsAndUsersModel = ContactHelper.GetCompaniesAndContacts( HttpContext, null, currentPage );

            return PartialView( "~/Views/Shared/SystemAdmin/Contacts/_contacts.cshtml", contactsAndUsersModel );
        }

        private String RenderMenu( Guid? parent, List<Navigation> menuItems )
        {
            List<Navigation> menuChildren = RetrieveChildren( parent, menuItems );

            if ( menuChildren.Count > 0 )
            {
                html += "<ul>";
                foreach ( Navigation item in menuChildren )
                {

                    if ( menuItems.Where( m => m.ParentId == item.NavigationId ).Count() > 0 )
                    {
                        html += "<li class=\"parentNav\" onclick=\"SystemAdminNavigation.CollapseExpandMenu(this)\">" + item.Name + "<div class=\"imp-aus-arrow-collapsed-div imp-loancenter-systemadmin-navigation-row\" style=\"\"></div></li>";
                    }
                    else
                    {
                        if ( item.NavigationGroup == ( int )SystemAdminEnum.SystemAdminLoanCenter )
                        {
                            string[] controllerAndAction = item.UrlAction.Split('/');
                            if ( controllerAndAction.Count() > 0 && !string.IsNullOrWhiteSpace( controllerAndAction[ 0 ] ) )
                            {
                                if ( item.Url.Contains( Session[ SessionHelper.CurrentSystemAdminPage ].ToString() ) )
                                {
                                    html += string.Format( "<li class=\"childNav selected\" onclick=\"SystemAdminNavigation.NavigateInsideLC(this, '{0}', '{1}')\">{2}</li>", controllerAndAction[ 1 ], controllerAndAction[ 0 ], item.Name );
                                }
                                else
                                {
                                    html += string.Format( "<li class=\"childNav\" onclick=\"SystemAdminNavigation.NavigateInsideLC(this, '{0}', '{1}')\">{2}</li>", controllerAndAction[ 1 ], controllerAndAction[ 0 ], item.Name );
                                }
                            }
                        }
                        else
                        {
                            html += string.Format("<li class=\"childNav\" onclick=\"SystemAdminNavigation.NavigateToConcierge('" + System.Configuration.ConfigurationManager.AppSettings[ "ConciergeUrl" ] + "" + item.Url + "')\">" + item.Name + "</li>");
                        }
                    }
                    RenderMenu( item.NavigationId, menuItems );
                }
                html += "</ul>";
            }

            return html;
        }

        private List<Navigation> RetrieveChildren( Guid? currentMenu, List<Navigation> menuList )
        {
            List<Navigation> childMenu = new List<Navigation>();

            foreach ( Navigation menu in menuList )
            {
                if ( menu.ParentId == currentMenu )
                {
                    childMenu.Add( menu );
                }
            }

            childMenu = childMenu.OrderBy( x => x.Position ).ToList();

            return childMenu;
        }


        public ActionResult GetCCompanyProfile( String companyId, String contactType )
        {
            int _companyId;
            Int32.TryParse( companyId, out _companyId );
            int _contactType;
            Int32.TryParse( contactType, out _contactType );

            var cp = new ContactsProfileViewModel();
            if ( _companyId != 0 )
            {
                cp = LoadCompanyObject( _contactType, _companyId, cp );
            }
            else
            {
                cp.cCompany = new CCompany();
                cp.cCompany.ContactType = -1;
                cp.cCompany.StateId = -1;
            }

            cp.States = GetStatesLookupCollection();

            return PartialView( "SystemAdmin/Company/cCompany", cp );
        }

        public ActionResult GetCContactProfile( String contactId, String companyId, String contactType )
        {
            int _contactId;
            Int32.TryParse( contactId, out _contactId );

            int _companyId;
            Int32.TryParse( companyId, out _companyId );

            int _contactType;
            Int32.TryParse( contactType, out _contactType );


            ContactsProfileViewModel cp = new ContactsProfileViewModel();
            cp = LoadCompanyObject( _contactType, _companyId, cp );
            if ( _contactId != 0 )
            {
                cp = LoadContactObject( _contactType, _contactId, cp );
            }
            else
            {
                cp.cContact = new CContact();
                cp.cContact.CompanyId = _companyId;
            }

            cp.States = new LookupCollection();
            cp.States = GetStatesLookupCollection();

            if ( !( cp.cContact != null && cp.cContact.ContactId != 0 ) && cp.cCompany != null )
            {
                cp = SetcContactTypeModel( cp, _contactType );
            }

            if ( _contactId == 0 )
            {
                cp = GetcContactNewLeadSourceId( cp, _contactType );
                cp.cContact.Deactivated = cp.cContact.IsDeactivatedByCompany = cp.cCompany.Deactivated;
            }

            return PartialView( "SystemAdmin/Contacts/cContact", cp );
        }

        [HttpPost]
        public ActionResult SaveCompanyProfile( ContactsProfileViewModel model, int currentPage )
        {
            SaveCompanyObject( model );

            //var contactsAndUsersModel = ContactHelper.GetCompaniesAndContacts( HttpContext, null, currentPage );

            //return PartialView( "~/Views/Shared/SystemAdmin/Contacts/_contacts.cshtml", contactsAndUsersModel );

            return Json( new { success = true } );
        }

        [HttpPost]
        public ActionResult SaveCompanyProfileContact( ContactsProfileViewModel model, string contactType, int currentPage )
        {
            int _contactType;
            Int32.TryParse( contactType, out _contactType );

            SaveContactObject( model, _contactType );

            //var contactsAndUsersModel = ContactHelper.GetCompaniesAndContacts( HttpContext, null, currentPage );

            //return PartialView( "~/Views/Shared/SystemAdmin/Contacts/_contacts.cshtml", contactsAndUsersModel );
            return Json( new { success = true } );
        }

        private ContactsProfileViewModel SaveCompanyObject( ContactsProfileViewModel model )
        {
            int contactType = model.cCompany.ContactType;
            int modifiedByUserAccountId = IdentityManager.GetUserAccountId();

            var previousCompany = new ContactsProfileViewModel();
            switch ( ( SystemAdminContactTypesEnum )model.cCompany.ContactType )
            {
                case SystemAdminContactTypesEnum.CPA:
                    previousCompany.cCPACompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CCPACompany>( contactType, model.cCompany.CompanyId ) : new CCPACompany();
                    previousCompany.cCPACompany.SetCCompanyContactType( model.cCPACompany, model.cCompany );
                    previousCompany.cCPACompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cCPACompany = _facade.SaveContactsCompany<CCPACompany>( previousCompany.cCPACompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.DocSigning:
                    previousCompany.cDocSigningCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CDocSigningCompany>( contactType, model.cCompany.CompanyId ) : new CDocSigningCompany();
                    previousCompany.cDocSigningCompany.SetCCompanyContactType( model.cDocSigningCompany, model.cCompany );
                    previousCompany.cDocSigningCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cDocSigningCompany = _facade.SaveContactsCompany<CDocSigningCompany>( previousCompany.cDocSigningCompany, contactType );
                    break;
                //case SystemAdminContactTypesEnum.Employer:
                //    previousCompany.cEmployerCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CEmployerCompany>( contactType, model.cCompany.CompanyId ) : new CEmployerCompany();
                //    previousCompany.cEmployerCompany.SetCCompanyContactType( model.cEmployerCompany, model.cCompany );
                //    previousCompany.cEmployerCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                //    model.cEmployerCompany = _facade.SaveContactsCompany<CEmployerCompany>( previousCompany.cEmployerCompany, contactType );
                //    break;
                case SystemAdminContactTypesEnum.Escrow:
                    previousCompany.cEscrowCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CEscrowCompany>( contactType, model.cCompany.CompanyId ) : new CEscrowCompany();
                    previousCompany.cEscrowCompany.SetCCompanyContactType( model.cEscrowCompany, model.cCompany );
                    previousCompany.cEscrowCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cEscrowCompany = _facade.SaveContactsCompany<CEscrowCompany>( previousCompany.cEscrowCompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.FloodInsurance:
                    previousCompany.cFloodInsuranceCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CFloodInsuranceCompany>( contactType, model.cCompany.CompanyId ) : new CFloodInsuranceCompany();
                    previousCompany.cFloodInsuranceCompany.SetCCompanyContactType( model.cFloodInsuranceCompany, model.cCompany );
                    previousCompany.cFloodInsuranceCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cFloodInsuranceCompany = _facade.SaveContactsCompany<CFloodInsuranceCompany>( previousCompany.cFloodInsuranceCompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.HazardInsurance:
                    previousCompany.cHazardInsuranceCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CHazardInsuranceCompany>( contactType, model.cCompany.CompanyId ) : new CHazardInsuranceCompany();
                    previousCompany.cHazardInsuranceCompany.SetCCompanyContactType( model.cHazardInsuranceCompany, model.cCompany );
                    previousCompany.cHazardInsuranceCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cHazardInsuranceCompany = _facade.SaveContactsCompany<CHazardInsuranceCompany>( previousCompany.cHazardInsuranceCompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.HomeWarranty:
                    previousCompany.cHomeWarrantyCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CHomeWarrantyCompany>( contactType, model.cCompany.CompanyId ) : new CHomeWarrantyCompany();
                    previousCompany.cHomeWarrantyCompany.SetCCompanyContactType( model.cHomeWarrantyCompany, model.cCompany );
                    previousCompany.cHomeWarrantyCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cHomeWarrantyCompany = _facade.SaveContactsCompany<CHomeWarrantyCompany>( previousCompany.cHomeWarrantyCompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.MortgageInsurance:
                    previousCompany.cMortgageInsuranceCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CMortgageInsuranceCompany>( contactType, model.cCompany.CompanyId ) : new CMortgageInsuranceCompany();
                    previousCompany.cMortgageInsuranceCompany.SetCCompanyContactType( model.cMortgageInsuranceCompany, model.cCompany );
                    previousCompany.cMortgageInsuranceCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cMortgageInsuranceCompany = _facade.SaveContactsCompany<CMortgageInsuranceCompany>( previousCompany.cMortgageInsuranceCompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.PropertyManagement:
                    previousCompany.cPropertyManagementCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CPropertyManagementCompany>( contactType, model.cCompany.CompanyId ) : new CPropertyManagementCompany();
                    previousCompany.cPropertyManagementCompany.SetCCompanyContactType( model.cPropertyManagementCompany, model.cCompany );
                    previousCompany.cPropertyManagementCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cPropertyManagementCompany = _facade.SaveContactsCompany<CPropertyManagementCompany>( previousCompany.cPropertyManagementCompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.Realtor:
                    previousCompany.cRealtorCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CRealtorCompany>( contactType, model.cCompany.CompanyId ) : new CRealtorCompany();
                    previousCompany.cRealtorCompany.SetCCompanyContactType( model.cRealtorCompany, model.cCompany );
                    previousCompany.cRealtorCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cRealtorCompany = _facade.SaveContactsCompany<CRealtorCompany>( previousCompany.cRealtorCompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.Survey:
                    previousCompany.cSurveyCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CSurveyCompany>( contactType, model.cCompany.CompanyId ) : new CSurveyCompany();
                    previousCompany.cSurveyCompany.SetCCompanyContactType( model.cSurveyCompany, model.cCompany );
                    previousCompany.cSurveyCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cSurveyCompany = _facade.SaveContactsCompany<CSurveyCompany>( previousCompany.cSurveyCompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.Termite:
                    previousCompany.cTermiteCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CTermiteCompany>( contactType, model.cCompany.CompanyId ) : new CTermiteCompany();
                    previousCompany.cTermiteCompany.SetCCompanyContactType( model.cTermiteCompany, model.cCompany );
                    previousCompany.cTermiteCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cTermiteCompany = _facade.SaveContactsCompany<CTermiteCompany>( previousCompany.cTermiteCompany, contactType );
                    break;
                case SystemAdminContactTypesEnum.TitleInsurance:
                    previousCompany.cTitleInsuranceCompany = model.cCompany.CompanyId != 0 ? _facade.LoadContactsCompany<CTitleInsuranceCompany>( contactType, model.cCompany.CompanyId ) : new CTitleInsuranceCompany();
                    previousCompany.cTitleInsuranceCompany.SetCCompanyContactType( model.cTitleInsuranceCompany, model.cCompany );
                    previousCompany.cTitleInsuranceCompany.ModifiedByUserAccountId = modifiedByUserAccountId;
                    model.cTitleInsuranceCompany = _facade.SaveContactsCompany<CTitleInsuranceCompany>( previousCompany.cTitleInsuranceCompany, contactType );
                    break;
            }
            return model;
        }

        private ContactsProfileViewModel SaveContactObject( ContactsProfileViewModel model, int contactType )
        {
            var previousContact = new ContactsProfileViewModel();
            switch ( ( SystemAdminContactTypesEnum )contactType )
            {
                case SystemAdminContactTypesEnum.CPA:
                    previousContact.cCPAContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CCPAContact>( contactType, model.cContact.ContactId ) : new CCPAContact();
                    previousContact.cCPAContact.SetCContactContactType( model.cCPAContact, model.cContact );
                    model.cCPAContact = _facade.SaveContactsContact<CCPAContact>( previousContact.cCPAContact, contactType );

                    break;
                case SystemAdminContactTypesEnum.DocSigning:
                    previousContact.cDocSigningContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CDocSigningContact>( contactType, model.cContact.ContactId ) : new CDocSigningContact();
                    previousContact.cDocSigningContact.SetCContactContactType( model.cDocSigningContact, model.cContact );
                    model.cDocSigningContact = _facade.SaveContactsContact<CDocSigningContact>( previousContact.cDocSigningContact, contactType );
                    break;
                //case SystemAdminContactTypesEnum.Employer:
                //    previousContact.cEmployerContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CEmployerContact>( contactType, model.cContact.ContactId ): new CEmployerContact();
                //    previousContact.cEmployerContact.SetCContactContactType( model.cEmployerContact, model.cContact );
                //    model.cEmployerContact = _facade.SaveContactsContact<CEmployerContact>( previousContact.cEmployerContact, contactType );

                //    break;
                case SystemAdminContactTypesEnum.Escrow:
                    previousContact.cEscrowContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CEscrowContact>( contactType, model.cContact.ContactId ) : new CEscrowContact();
                    previousContact.cEscrowContact.SetCContactContactType( model.cEscrowContact, model.cContact );
                    model.cEscrowContact = _facade.SaveContactsContact<CEscrowContact>( previousContact.cEscrowContact, contactType );
                    break;
                case SystemAdminContactTypesEnum.FloodInsurance:
                    previousContact.cFloodInsuranceContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CFloodInsuranceContact>( contactType, model.cContact.ContactId ) : new CFloodInsuranceContact();
                    previousContact.cFloodInsuranceContact.SetCContactContactType( model.cFloodInsuranceContact, model.cContact );
                    model.cFloodInsuranceContact = _facade.SaveContactsContact<CFloodInsuranceContact>( previousContact.cFloodInsuranceContact, contactType );
                    break;

                case SystemAdminContactTypesEnum.HazardInsurance:
                    previousContact.cHazardInsuranceContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CHazardInsuranceContact>( contactType, model.cContact.ContactId ) : new CHazardInsuranceContact();
                    previousContact.cHazardInsuranceContact.SetCContactContactType( model.cHazardInsuranceContact, model.cContact );
                    model.cHazardInsuranceContact = _facade.SaveContactsContact<CHazardInsuranceContact>( previousContact.cHazardInsuranceContact, contactType );
                    break;
                case SystemAdminContactTypesEnum.HomeWarranty:
                    previousContact.cHomeWarrantyContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CHomeWarrantyContact>( contactType, model.cContact.ContactId ) : new CHomeWarrantyContact();
                    previousContact.cHomeWarrantyContact.SetCContactContactType( model.cHomeWarrantyContact, model.cContact );
                    model.cHomeWarrantyContact = _facade.SaveContactsContact<CHomeWarrantyContact>( previousContact.cHomeWarrantyContact, contactType );
                    break;

                case SystemAdminContactTypesEnum.MortgageInsurance:
                    previousContact.cMortgageInsuranceContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CMortgageInsuranceContact>( contactType, model.cContact.ContactId ) : new CMortgageInsuranceContact();
                    previousContact.cMortgageInsuranceContact.SetCContactContactType( model.cMortgageInsuranceContact, model.cContact );
                    model.cMortgageInsuranceContact = _facade.SaveContactsContact<CMortgageInsuranceContact>( previousContact.cMortgageInsuranceContact, contactType );
                    break;

                case SystemAdminContactTypesEnum.PropertyManagement:
                    previousContact.CPropertyManagementContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CPropertyManagementContact>( contactType, model.cContact.ContactId ) : new CPropertyManagementContact();
                    previousContact.CPropertyManagementContact.SetCContactContactType( model.CPropertyManagementContact, model.cContact );
                    model.CPropertyManagementContact = _facade.SaveContactsContact<CPropertyManagementContact>( previousContact.CPropertyManagementContact, contactType );
                    break;

                case SystemAdminContactTypesEnum.Realtor:
                    previousContact.cRealtorContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CRealtorContact>( contactType, model.cContact.ContactId ) : new CRealtorContact();
                    previousContact.cRealtorContact.SetCContactContactType( model.cRealtorContact, model.cContact );
                    model.cRealtorContact = _facade.SaveContactsContact<CRealtorContact>( previousContact.cRealtorContact, contactType );
                    break;

                case SystemAdminContactTypesEnum.Survey:
                    previousContact.cSurveyContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CSurveyContact>( contactType, model.cContact.ContactId ) : new CSurveyContact();
                    previousContact.cSurveyContact.SetCContactContactType( model.cSurveyContact, model.cContact );
                    model.cSurveyContact = _facade.SaveContactsContact<CSurveyContact>( previousContact.cSurveyContact, contactType );
                    break;

                case SystemAdminContactTypesEnum.Termite:
                    previousContact.cTermiteContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CTermiteContact>( contactType, model.cContact.ContactId ) : new CTermiteContact();
                    previousContact.cTermiteContact.SetCContactContactType( model.cTermiteContact, model.cContact );
                    model.cTermiteContact = _facade.SaveContactsContact<CTermiteContact>( previousContact.cTermiteContact, contactType );
                    break;

                case SystemAdminContactTypesEnum.TitleInsurance:
                    previousContact.cTitleInsuranceContact = model.cContact.ContactId != 0 ? _facade.LoadContactsContact<CTitleInsuranceContact>( contactType, model.cContact.ContactId ) : new CTitleInsuranceContact();
                    previousContact.cTitleInsuranceContact.SetCContactContactType( model.cTitleInsuranceContact, model.cContact );
                    model.cTitleInsuranceContact = _facade.SaveContactsContact<CTitleInsuranceContact>( previousContact.cTitleInsuranceContact, contactType );
                    break;


            }
            return model;
        }

        private ContactsProfileViewModel LoadCompanyObject( int contactType, int companyId, ContactsProfileViewModel model )
        {

            switch ( ( SystemAdminContactTypesEnum )contactType )
            {
                case SystemAdminContactTypesEnum.CPA:

                    model.cCPACompany = _facade.LoadContactsCompany<CCPACompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cCPACompany;
                    break;
                case SystemAdminContactTypesEnum.DocSigning:

                    model.cDocSigningCompany = _facade.LoadContactsCompany<CDocSigningCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cDocSigningCompany;
                    break;
                //case SystemAdminContactTypesEnum.Employer:

                //    model.cEmployerCompany = _facade.LoadContactsCompany<CEmployerCompany>( contactType, companyId );
                //    model.cCompany = ( CCompany )model.cEmployerCompany;
                //    break;
                case SystemAdminContactTypesEnum.Escrow:

                    model.cEscrowCompany = _facade.LoadContactsCompany<CEscrowCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cEscrowCompany;
                    break;
                case SystemAdminContactTypesEnum.FloodInsurance:

                    model.cFloodInsuranceCompany = _facade.LoadContactsCompany<CFloodInsuranceCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cFloodInsuranceCompany;
                    break;

                case SystemAdminContactTypesEnum.HazardInsurance:

                    model.cHazardInsuranceCompany = _facade.LoadContactsCompany<CHazardInsuranceCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cHazardInsuranceCompany;
                    break;
                case SystemAdminContactTypesEnum.HomeWarranty:

                    model.cHomeWarrantyCompany = _facade.LoadContactsCompany<CHomeWarrantyCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cHomeWarrantyCompany;
                    break;
                case SystemAdminContactTypesEnum.MortgageInsurance:

                    model.cMortgageInsuranceCompany = _facade.LoadContactsCompany<CMortgageInsuranceCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cMortgageInsuranceCompany;
                    break;
                case SystemAdminContactTypesEnum.PropertyManagement:

                    model.cPropertyManagementCompany = _facade.LoadContactsCompany<CPropertyManagementCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cPropertyManagementCompany;
                    break;
                case SystemAdminContactTypesEnum.Realtor:

                    model.cRealtorCompany = _facade.LoadContactsCompany<CRealtorCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cRealtorCompany;
                    break;
                case SystemAdminContactTypesEnum.Survey:

                    model.cSurveyCompany = _facade.LoadContactsCompany<CSurveyCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cSurveyCompany;
                    break;
                case SystemAdminContactTypesEnum.Termite:

                    model.cTermiteCompany = _facade.LoadContactsCompany<CTermiteCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cTermiteCompany;
                    break;
                case SystemAdminContactTypesEnum.TitleInsurance:

                    model.cTitleInsuranceCompany = _facade.LoadContactsCompany<CTitleInsuranceCompany>( contactType, companyId );
                    model.cCompany = ( CCompany )model.cTitleInsuranceCompany;
                    break;
            }
            return model;
        }

        private ContactsProfileViewModel LoadContactObject( int contactType, int contactId, ContactsProfileViewModel model )
        {

            switch ( ( SystemAdminContactTypesEnum )contactType )
            {
                case SystemAdminContactTypesEnum.CPA:

                    model.cCPAContact = _facade.LoadContactsContact<CCPAContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cCPAContact;
                    break;
                case SystemAdminContactTypesEnum.DocSigning:

                    model.cDocSigningContact = _facade.LoadContactsContact<CDocSigningContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cDocSigningContact;
                    break;
                //case SystemAdminContactTypesEnum.Employer:

                //    model.cEmployerContact = _facade.LoadContactsContact<CEmployerContact>( contactType, contactId );
                //    model.cContact = ( CContact )model.cEmployerContact;
                //    break;
                case SystemAdminContactTypesEnum.Escrow:

                    model.cEscrowContact = _facade.LoadContactsContact<CEscrowContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cEscrowContact;
                    break;
                case SystemAdminContactTypesEnum.FloodInsurance:

                    model.cFloodInsuranceContact = _facade.LoadContactsContact<CFloodInsuranceContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cFloodInsuranceContact;
                    break;

                case SystemAdminContactTypesEnum.HazardInsurance:

                    model.cHazardInsuranceContact = _facade.LoadContactsContact<CHazardInsuranceContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cHazardInsuranceContact;
                    break;
                case SystemAdminContactTypesEnum.HomeWarranty:

                    model.cHomeWarrantyContact = _facade.LoadContactsContact<CHomeWarrantyContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cHomeWarrantyContact;
                    break;

                case SystemAdminContactTypesEnum.MortgageInsurance:

                    model.cMortgageInsuranceContact = _facade.LoadContactsContact<CMortgageInsuranceContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cMortgageInsuranceContact;
                    break;

                case SystemAdminContactTypesEnum.PropertyManagement:

                    model.CPropertyManagementContact = _facade.LoadContactsContact<CPropertyManagementContact>( contactType, contactId );
                    model.cContact = ( CContact )model.CPropertyManagementContact;
                    break;

                case SystemAdminContactTypesEnum.Realtor:

                    model.cRealtorContact = _facade.LoadContactsContact<CRealtorContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cRealtorContact;
                    break;

                case SystemAdminContactTypesEnum.Survey:

                    model.cSurveyContact = _facade.LoadContactsContact<CSurveyContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cSurveyContact;
                    break;

                case SystemAdminContactTypesEnum.Termite:

                    model.cTermiteContact = _facade.LoadContactsContact<CTermiteContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cTermiteContact;
                    break;

                case SystemAdminContactTypesEnum.TitleInsurance:

                    model.cTitleInsuranceContact = _facade.LoadContactsContact<CTitleInsuranceContact>( contactType, contactId );
                    model.cContact = ( CContact )model.cTitleInsuranceContact;
                    break;


            }
            return model;
        }



        public ActionResult GetcContactTypeView( String contactId, String companyId, string contactType )
        {
            int _companyId;
            Int32.TryParse( companyId, out _companyId );
            int _contactId;
            Int32.TryParse( contactId, out _contactId );
            int _contactType;
            Int32.TryParse( contactType, out _contactType );

            ContactsProfileViewModel cp = new ContactsProfileViewModel();


            cp = SetcContactTypeModel( cp, _contactType );

            var contactViewName = "~/Views/Shared/SystemAdmin/Contacts/c" + ( ( SystemAdminContactTypesEnum )_contactType ) + "Contact.cshtml";

            return PartialView( contactViewName, cp );
        }

        public ActionResult GetcCompanyTypeView( String companyId, String contactType )
        {
            int _companyId;
            Int32.TryParse( companyId, out _companyId );

            int _contactType;
            Int32.TryParse( contactType, out _contactType );

            ContactsProfileViewModel cp = new ContactsProfileViewModel();

            cp = SetcCompanyTypeModel( cp, _contactType );

            ViewBag.CompanyTypeSpecificTitle = "Company Type Specific Information";
            var companyViewName = "~/Views/Shared/SystemAdmin/Company/c" + ( ( SystemAdminContactTypesEnum )_contactType ) + "Company.cshtml";

            return PartialView( companyViewName, cp );
        }

        public ActionResult GetCContactProfileShowHistory( int companyId )
        {
            var companyHistory = new CCompanyHistoryViewModel();
            companyHistory.CompanyHistoryItems = _facade.GetCompanyDeactivationHistory( companyId );

            return PartialView( "SystemAdmin/Company/cCompanyHistoryPopup", companyHistory );
        }


        public JsonResult CheckIsDuplicateLoginCompany( ContactsProfileViewModel company )
        {
            try
            {
                if ( company == null || company.cCompany == null || company.cCompany.ContactType < 0 || string.IsNullOrEmpty( company.cCompany.CompanyName ) || string.IsNullOrEmpty( company.cCompany.StreetAddress )
                    || string.IsNullOrEmpty( company.cCompany.City ) || company.cCompany.StateId < 1 || string.IsNullOrEmpty( company.cCompany.Zip ) )
                {
                    throw new ArgumentNullException( "ContactType, CompanyName, StreetAddress, City, StateId and Zip are required!" );
                }

                var isDuplicate = _facade.CheckIsDuplicateLoginCompany( company.cCompany );

                return Json( new { success = true, isDuplicate = isDuplicate } );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "_contacts.cshtml::CheckIsDuplicateLoginCompany", exception, Guid.Empty, IdentityManager.GetUserAccountId() );
                return Json( new { success = false } );
            }
        }


        public JsonResult CheckIsDuplicateLoginContact( ContactsProfileViewModel contact )
        {

            try
            {

                if ( contact == null || contact.cContact == null || string.IsNullOrEmpty( contact.cContact.FirstName ) || string.IsNullOrEmpty( contact.cContact.LastName ) || string.IsNullOrEmpty( contact.cContact.Email )
                    || string.IsNullOrEmpty( contact.cContact.PhoneNumber ) )
                {
                    throw new ArgumentNullException( "FirstName, LastName, Email and PhoneNumber are required!" );
                }

                var isDuplicate = _facade.CheckIsDuplicateLoginContact( contact.cContact );

                return Json( new { success = true, isDuplicate = isDuplicate } );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "_contacts.cshtml::CheckIsDuplicateLoginContact", exception, Guid.Empty, IdentityManager.GetUserAccountId() );
                return Json( new { success = false } );
            }

        }

        /// <summary>
        /// Get filtered CCompanies
        /// </summary>
        /// <param name="searchText"></param>
        /// <param name="contactType"></param>
        /// <param name="companyName"></param>
        /// <param name="streetAddress"></param>
        /// <param name="city"></param>
        /// <param name="stateId"></param>
        /// <param name="zipCode"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult FilterCCompaniesBySearchString( string searchText, int contactType, string sourceField, string companyName
            , string streetAddress , string city, string zipCode, int stateId )
        {
            List<CCompany> listOfCCompanies = new List<CCompany>();
            try
            {
                List<CCompany> allCCompanies = new List<CCompany>();
                allCCompanies = _facade.GetCCompanyList();

                if ( allCCompanies == null )
                    throw new Exception();

                listOfCCompanies = allCCompanies.FindAll( p => ( contactType == -1 || p.ContactType == contactType )
                                                                && ( String.IsNullOrEmpty( zipCode ) || p.Zip.ToLower().StartsWith( zipCode.ToLower() ) )
                                                                && ( String.IsNullOrEmpty( companyName ) || p.CompanyName.ToLower().StartsWith( companyName.ToLower() ) )
                                                                && ( String.IsNullOrEmpty( streetAddress ) || p.StreetAddress.ToLower().StartsWith( streetAddress.ToLower() ) )
                                                                && ( String.IsNullOrEmpty( city ) || p.City.ToLower().StartsWith( city.ToLower() ) )
                                                                && ( stateId == -1 || p.StateId == stateId )
                                                                && ( String.IsNullOrEmpty( zipCode ) || p.Zip.ToLower().StartsWith( zipCode ) ) ).OrderBy( x => x.CompanyName ).Take( 5 ).ToList();


                if ( listOfCCompanies.Count == 0 )
                {
                    listOfCCompanies.Add( new CCompany() { CompanyName = "None Found", CompanyPhoneNumber = String.Empty, City = String.Empty, Zip = String.Empty, StreetAddress = String.Empty } );

                }
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.WebSkylineController, ex.Message, ex );
            }

            return Json( listOfCCompanies, JsonRequestBehavior.AllowGet );

        }

        /// <summary>
        /// Get filtered CContacts
        /// </summary>
        /// <param name="searchText"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult FilterCContactsBySearchString( string searchText, int companyId, string firstName, string lastName, string phoneNumber, string email )
        {
            List<CContact> listOfCContact = new List<CContact>();
            try
            {
                List<CContact> allCContact = new List<CContact>();
                allCContact = _facade.GetCContactList( companyId );

                if ( allCContact == null )
                    throw new Exception();

                listOfCContact = allCContact.FindAll( p => ( String.IsNullOrEmpty( firstName ) || p.FirstName.ToLower().StartsWith( firstName.ToLower() ) )
                                                            && ( String.IsNullOrEmpty( lastName ) || p.LastName.ToLower().StartsWith( lastName.ToLower() ) )
                                                            && ( String.IsNullOrEmpty( phoneNumber ) || p.PhoneNumber.ToLower().StartsWith( phoneNumber.ToLower() ) )
                                                            && ( String.IsNullOrEmpty( email ) || p.Email.ToLower().StartsWith( email.ToLower() ) )
                                                            ).OrderBy( x => x.FirstName ).ThenBy( y => y.LastName ).Take( 5 ).ToList();

                if ( listOfCContact.Count == 0 )
                {
                    listOfCContact.Add( new CContact() { FirstName = "None Found", LastName = String.Empty, PhoneNumber = String.Empty, Email = String.Empty } );

                }
            }
            catch ( Exception ex )
            {
                TraceHelper.Error( TraceCategory.WebSkylineController, ex.Message, ex );
            }

            return Json( listOfCContact, JsonRequestBehavior.AllowGet );

        }

        /// <summary>
        /// Upload user image to repository
        /// </summary>
        /// <param name="file"></param>
        public JsonResult Upload()
        {
            HttpPostedFileBase file = null;

            Guid pictureId = Guid.Empty;
            int maxImageUploadSize = 1048576;

            for ( int i = 0; i < Request.Files.Count; i++ )
            {
                file = Request.Files[ i ];
            }

            if ( file == null )
                return Json( new { Message = "", PictureId = pictureId } );

            if ( ( file.FileName.Length > 0 ) && ( file.ContentLength > 0 ) )
            {
                string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
                string extension = Path.GetExtension( file.FileName );

                if ( string.IsNullOrEmpty( extension ) )
                {
                    return Json( new { Message = "Uploading a file without extension is not allowed. Please select another file.", PictureId = pictureId } );
                }

                if ( !allowedExtensions.Contains( extension.ToLower() ) )
                {
                    return Json( new { Message = "Supported extensions are: .jpg, .jpeg, .png and .gif. Please select another file.", PictureId = pictureId } );
                }

                if ( file.ContentLength > maxImageUploadSize )
                {
                    return Json( new { Message = "File is too large. Please make sure your file size is under 1 MB.", PictureId = pictureId } );
                }

                using ( BinaryReader reader = new BinaryReader( file.InputStream ) )
                {
                    byte[] fileData = reader.ReadBytes( file.ContentLength );



                    System.Drawing.Image conciergeImage = System.Drawing.Image.FromStream( file.InputStream );
                    if ( conciergeImage.Width > 200 || conciergeImage.Height > 200 )
                    {
                        conciergeImage = Resize( conciergeImage, 200, 200 );
                        MemoryStream ms = new MemoryStream();
                        if ( extension.Contains( "jpg" ) || extension.Contains( "jpeg" ) )
                            conciergeImage.Save( ms, System.Drawing.Imaging.ImageFormat.Jpeg );
                        if ( extension.Contains( "png" ) )
                            conciergeImage.Save( ms, System.Drawing.Imaging.ImageFormat.Png );
                        if ( extension.Contains( "gif" ) )
                            conciergeImage.Save( ms, System.Drawing.Imaging.ImageFormat.Gif );
                        fileData = ms.ToArray();

                    }

                    FileStoreItem item = new FileStoreItem();

                    item.DateCreated = DateTime.Now;
                    item.Description = "User Image";

                    item.FileStoreItemFile = new FileStoreItemFile();
                    item.FileStoreItemFile.DateCreated = DateTime.Now;
                    item.FileStoreItemFile.ContentType = DocumentContentType.JPG;
                    item.FileStoreItemFile.Data = fileData;
                    item.FileStoreItemFile.Filename = file.FileName;

                    pictureId = FileStoreServiceFacade.SaveRepositoryItem( item, IdentityManager.GetUserAccountId() );

                    return Json( new { Message = "", PictureId = pictureId } );

                }
            }

            return Json( new { Message = "Image upload failed", PictureId = pictureId } );
        }

        ///<summary>
        ///Downloads picture from repository for display 
        ///</summary>
        public void DownloadPicture( Guid repositoryItemId )
        {
            if ( repositoryItemId == Guid.Empty )
                return;

            var repositoryItem = FileStoreServiceFacade.GetFileStoreItemById( repositoryItemId, IdentityManager.GetUserAccountId() );

            if ( repositoryItem != null && repositoryItem.FileStoreItemFile != null && repositoryItem.FileStoreItemFile.Data != null )
            {
                using ( MemoryStream ms = new MemoryStream( repositoryItem.FileStoreItemFile.Data ) )
                {
                    using ( Bitmap bmp = ( Bitmap )Bitmap.FromStream( ms ) )
                    {
                        bmp.Save( Response.OutputStream, ImageFormat.Jpeg );
                    }
                }
            }
        }

        protected System.Drawing.Image Resize( System.Drawing.Image i, int width, int height )
        {
            var ratioX = ( double )width / i.Width;
            var ratioY = ( double )height / i.Height;
            var ratio = Math.Min( ratioX, ratioY );

            var newWidth = ( int )( i.Width * ratio );
            var newHeight = ( int )( i.Height * ratio );

            var newImage = new Bitmap( newWidth, newHeight );
            Graphics.FromImage( newImage ).DrawImage( i, 0, 0, newWidth, newHeight );
            return newImage;

        }

        /// <summary>
        /// Get LP & DU view
        /// </summary>
        /// <param name="parametersJSON"></param>
        /// <param name="isSystemAdminView"></param>
        /// <returns></returns>
        public ActionResult GetLP_DU()
        {
            return PartialView("~/Views/Shared/SystemAdmin/LP_DU/LP_DU.cshtml");
        }
        /// <summary>
        /// Get view based on selected tab
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult GetLP_DU_AjaxTab(int id)
        {
            LP_DUViewModel model = new LP_DUViewModel();
            string viewName = string.Empty;
            //LP
            try
            {
                switch (id)
                {
                    case 1:
                        viewName = "~/Views/Shared/SystemAdmin/LP_DU/LP.cshtml";
                        model.LP_PdfConversionServiceUri = Client.Instance.GetConfigurationValue(KEY_PDFSERVICEURI, ENVIRONMENT, new string[] { });
                        model.LP_ServiceEndpoint = Client.Instance.GetConfigurationValue(LP_KEY_SERVICEENDPOINT, ENVIRONMENT, new string[] { });
                        model.LP_Login = Client.Instance.GetConfigurationValue(LP_KEY_LOGIN, ENVIRONMENT, new string[] { });
                        model.LP_Password = Client.Instance.GetConfigurationValue(LP_KEY_PASSWORD, ENVIRONMENT, new string[] { });
                        model.LP_FindingsDocumentCategory = Client.Instance.GetConfigurationValue(LP_KEY_DOCUMENTCATEGORY, ENVIRONMENT, new string[] { });
                        model.LP_CreditAgencyName = Client.Instance.GetConfigurationValue(LP_KEY_CREDITAGENCYNAME, ENVIRONMENT, new string[] { });                       
                        break;

                    //DU
                    case 2:
                        viewName = "~/Views/Shared/SystemAdmin/LP_DU/DU.cshtml";
                        model.DU_PdfConversionServiceUri = Client.Instance.GetConfigurationValue(KEY_PDFSERVICEURI, ENVIRONMENT, new string[] { });
                        model.DU_ServiceEndpoint = Client.Instance.GetConfigurationValue(DU_KEY_SERVICEENDPOINT, ENVIRONMENT, new string[] { });
                        model.DU_Login = Client.Instance.GetConfigurationValue(DU_KEY_LOGIN, ENVIRONMENT, new string[] { });
                        model.DU_Password = Client.Instance.GetConfigurationValue(DU_KEY_PASSWORD, ENVIRONMENT, new string[] { });
                        model.DU_FindingsDocumentCategory = Client.Instance.GetConfigurationValue(DU_KEY_DOCUMENTCATEGORY, ENVIRONMENT, new string[] { });
                        model.DU_CreditAgencyName = Client.Instance.GetConfigurationValue(DU_KEY_CREDITAGENCYNAME, ENVIRONMENT, new string[] { });
                        model.DU_CreditAgencyAccount = Client.Instance.GetConfigurationValue(DU_KEY_CREDITAGENCYACCOUNT, ENVIRONMENT, new string[] { });
                        model.DU_CreditAgencyPassword = Client.Instance.GetConfigurationValue(DU_KEY_CREDITAGENCYPASSWORD, ENVIRONMENT, new string[] { });                       
                        break;
                }
                ViewData["Error"] = string.Empty;
            }
            catch (Exception ex)
            {
                ViewData["Error"] = "Error occured while loading data.";
                TraceHelper.Error(TraceCategory.LoanCenter, "SystemAdminController: unable to load settings", ex, Guid.Empty, IdentityManager.GetUserAccountId());
            }

            return PartialView(viewName, model);
        }
        /// <summary>
        /// Save Loan Prospector
        /// </summary>
        /// <param name="fc"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult SaveLP(FormCollection fc)
        {
            try
            {
                Client.Instance.UpdateConfigurationValue(LP_KEY_SERVICEENDPOINT, ENVIRONMENT, new string[] { }, fc["LP_ServiceEndpoint"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(LP_KEY_LOGIN, ENVIRONMENT, new string[] { }, fc["LP_Login"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(LP_KEY_PASSWORD, ENVIRONMENT, new string[] { }, fc["LP_Password"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(LP_KEY_CREDITAGENCYNAME, ENVIRONMENT, new string[] { }, fc["LP_CreditAgencyName"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(LP_KEY_DOCUMENTCATEGORY, ENVIRONMENT, new string[] { }, fc["LP_FindingsDocumentCategory"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(KEY_PDFSERVICEURI, ENVIRONMENT, new string[] { }, fc["LP_PdfConversionServiceUri"].ToString().Trim());
                ViewData["Error"] = string.Empty;

            }
            catch (Exception ex)
            {
                ViewData["Error"] = "Error occured while loading data.";
                TraceHelper.Error(TraceCategory.LoanCenter, "SaveLP: unable to save settings", ex, Guid.Empty, IdentityManager.GetUserAccountId());
            }

            return GetLP_DU_AjaxTab(1);
        }
        /// <summary>
        /// Save Desktop Underwriter
        /// </summary>
        /// <param name="fc"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult SaveDU(FormCollection fc)
        {
            try
            {
                Client.Instance.UpdateConfigurationValue(DU_KEY_SERVICEENDPOINT, ENVIRONMENT, new string[] { }, fc["DU_ServiceEndpoint"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(DU_KEY_LOGIN, ENVIRONMENT, new string[] { }, fc["DU_Login"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(DU_KEY_PASSWORD, ENVIRONMENT, new string[] { }, fc["DU_Password"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(DU_KEY_CREDITAGENCYNAME, ENVIRONMENT, new string[] { }, fc["DU_CreditAgencyName"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(DU_KEY_CREDITAGENCYACCOUNT, ENVIRONMENT, new string[] { }, fc["DU_CreditAgencyAccount"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(DU_KEY_CREDITAGENCYPASSWORD, ENVIRONMENT, new string[] { }, fc["DU_CreditAgencyPassword"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(DU_KEY_DOCUMENTCATEGORY, ENVIRONMENT, new string[] { }, fc["DU_FindingsDocumentCategory"].ToString().Trim());
                Client.Instance.UpdateConfigurationValue(KEY_PDFSERVICEURI, ENVIRONMENT, new string[] { }, fc["DU_PdfConversionServiceUri"].ToString().Trim());
                ViewData["Error"] = String.Empty;
            }
            catch (Exception ex)
            {
                ViewData["Error"] = "Error occured while loading data.";
                TraceHelper.Error(TraceCategory.LoanCenter, "SaveDU: unable to save settings", ex, Guid.Empty, IdentityManager.GetUserAccountId());
            }

            return GetLP_DU_AjaxTab(2);
        }

        public ActionResult GetExportCreditReport()
        {
            return PartialView("~/Views/Shared/SystemAdmin/_ExportCreditReport.cshtml");
        }

        public ActionResult ExportCreditReport(string loanId)
        {
            Guid loanIdParsed = Guid.Empty;
            if (!Guid.TryParse(loanId, out loanIdParsed))
                throw new ArgumentException("Could not parse Loan ID: '" + loanId + "'", "loanId");
            CreditReportsRetrieved creditReportData = IntegrationLogServiceFacade.GetScrubbedCreditReportsData(loanIdParsed, ScrubItems);
            return new FileDownloadResult(creditReportData.CreditReportItems, String.Format("CreditReportPackage - {0}", loanId));
        }

        public JsonResult CheckForExportCreditReport(string loanIdString, string loanNumber)
        {
            string message = string.Empty;
            Guid loanId = Guid.Empty;
            int itemCount = 0;
            try
            {
                if (!string.IsNullOrWhiteSpace(loanIdString))
                {
                    Guid.TryParse(loanIdString, out loanId);
                }
                else if (!string.IsNullOrWhiteSpace(loanNumber))
                {
                    Guid? loanIdTemp = LoanServiceFacade.RetrieveLoanIdByLoanNumber(loanNumber, -1);
                    loanId = loanIdTemp.HasValue ? loanIdTemp.Value : Guid.Empty;
                }

                if (loanId != Guid.Empty)
                {
                    CreditReportsRetrieved creditReportData = IntegrationLogServiceFacade.GetScrubbedCreditReportsData(loanId, ScrubItems);
                    itemCount = creditReportData != null && creditReportData.CreditReportItems != null ? creditReportData.CreditReportItems.Count : 0;
                }
            }
            catch (Exception ex)
            {
                TraceHelper.Error(TraceCategory.LoanCenter, "CheckForExportCreditReport: Error while trying to get credit report data!", ex, loanId, IdentityManager.GetUserAccountId());
                itemCount = -1;
            }

            switch (itemCount)
            {
                case -1:
                    message = "Error while trying to get credit report data!";
                    break;
                case 0:
                    message = "There are no credit report files for download for given parameters.";
                    break;
                case 1:
                    message = "There is 1 credit report file for download for given parameters. \nDo you want to download it?";
                    break;
                default:
                    message = string.Format("There are {0} credit report files for download for given parameters. \nDo you want to download them?", itemCount);
                    break;
            }

            return Json(new { message = message, itemCount = itemCount, loanId = loanId.ToString() }, JsonRequestBehavior.AllowGet); 
        }

        private ContactsProfileViewModel SetcCompanyTypeModel( ContactsProfileViewModel cp, int contactType )
        {
            if ( cp.cCompany == null )
            {
                cp.cCompany = new CCompany();
            }


            switch ( ( SystemAdminContactTypesEnum )contactType )
            {
                case SystemAdminContactTypesEnum.CPA:
                    cp.cCPACompany = new CCPACompany();
                    break;
                case SystemAdminContactTypesEnum.DocSigning:
                    cp.cDocSigningCompany = new CDocSigningCompany();
                    break;
                //case SystemAdminContactTypesEnum.Employer:
                //    cp.cEmployerCompany = new CEmployerCompany();
                //    break;
                case SystemAdminContactTypesEnum.Escrow:
                    cp.cEscrowCompany = new CEscrowCompany();
                    break;
                case SystemAdminContactTypesEnum.FloodInsurance:
                    cp.cFloodInsuranceCompany = new CFloodInsuranceCompany();
                    break;

                case SystemAdminContactTypesEnum.HazardInsurance:
                    cp.cHazardInsuranceCompany = new CHazardInsuranceCompany();
                    break;
                case SystemAdminContactTypesEnum.HomeWarranty:
                    cp.cHomeWarrantyCompany = new CHomeWarrantyCompany();
                    break;
                case SystemAdminContactTypesEnum.MortgageInsurance:
                    cp.cMortgageInsuranceCompany = new CMortgageInsuranceCompany();
                    break;
                case SystemAdminContactTypesEnum.PropertyManagement:
                    cp.cPropertyManagementCompany = new CPropertyManagementCompany();
                    break;
                case SystemAdminContactTypesEnum.Realtor:
                    cp.cRealtorCompany = new CRealtorCompany();
                    break;
                case SystemAdminContactTypesEnum.Survey:
                    cp.cSurveyCompany = new CSurveyCompany();
                    break;
                case SystemAdminContactTypesEnum.Termite:
                    cp.cTermiteCompany = new CTermiteCompany();
                    break;
                case SystemAdminContactTypesEnum.TitleInsurance:
                    cp.cTitleInsuranceCompany = new CTitleInsuranceCompany();
                    break;
            }

            return cp;
        }

        private ContactsProfileViewModel SetcContactTypeModel( ContactsProfileViewModel cp, int contactType )
        {
            if ( cp.cCompany != null )
            {
                switch ( ( SystemAdminContactTypesEnum )contactType )
                {
                    case SystemAdminContactTypesEnum.CPA:
                        cp.cCPAContact = new CCPAContact();
                        break;
                    case SystemAdminContactTypesEnum.DocSigning:
                        cp.cDocSigningContact = new CDocSigningContact();
                        break;
                    //case SystemAdminContactTypesEnum.Employer:
                    //    cp.cEmployerContact = new CEmployerContact();                      
                    //    break;
                    case SystemAdminContactTypesEnum.Escrow:
                        cp.cEscrowContact = new CEscrowContact();
                        break;
                    case SystemAdminContactTypesEnum.FloodInsurance:
                        cp.cFloodInsuranceContact = new CFloodInsuranceContact();
                        break;

                    case SystemAdminContactTypesEnum.HazardInsurance:
                        cp.cHazardInsuranceContact = new CHazardInsuranceContact();
                        break;
                    case SystemAdminContactTypesEnum.HomeWarranty:
                        cp.cHomeWarrantyContact = new CHomeWarrantyContact();
                        break;
                    case SystemAdminContactTypesEnum.MortgageInsurance:
                        cp.cMortgageInsuranceContact = new CMortgageInsuranceContact();
                        break;
                    case SystemAdminContactTypesEnum.PropertyManagement:
                        cp.CPropertyManagementContact = new CPropertyManagementContact();
                        break;
                    case SystemAdminContactTypesEnum.Realtor:
                        cp.cRealtorContact = new CRealtorContact();
                        break;
                    case SystemAdminContactTypesEnum.Survey:
                        cp.cSurveyContact = new CSurveyContact();
                        break;
                    case SystemAdminContactTypesEnum.Termite:
                        cp.cTermiteContact = new CTermiteContact();
                        break;
                    case SystemAdminContactTypesEnum.TitleInsurance:
                        cp.cTitleInsuranceContact = new CTitleInsuranceContact();
                        break;

                }
            }


            return cp;
        }

        private ContactsProfileViewModel GetcContactNewLeadSourceId( ContactsProfileViewModel cp, int contactType )
        {
            switch ( ( SystemAdminContactTypesEnum )contactType )
            {
                case SystemAdminContactTypesEnum.Realtor:
                    cp.cRealtorContact.LeadSourceId = _facade.GetNextLeadSourceId();
                    break;
            }

            return cp;
        }

        private LookupCollection GetStatesLookupCollection()
        {
            LookupCollection statesLookupCollection = new LookupCollection();
            
            if( Session[ SessionHelper.SystemAdminLookupStates ] != null)
            {
                statesLookupCollection = (LookupCollection) Session[SessionHelper.SystemAdminLookupStates];
            }
            else
            {
                statesLookupCollection = LookupServiceFacade.Lookup( LookupKeywords.States, -1 );
                Session[ SessionHelper.SystemAdminLookupStates ] = statesLookupCollection;

                if ( statesLookupCollection != null && statesLookupCollection.SingleOrDefault( x => x.Value == -1 ) == null )
                    statesLookupCollection.Insert( 0, new Lookup( -1, String.Empty ) );
            }

            return statesLookupCollection;
        }
    }
}
