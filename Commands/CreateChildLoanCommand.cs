using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using MML.Common;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.SharedMethods;
using MML.Web.LoanCenter.Models;
using MML.Common.Helpers;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Commands
{
    public class CreateChildLoanCommand : ICommand
    {
        // GET: /GetStartedLoadCommand/

        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;

        public string ViewName
        {
            get
            {
                return _viewName;
            }
        }

        public dynamic ViewData
        {
            get
            {
                return _viewModel;
            }
        }

        public Dictionary<string, object> InputParameters
        {
            get
            {
                return _inputParameters;
            }
            set
            {
                _inputParameters = value;
            }
        }

        public HttpContextBase HttpContext
        {
            get { return _httpContext; }
            set { _httpContext = value; }
        }

        public void Execute()
        {
            Guid parentLoanId = Guid.Empty;
            string sectionTitle = string.Empty;
            if ( InputParameters.ContainsKey( "ParentLoanId" ) )
                Guid.TryParse( InputParameters[ "ParentLoanId" ].ToString().TrimEnd(), out parentLoanId );
            if ( InputParameters.ContainsKey( "SectionTitle" ) )
                sectionTitle =  InputParameters[ "SectionTitle" ].ToString();

            _viewName = "_getStarted";
            _viewModel = CreateChildLoan( parentLoanId, sectionTitle );
        }

        private GetStarted CreateChildLoan( Guid parentLoanId, string sectionTitle )
        {
            var user = AccountHelper.GetUserAccount( HttpContext );
            Int32 callCenterId = 0;

            if ( user.Roles != null && user.Roles.OrderByDescending( r => r.RolePriority ).FirstOrDefault() != null )
            {
                if ( user.Roles.OrderByDescending( r => r.RolePriority ).FirstOrDefault().RoleName.Equals( RoleName.LoanProcessor ) )
                    callCenterId = user.UserAccountId;
            }

            string message;
            Int32 createdUserAccountId;

            // Create account
            string username = "newprospect" + DateTime.Now.ToString( "MMddyyyyHmmss" ) + "@meandmyloan.com";
            var newUserAccount = new UserAccount()
            {
                Username = username,
                DateCreated = DateTime.Now,
                IsActivated = false,
                IsLocked = false,
                IsTemporary = false,
                Password = String.Empty,
                PasswordHint = String.Empty,
                SecurityAnswer = String.Empty,
                SecurityQuestionId = 1,
                OpenedByLOorConcierge = true,
                CreationStatus = UserAccountCreationStatus.SystemGenerated,
                IsOnlineUser = true, // by default we create online user, this will be changed on CreateAccountLO page
                Party = new Party()
                {
                    FirstName = "new",
                    LastName = "prospect",
                    SSN = "000-00-0000 ",
                    MiddleName = String.Empty,
                    CompanyName = String.Empty,
                    EmailAddress = String.Empty,
                    AlternateEmailAddress = String.Empty
                },
            };

            var hierarchy = new BrandingConfigurationHierarchy()
            {
                BranchId = user.BranchId == Guid.Empty ? null : ( Guid? )user.BranchId,
                ChannelId = user.ChannelId == 0 ? null : ( int? )user.ChannelId,
                DivisionId = user.DivisionId == 0 ? null : ( int? )user.DivisionId
            };

            var brandingConfiguration = CompanyProfileServiceFacade.RetrieveBrandingConfigurationByHierarchy( hierarchy );

            if ( UserAccountServiceFacade.CreateUserAccount( newUserAccount, false, out message, out createdUserAccountId, brandingConfiguration, createdByUserId: user.UserAccountId ) == false )
            {
                throw new ApplicationException( "Error creating new user account" );
            }

            if ( createdUserAccountId < 0 )
            {
                throw new ApplicationException( "Error creating new user account" );
            }

            newUserAccount.UserAccountId = createdUserAccountId;

            // Create Contact
            var contact = new Contact
            {
                FirstName = "",
                LastName = "",
                UserAccount = newUserAccount,
                LoanId = null,
                OwnerAccountId = user.UserAccountId,
                IsInitialLead = true,
            };

            if ( brandingConfiguration != null )
            {
                contact.CompanyProfileId = brandingConfiguration.CompanyProfileId;
                contact.ChannelId = brandingConfiguration.ChannelId;
                contact.DivisionId = brandingConfiguration.DivisionId;
                contact.BranchId = brandingConfiguration.BranchId;
            }

            if ( callCenterId != 0 ) contact.CallCenterId = callCenterId;

            var createdContact = ContactServiceFacade.CreateContact( contact );

            // Create impersonation token
            Guid token = MML.Common.Impersonation.ImpersonationToken.GetToken();
            bool isInserted = ImpersonationTokenServiceFacade.InsertImpersonationToken( token, Guid.Empty, user.UserAccountId );

            GetStartedHelper getStartedHelper = new GetStartedHelper();

            return getStartedHelper.GetStarted( HttpContext, user, token, username, true, createdContact.ContactId, parentLoanId: parentLoanId, sectionTitle: sectionTitle );
        }
    }
}
