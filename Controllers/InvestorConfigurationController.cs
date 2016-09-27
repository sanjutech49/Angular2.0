using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using iMP.Contracts;
using MML.Common;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.ViewModels.InvestorConfiguration;
using MML.Web.LoanCenter.Helpers.SystemAdmin;

namespace MML.Web.LoanCenter.Controllers
{
    public class InvestorConfigurationController : Controller
    {
        private readonly LookupCollection _extensionDaysLookup;
        private readonly LookupCollection _extensionPoliciesLookup;
    

        private readonly ProductServiceFacade _productServiceFacade;

        private readonly int _userAccountId;

        public InvestorConfigurationController ()
        {
            _productServiceFacade = new ProductServiceFacade();
            _userAccountId = IdentityManager.GetUserAccountId();

            _extensionDaysLookup = LookupServiceFacade.Lookup("investorextdays", _userAccountId);
            _extensionPoliciesLookup = LookupServiceFacade.Lookup("investorextpolicies", _userAccountId);         
        }


        /// <summary>
        /// Return results base on search paramethers
        /// </summary>
        /// <param name="active"></param>
        /// <param name="searchTerm"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="selectedId"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GridResult( bool? active, string searchTerm = "", int pageNumber = 1, int pageSize = 10, int? selectedId = null )
        {
            try
            {
                var retrieveInvestorsAndProducts = new RetrieveInvestorsAndProducts
                {
                    Active = active,
                    SearchTerm = searchTerm,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                var investorsAndProductsRetrieved = _productServiceFacade.RetrieveInvestorsAndProducts( retrieveInvestorsAndProducts ) ?? new InvestorsAndProductsRetrieved { Investors = new List<Investor>() };

                var model = new InvestorConfigurationViewModel
                {
                    Investors = investorsAndProductsRetrieved.Investors,
                    Active = active,
                    TotalItems = investorsAndProductsRetrieved.TotalItems,
                    PageCount = investorsAndProductsRetrieved.TotalPages,
                    CurrentPage = investorsAndProductsRetrieved.CurrentPage,
                    SelectedId = selectedId
                };

                model = GridHelper.GetStartEndPage<InvestorConfigurationViewModel>( model, pageSize );

                return PartialView( "SystemAdmin/InvestorConfiguration/_investorgridresult", model );
            }
            catch (Exception exception)
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "InvestorConfigurationController::GridResult", exception, Guid.Empty, _userAccountId );
                return ShowErrorMessage();             
            }          
        }

        [HttpGet]
        public ActionResult InvestorDetails( int investorId = -1 )
        {           
            Investor investor = null;

            if (investorId == -1) // if user is adding new investor
            {
                investor = new Investor
                {
                    InvestorId = -1                                                 
                };

                FillInvestorExtensionsList(investor);
                
            }
            else if (investorId > 0)
            {
                var retrieveInvestorDetails = new RetrieveInvestorDetails { InvestorId = investorId };
                investor = _productServiceFacade.RetrieveInvestorDetails(retrieveInvestorDetails);
                if (investor != null)
                {
                    bool extensionsFormed = FillInvestorExtensionsList(investor);
                    if (!extensionsFormed)
                    {
                        TraceHelper.Warning(TraceCategory.LoanCenter, "Error occured, InvestorExtensions didn't load properly - InvestorConfigurationController::InvestorProductDetails[GET]", Guid.Empty, _userAccountId);
                        return ShowErrorMessage();
                    }
                }
            }
           

            if ( investor == null )
            {
                TraceHelper.Warning( TraceCategory.LoanCenter, "Error occured - InvestorConfigurationController::InvestorProductDetails[GET]", Guid.Empty, _userAccountId );
                return ShowErrorMessage();
            }

                                             
            return PartialView( "SystemAdmin/InvestorConfiguration/_investordetails", investor );

        }

       

        private bool FillInvestorExtensionsList(Investor investor)
        {
            if (_extensionDaysLookup == null || !(_extensionDaysLookup.Count > 0)
                || _extensionPoliciesLookup == null || !(_extensionPoliciesLookup.Count > 0))
            {
                return false;
            }

            int extensionDays = _extensionDaysLookup.Count;
            int extensionPolicies = _extensionPoliciesLookup.Count;
            int numberOfExts = extensionDays * extensionPolicies;

            if (investor.Extensions != null  && investor.Extensions.Count == numberOfExts 
                && investor.Extensions.Select(e => e.ExPolicyNthTime).Distinct().Count() == extensionPolicies 
                && investor.Extensions.Select(e => e.Day).Distinct().Count() == extensionDays)
            {

                // Assign ExPolicyName && DayName attribute since they aren't stored in InvestorExtension table
                foreach (var extP in _extensionPoliciesLookup)
                {
                    foreach (var extDay in _extensionDaysLookup)
                    {
                        var extension = investor.Extensions.FirstOrDefault(e => e.ExPolicyNthTime == extP.Value && e.Day == extDay.Value);
                        if (extension == null)
                        {
                           return FormDefaultExtensions(investor, numberOfExts); // OR return false; ?
                        }
                        extension.ExPolicyName = extP.Name;
                        extension.DayName = extDay.Name;                      
                    }
                        
                }
               
                return true;
            }

            return FormDefaultExtensions(investor, numberOfExts);
        }

        private bool FormDefaultExtensions(Investor investor, int numberOfExts)
        {
            var defaultInvestorExtensionList = new List<InvestorExtension>();

            foreach (var extP in _extensionPoliciesLookup)
            {
                defaultInvestorExtensionList.AddRange(
                    _extensionDaysLookup.Select(item => new InvestorExtension
                    {
                        Day = item.Value,
                        DayName = item.Name,
                        ExPolicyName = extP.Name,
                        ExPolicyNthTime = extP.Value
                    }).ToList());
            }


            investor.Extensions = defaultInvestorExtensionList;

            return numberOfExts == defaultInvestorExtensionList.Count;
        }


        [HttpPost]
        public ActionResult InvestorDetails( Investor investor )
        {
            try
            {
                bool isUpdated = false;
                if ( ModelState.IsValid )
                {
                    isUpdated = _productServiceFacade.InvestorInsertOrUpdate( new InvestorInsertOrUpdate
                    {
                        Investor = investor,
                        UserAccountId = _userAccountId
                    } );              
                }

                return Json( new { success = true, isUpdated } );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "InvestorConfigurationController::InvestorDetails[POST]", exception, Guid.Empty, _userAccountId );
                return Json( new { success = false } );
            }
        }

        [HttpGet]
        public ActionResult InvestorProductDetails( int investorId, int investorProductId = -1 )
        {
            try
            {
                var investorRulesConfiguration = _productServiceFacade.RetrieveInvestorRulesConfiguration();
                var retrieveInvestorProductDetails = new RetrieveInvestorProductDetails { InvestorProductId = investorProductId };


                var investorProduct = investorProductId == -1 ?
                    new InvestorProduct
                    {
                        InvestorProductId = -1,
                        InvestorId = investorId,
                        AusTypes = new List<AusType>(),
                        CDTIPricingTypes = new List<PricingType>(),
                        InvestorProductRule = new InvestorProductRule()
                    } :
                    _productServiceFacade.RetrieveInvestorProductDetails( retrieveInvestorProductDetails );


                if ( investorRulesConfiguration == null || investorProduct == null || ( investorProduct.InvestorProductId != -1 && investorProduct.InvestorProductRule == null ) )
                {
                    return ShowErrorMessage();
                }

                var investorProductDetailsViewModel = new InvestorProductDetailsViewModel
                {
                    InvestorProduct = investorProduct,
                    InvestorRules = investorRulesConfiguration.Select( r => new SelectListItem
                    {
                        Value = r.InvestorRulesConfigurationId.ToString(),
                        Text = r.Description,
                        Selected = investorProduct.InvestorProductRule != null && r.InvestorRulesConfigurationId == investorProduct.InvestorProductRule.InvestorRulesConfigurationId
                    } ).ToList(),
                    InvestorWebsiteUrl = investorProduct.InvestorWebsiteURL
                };

                return PartialView( "SystemAdmin/InvestorConfiguration/_investorproductdetails", investorProductDetailsViewModel );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "InvestorConfigurationController::InvestorProductDetails[GET]", exception, Guid.Empty, _userAccountId );
                return ShowErrorMessage();
            }          
        }
        [HttpPost]
        public ActionResult InvestorProductDetails( InvestorProductDetailsViewModel model )
        {
            bool isUpdated = false;
            try
            {
              
                if (ModelState.IsValid)
                {
                    if (model.InvestorProduct.DefaultPricing != PricingType.None &&
                        model.InvestorProduct.CDTIPricingTypes != null &&
                        model.InvestorProduct.CDTIPricingTypes.Contains( model.InvestorProduct.DefaultPricing ) &&
                        model.InvestorProduct.AusTypes != null && model.InvestorProduct.AusTypes.Count > 0)
                    {
                        model.InvestorProduct.InvestorWebsiteURL = model.InvestorWebsiteUrl;
                        isUpdated = _productServiceFacade.InvestorProductInsertOrUpdate( new InvestorProductInsertOrUpdate
                            {
                                InvestorProduct = model.InvestorProduct,
                                UserAccountId = _userAccountId
                            } );
                    }
                    return Json(new { success = true, isUpdated });
                }
               
            }
            catch (Exception exception)
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "InvestorConfigurationController::InvestorProductDetails[POST]", exception, Guid.Empty, _userAccountId );
                return Json( new { success = false } );
            }
            return Json(new
            {
                success = false,
                errors = ModelState.Keys.SelectMany(k => ModelState[k].Errors)
                                .Select(m => m.ErrorMessage).ToArray()
            });
        }

        [HttpGet]
        public ActionResult InvestorHistory( int investorId = -1 )
        {
            try
            {
                var retrieveInvestorHistory = new RetrieveInvestorHistory { InvestorId = investorId };
                var investorHistory = _productServiceFacade.RetrieveInvestorHistory( retrieveInvestorHistory );

                if ( investorHistory == null )
                {
                    throw new NullReferenceException( "Investor history is required!" );
                }

                var investorHistoryViewModel = new InvestorHistoryViewModel { InvestorHistory = investorHistory };

                return PartialView( "SystemAdmin/InvestorConfiguration/_investorhistory", investorHistoryViewModel );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "InvestorConfigurationController::InvestorHistory[GET]", exception, Guid.Empty, _userAccountId );
                return ShowErrorMessage();
            }
        }

        [HttpGet]
        public ActionResult ShowConfirmationWarning( int investorId, string name, int investorProductId, bool activate )
        {
            ViewBag.InvestorId = investorId;
            ViewBag.InvestorProductId = investorProductId;
            ViewBag.Activate = activate;
            ViewBag.Name = name; 
            return PartialView( "SystemAdmin/InvestorConfiguration/_investorwarningmessage" );
        }

        /// <summary>
        /// Activates or deactivates Investor or Investor Product based on parameters. If investorProductId is -1 then it's Investor
        /// </summary>
        /// <param name="investorId"></param>
        /// <param name="investorProductId"></param>
        /// <param name="activate"></param>
        /// <param name="isDelete"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult ActivateDeactivate(int investorId, int investorProductId, bool activate, bool isDelete = false)
        {
            bool isUpdated = false;

            if (investorProductId == -1)
            {
            var investorDeActivateOrDelete = new InvestorDeActivateOrDelete
            {
                Activate = activate,
                InvestorId = investorId,
                UserAccountId = _userAccountId,
                IsDelete = isDelete
            };

                isUpdated = _productServiceFacade.InvestorDeActivateOrDelete(investorDeActivateOrDelete);
            }
            else if (investorProductId > 0)
            {
                var investorProductActivate = new InvestorProductDeActivateOrDelete
            {
                Activate = activate,
                InvestorId = investorId,
                InvestorProductId = investorProductId,
                    UserAccountId = _userAccountId,
                    IsDelete = isDelete
            };           

                isUpdated = _productServiceFacade.InvestorProductDeActivateOrDelete(investorProductActivate);
            }                
                

            return Json( new { success = true, isUpdated } );
        }

        [HttpPost]
        public ActionResult CheckIsInvestorProductDuplicate( string ruCode )
        {
            try
            {
                if ( string.IsNullOrEmpty( ruCode ) )
                {
                    return Json( new { success = false } );
                }

                var checkIsInvestorProductDuplicate = new CheckIsInvestorProductDuplicate
                {
                    RuCode = ruCode,
                    UserAccountId = _userAccountId
                };

                bool? isDuplicate = _productServiceFacade.CheckIsInvestorProductDuplicate( checkIsInvestorProductDuplicate );
            

                return Json( new { success = isDuplicate != null, isDuplicate = isDuplicate } );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "InvestorConfigurationController::CheckIsInvestorProductDuplicate", exception, Guid.Empty, _userAccountId );
                return Json( new { success = false } );
            }
        }

        [HttpPost]
        public ActionResult CheckIsInvestorDuplicate( string investorName )
        {
            try
            {
                if ( string.IsNullOrEmpty( investorName ) )
                {
                    return Json( new { success = false } );
                }

                var checkIsInvestorDuplicate = new CheckIsInvestorDuplicate
                {             
                    InvestorName = investorName,
                    UserAccountId = _userAccountId
                };

                bool? isDuplicate = _productServiceFacade.CheckIsInvestorDuplicate( checkIsInvestorDuplicate );             

                return Json( new { success = isDuplicate != null, isDuplicate = isDuplicate } );
            }
            catch ( Exception exception )
            {
                TraceHelper.Error( TraceCategory.LoanCenter, "InvestorConfigurationController::CheckIsInvestorDuplicate", exception, Guid.Empty, _userAccountId );
                return Json( new { success = false } );
            }
        }

        private ActionResult ShowErrorMessage( string message = "", string title = "" )
        {
            var messageModel = new ErrorMessage
            {
                Message = string.IsNullOrEmpty( message ) ? "An internal Server error occurred." : message,
                Title = string.IsNullOrEmpty( title ) ? "Internal Server Error" : title
            };

            return PartialView( "ErrorViews/LoanCenterError", messageModel );
        }
    }
}
