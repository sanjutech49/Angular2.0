using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using MML.Common;
using MML.Contracts;
using MML.iMP.Aus.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.ActionFilters;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Controllers
{
    public class AusController : Controller
    {
        private const string DEFAULT_AUS = "DEFAULT_AUS";
        //
        // GET: /Aus/
        [OutputCache( NoStore = true, Duration = 0, VaryByParam = "*" )]
        [CompressFilter]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Show Upload File
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ShowFannieMaeDu(string LoanId)
        {
            var loanId = Guid.Empty;
            var serviceTrackingModel = new List<ServiceTrackingContract>();
            var serviceValidationModel = new List<ServiceValidationContract>();
            var caseids = new List<string>();

            var fannieMaeDuViewModel = new FannieMaeDuViewModel();

            if (Guid.TryParse(LoanId, out loanId))
            {
                fannieMaeDuViewModel.LoanId = loanId;

                serviceTrackingModel = AUSServiceFacade.ServiceTrackingRetrieveAllByLoanId(loanId, AusType.DU);
                serviceValidationModel = AUSServiceFacade.ServiceValidationRetrieveAllByLoanId(loanId);

                if (serviceTrackingModel != null)
                {
                    fannieMaeDuViewModel.DuResults = serviceTrackingModel;
                    fannieMaeDuViewModel.DuResultsTitle = serviceTrackingModel.FirstOrDefault();

                    if (fannieMaeDuViewModel.DuResultsTitle == null)
                        fannieMaeDuViewModel.ProcessingItem = false;
                    else
                        fannieMaeDuViewModel.ProcessingItem = fannieMaeDuViewModel.DuResultsTitle.EndTime == null ||
                            fannieMaeDuViewModel.DuResultsTitle.EndTime == DateTime.MinValue;
                }
                if (serviceValidationModel != null)
                    fannieMaeDuViewModel.DuValidation = serviceValidationModel;

                // get list of unique caseids
                caseids = (from st in serviceTrackingModel orderby st.StartTime.Value descending /* where st.EndTime.HasValue */ select st.CaseId).Distinct().ToList<string>();

                fannieMaeDuViewModel.CaseIds = caseids;
            }
            else
            {
                fannieMaeDuViewModel.LoanId = Guid.Empty;
            }

            return PartialView("Aus/_fannieMaeDu", fannieMaeDuViewModel);
        }

        [HttpGet]
        public ActionResult ShowFreddieMacLp(string LoanId)
        {
            var loanId = Guid.Empty;
            var serviceTrackingModel = new List<ServiceTrackingContract>();
            var serviceValidationModel = new List<ServiceValidationContract>();
            var caseids = new List<string>();


            var freddieMacLpViewModel = new FreddieMacLpViewModel();

            if (Guid.TryParse(LoanId, out loanId))
            {
                freddieMacLpViewModel.LoanId = loanId;

                serviceTrackingModel = AUSServiceFacade.ServiceTrackingRetrieveAllByLoanId(loanId, AusType.LP);
                serviceValidationModel = AUSServiceFacade.ServiceValidationRetrieveAllByLoanId(loanId);

                if (serviceTrackingModel != null)
                {
                    freddieMacLpViewModel.LpResults = serviceTrackingModel;
                    freddieMacLpViewModel.LpResultsTitle = serviceTrackingModel.FirstOrDefault();
                    if (freddieMacLpViewModel.LpResultsTitle == null)
                    {
                        freddieMacLpViewModel.ProcessingItem = false;
                    }
                    else if (freddieMacLpViewModel.LpResultsTitle.EndTime == null || freddieMacLpViewModel.LpResultsTitle.EndTime == DateTime.MinValue)
                        freddieMacLpViewModel.ProcessingItem = true;
                    else
                        freddieMacLpViewModel.ProcessingItem = false;
                }
                if (serviceValidationModel != null)
                {
                    freddieMacLpViewModel.LpValidation = serviceValidationModel;
                }

                // get list of unique caseids
                caseids = (from st in serviceTrackingModel orderby st.StartTime.Value descending /* where st.EndTime.HasValue */ select st.CaseId).Distinct().ToList<string>();

                freddieMacLpViewModel.CaseIds = caseids;

            }
            else
            {
                freddieMacLpViewModel.LoanId = Guid.Empty;
            }

            return PartialView("Aus/_freddieMacLp", freddieMacLpViewModel);
        }

        // TODO: use cashing here
        [HttpGet]
        public ActionResult AUSCaseIDPrivilege()
        {
            // TODO: check if it is allowed to access this call by not auth user
            return Json(AccountHelper.HasPrivilege(PrivilegeName.AUSEditCase), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetUniqueCaseIds(Guid loanId, string integration)
        {
            var integrationType = GetIntegrationType(integration);
            
            var serviceTrack = AUSServiceFacade.ServiceTrackingRetrieveAllByLoanId(loanId, integrationType);

            var caseIds = (from st in serviceTrack where st.EndTime.HasValue && !string.IsNullOrEmpty(st.CaseId) orderby st.EndTime.Value descending select st.CaseId).Distinct();

            var output = new List<LoanCaseId>();
            // add a blank item
            output.Add(new LoanCaseId() { CaseId = string.Empty, isDefault = false });

            var isdef = true;
            foreach (var caseid in caseIds)
            {
                output.Add(new LoanCaseId() { isDefault = isdef, CaseId = caseid });
                isdef = false;
            }

            return Json (output, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetAllowedAusTypes(Guid loanId)
        {
            var output = new List<LoanAvailabeAus>();

            var resp = LoanServiceFacade.RetrieveAllowedAus(loanId);
            if (resp != null)
            {

                resp.Aus.ForEach(item => output.Add(new LoanAvailabeAus()
                {
                    AusType = item.ToString(),
                    Default = item == resp.Default
                }));

#region HACK
                //output.Clear();
                //output.Add(new LoanAvailabeAus() { AusType = "DU", Default = true });
                //output.Add(new LoanAvailabeAus() { AusType = "LP", Default = false });
#endregion
                return Json(output, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(false, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Update default AUS type for a loan 
        /// </summary>
        /// <param name="loanid">Loan Id</param>
        /// <param name="defaultAus">Deault AUS type (DU, LP, etc..)</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateDefaultAus(Guid loanid, string defaultAus)
        {
            if (string.IsNullOrWhiteSpace(defaultAus))
                return Json(false, JsonRequestBehavior.AllowGet);

            var loanExtRef = new LoanExternalReference() { LoanId = loanid, Name = DEFAULT_AUS, Value = defaultAus };
            var result = LoanServiceFacade.UpdateLoanExternalReference(loanExtRef);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetVendorLoanIdForCase (Guid loanId, string integration, string caseId)
        {
            var integrationType = GetIntegrationType(integration);

            var serviceTrack = AUSServiceFacade.ServiceTrackingRetrieveAllByLoanId(loanId, integrationType);
            if (serviceTrack != null)
            {
                var vendorLoanId = (from st in serviceTrack where st.CaseId == caseId select st.VendorLoanId).FirstOrDefault();

                return Json(string.IsNullOrEmpty(vendorLoanId) ? string.Empty : vendorLoanId, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(string.Empty, JsonRequestBehavior.AllowGet);
        }

        private static AusType GetIntegrationType(string integration)
        {
            AusType integrationType;

            switch (integration)
            {
                case "DU":
                    integrationType = AusType.DU;
                    break;

                case "LP":
                    integrationType = AusType.LP;
                    break;

                default:
                    integrationType = AusType.NotSpecified;
                    break;
            }
            return integrationType;
        }
    }

    public class LoanCaseId
    {
        public string CaseId { get; set; }
        public bool isDefault { get; set; }
    }

    public class LoanAvailabeAus
    {
        public string AusType { get; set; }
        public bool Default { get; set; }
    }
}
