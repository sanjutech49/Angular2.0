using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Utilities;

namespace MML.Web.LoanCenter.Controllers
{
    public class ValidationController : Controller
    {
        //
        // GET: /Validation/

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Credit card number validation
        /// </summary>
        /// <param name="cardType">Visa, Master Card, Discover</param>
        /// <param name="cardNumber">Credit card number</param>
        /// <returns></returns>
        public JsonResult ValidateCreditCardNumber( int cardType, string cardNumber )
        {
            ValidationHelper validationHelper = new ValidationHelper();
            bool isValid = validationHelper.ValidateCreditCard( cardNumber, cardType );

            return Json(
                new { isValidCreditCardNumber = isValid },
                JsonRequestBehavior.AllowGet
            );
        }


        /// <summary>
        /// Get zip data
        /// </summary>
        /// <param name="zip">zip code</param>
        /// <returns></returns>
        public JsonResult GetZipData( string zip )
        {
            return Json( UsaZipFacade.GetZipData( zip, true ) );
        }
    }
}
