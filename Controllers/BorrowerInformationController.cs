using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Common;
using MML.Contracts;
using MML.Web.Facade;
using AddressHelper = MML.Web.LoanCenter.Helpers.Utilities.AddressHelper;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class BorrowerInformationController : Controller
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult DisplayBorrowerInformation()
        {
            return PartialView("");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="loanId"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ShowBorrowerPopup(String loanId)
        {
            Guid loanIdValue;
            Guid.TryParse( loanId, out loanIdValue );

            if ( loanIdValue == Guid.Empty )
            {
                return null;
            }
            var userAccountId = IdentityManager.GetUserAccountId();

            var loanType = LoanServiceFacade.RetrieveLoanType( loanIdValue, userAccountId );
            var loanHomebuyingType = LoanServiceFacade.RetrieveLoanHomeBuyingType( loanIdValue, userAccountId );
            PreApprovalStatus preApprovalStatus = LoanServiceFacade.RetrievePreApprovalStatus( loanIdValue );

            var activities = ActivitiesServiceFacade.RetrieveActivities( loanIdValue, IdentityManager.GetUserAccountId() );
            var activityCLA = activities == null ? null : activities.FirstOrDefault( c => c.ActivityType == ActivityType.CompleteLoanApplication );
            var activityPAR = activities == null ? null : activities.FirstOrDefault( c => c.ActivityType == ActivityType.PreApprovalRequest );

            bool IsPreApprovalQueue = !preApprovalStatus.Equals( PreApprovalStatus.Completed ) && loanType.Equals( LoanTransactionType.Purchase ) &&
                                  loanHomebuyingType.Equals( HomeBuyingType.GetPreApproved ) &&
                                  activityPAR != null && ( activityPAR.Status == ActivityStatus.Submitted ||
                                                          activityPAR.Status == ActivityStatus.Completed ||
                                                          activityPAR.Status == ActivityStatus.Update );

            if ( ( ( IsPreApprovalQueue && activityPAR.Status != ActivityStatus.Submitted && activityPAR.Status != ActivityStatus.Completed ) ) )
            {
                return PartialView( "_borrowersInformationPopupMessage" );
            }

            if ( !IsPreApprovalQueue && ( activityCLA == null || ( activityCLA.Status != ActivityStatus.Submitted && activityCLA.Status != ActivityStatus.Completed ) ) )
            {
                return PartialView( "_borrowersInformationPopupMessage" );
            }


            Property property = PropertyServiceFacade.RetrieveSubjectProperty( loanIdValue, userAccountId );

            var borrowerModel = BorrowerServiceFacade.GetBorrowersInformation(loanIdValue);

            if (borrowerModel == null)
            {
                return null;
            }

            if ( property != null )
            {
                borrowerModel.OccupancyType = property.OccupancyType;
            }

            SetupLookups(borrowerModel);

            if (borrowerModel.Borrower != null && borrowerModel.CoBorrower != null)
            {
                borrowerModel.BorrowerAndCoBorrowerAddressAreSame = AddressHelper.BorrowerAndCoborrowerAddressesAreSame(borrowerModel.Borrower.Addresses.ToList(), borrowerModel.CoBorrower.Addresses.ToList());
            }

            if (borrowerModel.CoBorrower == null)
            {
                borrowerModel.CoBorrower = new Contracts.Borrower();
            }

            if (borrowerModel.CoBorrowerModelInfo == null)
            {
                borrowerModel.CoBorrowerModelInfo = new BorrowerModelInfo();
            }

            if (borrowerModel.CoBorrowerModelInfo.PresentAddress == null)
            {
                borrowerModel.CoBorrowerModelInfo.PresentAddress = new Address();
            }

            if (borrowerModel.CoBorrowerModelInfo.MailingAddress == null)
            {
                borrowerModel.CoBorrowerModelInfo.MailingAddress = new Address();
            }

            if (borrowerModel.CoBorrowerModelInfo.MailingAddress.IsSameAsPropertyAddress == null)
            {
                borrowerModel.CoBorrowerModelInfo.MailingAddress.IsSameAsPropertyAddress = false;
            }
            if (borrowerModel.Borrower != null)
            {
                borrowerModel.Borrower.Addresses = new Collection<Address>();
            }
            if (borrowerModel.CoBorrower != null)
            {
                borrowerModel.CoBorrower.Addresses = new Collection<Address>();
            }

            TitleInNameAndMannerTitleHeld titleInNameAndMannerTitleHeld = LoanServiceFacade.RetrieveTitleInNameAndMannerTitleHeld(loanIdValue, -1);
            borrowerModel.TitleAndManner = titleInNameAndMannerTitleHeld;
            borrowerModel.MannerTitleHeld.Insert( 0, new Lookup { Name = "Select One", Value = -1 } );
            return PartialView("_borrowersInformation", borrowerModel);

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="borrower"></param>
        private static void SetupLookups(BorrowerModel borrower)
        {
            borrower.PhoneTypes = LookupServiceFacade.Lookup(LookupKeywords.PhoneType, -1).ToList();
            borrower.MaritalStatuses = LookupServiceFacade.Lookup(LookupKeywords.MaritalStatus, -1).ToList();
            borrower.States = LookupServiceFacade.Lookup(LookupKeywords.States, -1).ToList();
            borrower.MannerTitleHeld = LookupServiceFacade.Lookup(LookupKeywords.MannerTitleHeld, -1).ToList();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="borrowerModel"></param>
        private static void SetupBrrowerInformation(BorrowerModel borrowerModel)
        {

            borrowerModel.Borrower.LoanId = borrowerModel.LoanId;
            borrowerModel.CoBorrower.LoanId = borrowerModel.LoanId;

            borrowerModel.Borrower.BorrowerPersonalInfo.FullName = String.Format("{0} {1}",
                                                                                 borrowerModel.Borrower.
                                                                                     BorrowerPersonalInfo.FirstName,
                                                                                 borrowerModel.Borrower.
                                                                                     BorrowerPersonalInfo.LastName);

            switch (borrowerModel.BorrowerModelInfo.PresentAddress.OwnershipType)
            {
                case OwnershipType.Own:
                    borrowerModel.BorrowerModelInfo.PresentAddress.IsOwn = true;
                    break;
                case OwnershipType.Rent:
                    borrowerModel.BorrowerModelInfo.PresentAddress.IsRent = true;
                    break;
                case OwnershipType.RentFree:
                    borrowerModel.BorrowerModelInfo.PresentAddress.IsRent = false;
                    break;
            }

            if (borrowerModel.BorrowerModelInfo.MailingAddress.IsSameAsPropertyAddress ?? false)
            {
                //if borrower mailing address same as present than make a deep copy of present address and change address type to mailing
                var mailingAddressId = borrowerModel.BorrowerModelInfo.MailingAddress.AddressId;
                borrowerModel.BorrowerModelInfo.MailingAddress = (Address)borrowerModel.BorrowerModelInfo.PresentAddress.Clone();
                borrowerModel.BorrowerModelInfo.MailingAddress.AddressType = AddressType.Mailing;
                borrowerModel.BorrowerModelInfo.MailingAddress.IsSameAsPropertyAddress = true;
                borrowerModel.BorrowerModelInfo.MailingAddress.AddressId = mailingAddressId;
            }

            if ( borrowerModel.Borrower.IsOnline )
                borrowerModel.Borrower.BorrowerPersonalInfo.BorrowerEmailAddress = null;

            if( borrowerModel.BorrowerModelInfo.PresentAddress.NumberOfYears > 1)
                borrowerModel.BorrowerModelInfo.FormerAddress = new Address() { AddressId = borrowerModel.BorrowerModelInfo.FormerAddress.AddressId };
            else
                borrowerModel.BorrowerModelInfo.FormerAddress.IsSameAsPropertyAddress = false;

            borrowerModel.BorrowerModelInfo.PresentAddress.IsSameAsPropertyAddress = false;

        }

        private static void SetupCoBorrowerInforamtion(BorrowerModel borrowerModel)
        {
            if (borrowerModel.CoBorrower != null && borrowerModel.CoBorrower.BorrowerPersonalInfo != null)
            {
                borrowerModel.CoBorrower.BorrowerPersonalInfo.FullName = String.Format("{0} {1}",
                                                                                       borrowerModel.CoBorrower.
                                                                                           BorrowerPersonalInfo.FirstName,
                                                                                       borrowerModel.CoBorrower.
                                                                                           BorrowerPersonalInfo.LastName);
                switch (borrowerModel.CoBorrowerModelInfo.PresentAddress.OwnershipType)
                {
                    case OwnershipType.Own:
                        borrowerModel.CoBorrowerModelInfo.PresentAddress.IsOwn = true;
                        break;
                    case OwnershipType.Rent:
                        borrowerModel.CoBorrowerModelInfo.PresentAddress.IsRent = true;
                        break;
                    case OwnershipType.RentFree:
                        borrowerModel.CoBorrowerModelInfo.PresentAddress.IsRent = false;
                        break;
                }

                if (borrowerModel.CoBorrowerModelInfo.MailingAddress.IsSameAsPropertyAddress ?? false)
                {
                    //if borrower mailing address same as present than make a deep copy of present address and change address type to mailing
                    var mailingAddressId = borrowerModel.CoBorrowerModelInfo.MailingAddress.AddressId;
                    borrowerModel.CoBorrowerModelInfo.MailingAddress = (Address)borrowerModel.CoBorrowerModelInfo.PresentAddress.Clone();
                    borrowerModel.CoBorrowerModelInfo.MailingAddress.AddressType = AddressType.Mailing;
                    borrowerModel.CoBorrowerModelInfo.MailingAddress.IsSameAsPropertyAddress = true;
                    borrowerModel.CoBorrowerModelInfo.MailingAddress.AddressId = mailingAddressId;
                }



                if ( borrowerModel.CoBorrower.IsOnline )
                    borrowerModel.CoBorrower.BorrowerPersonalInfo.BorrowerEmailAddress = null;

                if ( borrowerModel.CoBorrowerModelInfo.PresentAddress.NumberOfYears > 1 )
                    borrowerModel.CoBorrowerModelInfo.FormerAddress = new Address() { AddressId = borrowerModel.CoBorrowerModelInfo.FormerAddress.AddressId };
                else
                    borrowerModel.CoBorrowerModelInfo.FormerAddress.IsSameAsPropertyAddress = false;

                borrowerModel.CoBorrowerModelInfo.PresentAddress.IsSameAsPropertyAddress = false;

            }
        }

       
        [HttpPost]
        public ActionResult SaveBorrowerInformation(BorrowerModel borrowerModel)
        { 
            var userAccountId = GetUserID();

            if (userAccountId == -1)
            {
                ModelState.AddModelError("UserAccountId", @"User is not valid");
            }

            ValidateEmail(borrowerModel);

            try
            {
                RemoveErrors(borrowerModel);
                if (ModelState.IsValid)
                {
                    SetupLookups(borrowerModel);
                    SetupBrrowerInformation(borrowerModel);
                    SetupCoBorrowerInforamtion(borrowerModel);

                    var status = BorrowerServiceFacade.UpdateBorrowerModel(borrowerModel, userAccountId);

                    return Json(new { success = status });
                }
            }
            catch (Exception ex)
            {
                TraceHelper.Error(TraceCategory.LoanCenterController, ex.Message, ex, borrowerModel.LoanId, userAccountId);
                ModelState.AddModelError("UserAccountId", ex.Message);
            }

            return Json(new
           {
               success = false,
               errors = ModelState.Keys.SelectMany(k => ModelState[k].Errors)
                               .Select(m => m.ErrorMessage).ToArray()
           });
        }

        private void ValidateEmail(BorrowerModel borrowerModel)
        {
            if (borrowerModel.Borrower != null && borrowerModel.Borrower.BorrowerPersonalInfo != null &&
                !borrowerModel.Borrower.IsOnline)
            {
                var borrowerParty = UserAccountServiceFacade.GetPartyByUserAccountId(borrowerModel.Borrower.UserAccountId);
                if (borrowerParty.EmailAddress != borrowerModel.Borrower.BorrowerPersonalInfo.BorrowerEmailAddress &&
                    !UserAccountServiceFacade.IsUsernameAvailability(
                        borrowerModel.Borrower.BorrowerPersonalInfo.BorrowerEmailAddress))
                {
                    ModelState.AddModelError("Borrower.BorrowerPersonalInfo.BorrowerEmailAddress",
                                             @"Email address for Borrower is already in use .");
                }
            }

            if (borrowerModel.CoBorrower != null && borrowerModel.CoBorrower.BorrowerPersonalInfo != null &&
                !borrowerModel.CoBorrower.IsOnline)
            {
                var coborrowerParty = UserAccountServiceFacade.GetPartyByUserAccountId(borrowerModel.CoBorrower.UserAccountId);
                if (coborrowerParty.EmailAddress != borrowerModel.CoBorrower.BorrowerPersonalInfo.BorrowerEmailAddress &&
                    !UserAccountServiceFacade.IsUsernameAvailability(
                        borrowerModel.CoBorrower.BorrowerPersonalInfo.BorrowerEmailAddress))
                {
                    ModelState.AddModelError("CoBorrower.BorrowerPersonalInfo.BorrowerEmailAddress",
                                             @"Email address for Co-Borrower is already in use .");
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        private int GetUserID()
        {
            UserAccount user;

            if (Session[SessionHelper.UserData] != null &&
                ((UserAccount) Session[SessionHelper.UserData]).Username == User.Identity.Name)
            {
                user = (UserAccount) Session[SessionHelper.UserData];
            }
            else
            {
                user = UserAccountServiceFacade.GetUserByName(User.Identity.Name);
            }
            if (user != null)
            {
                Session[SessionHelper.UserData] = user;
            }
            return user!=null ? user.UserAccountId : -1;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="borrowerModel"></param>
        private void RemoveErrors(BorrowerModel borrowerModel)
        {
            if ( borrowerModel.Borrower.PropertyTitle != PropertyTitle.Individual && ModelState.ContainsKey( "Borrower.PropertyTitle" ) )
            {
                ModelState[ "Borrower.PropertyTitle" ].Errors.Clear();
                ModelState[ "TitleAndManner.MannerTitleHeld" ].Errors.Clear();
                ModelState[ "TitleAndManner.TitleInNameValue" ].Errors.Clear();
            }

            if (ModelState.ContainsKey("BorrowerModelInfo.MailingAddress.NumberOfYears"))
            {
                ModelState["BorrowerModelInfo.MailingAddress.NumberOfYears"].Errors.Clear();
            }
            if (borrowerModel.BorrowerAndCoBorrowerAddressAreSame &&
                ModelState.ContainsKey("CoBorrowerModelInfo.PresentAddress.NumberOfYears"))
            {
                ModelState["CoBorrowerModelInfo.PresentAddress.NumberOfYears"].Errors.Clear();
            }
            if (ModelState.ContainsKey("CoBorrowerModelInfo.MailingAddress.NumberOfYears"))
            {
                ModelState["CoBorrowerModelInfo.MailingAddress.NumberOfYears"].Errors.Clear();
            }
            
            if ( borrowerModel.BorrowerModelInfo.PresentAddress.NumberOfMonths != 0 && borrowerModel.BorrowerModelInfo.PresentAddress.NumberOfYears == null && 
                ModelState.ContainsKey( "BorrowerModelInfo.PresentAddress.NumberOfYears" ) )
            {
                ModelState[ "BorrowerModelInfo.PresentAddress.NumberOfYears" ].Errors.Clear();
            }

            if ( borrowerModel.CoBorrowerModelInfo != null && borrowerModel.CoBorrowerModelInfo.PresentAddress.NumberOfMonths != null && 
                borrowerModel.CoBorrowerModelInfo.PresentAddress.NumberOfMonths != 0 && borrowerModel.CoBorrowerModelInfo.PresentAddress.NumberOfYears == null && 
                ModelState.ContainsKey( "CoBorrowerModelInfo.PresentAddress.NumberOfYears" ) )
            {
                ModelState[ "CoBorrowerModelInfo.PresentAddress.NumberOfYears" ].Errors.Clear();
            }


            if ( borrowerModel.BorrowerModelInfo.FormerAddress != null && borrowerModel.BorrowerModelInfo.FormerAddress.NumberOfMonths != null && 
                borrowerModel.BorrowerModelInfo.FormerAddress.NumberOfMonths != 0 && borrowerModel.BorrowerModelInfo.FormerAddress.NumberOfYears == null && 
                ModelState.ContainsKey( "BorrowerModelInfo.FormerAddress.NumberOfYears" ) )
            {
                ModelState[ "BorrowerModelInfo.FormerAddress.NumberOfYears" ].Errors.Clear();
            }

            if ( borrowerModel.CoBorrowerModelInfo != null && borrowerModel.CoBorrowerModelInfo.FormerAddress != null && 
                borrowerModel.CoBorrowerModelInfo.FormerAddress.NumberOfMonths != 0 && borrowerModel.CoBorrowerModelInfo.FormerAddress.NumberOfYears == null && 
                ModelState.ContainsKey( "CoBorrowerModelInfo.FormerAddress.NumberOfYears" ) )
            {
                ModelState[ "CoBorrowerModelInfo.FormerAddress.NumberOfYears" ].Errors.Clear();
            }

            if ( borrowerModel.BorrowerAndCoBorrowerAddressAreSame || borrowerModel.BorrowerModelInfo.PresentAddress.NumberOfYears > 1 || 
                ( borrowerModel.CoBorrowerModelInfo != null && borrowerModel.CoBorrowerModelInfo.PresentAddress.NumberOfYears > 1) )
            {
                for ( var i = 0; i < ModelState.Keys.Count; i++ )
                {
                    if ( ( ( ( borrowerModel.BorrowerAndCoBorrowerAddressAreSame || ( borrowerModel.CoBorrowerModelInfo != null && borrowerModel.CoBorrowerModelInfo.PresentAddress.NumberOfYears > 1 ) ) 
                        && ModelState.Keys.ElementAt( i ).Contains( "CoBorrowerModelInfo.FormerAddress" ) ) ||
                          ( borrowerModel.BorrowerModelInfo.PresentAddress.NumberOfYears > 1 && ModelState.Keys.ElementAt( i ).Contains( "BorrowerModelInfo.FormerAddress" ) 
                             && !ModelState.Keys.ElementAt( i ).Contains( "CoBorrowerModelInfo.FormerAddress" ) ) ) 
                        && ModelState.Values.ElementAt( i ).Errors.Count > 0 )
                    {
                        ModelState.Values.ElementAt( i ).Errors.Clear();
                     
                    }
                }
            }
        }

    }
}
