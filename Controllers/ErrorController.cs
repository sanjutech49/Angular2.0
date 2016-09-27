using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Unauthorized()
        {
            var messageModel = new ErrorMessage
                                            {
                                                Message = "HTTP Error 401 - Unauthorized.",
                                                Title = "401 Unauthorized"
                                            };
            Response.TrySkipIisCustomErrors = true;
            Response.StatusCode = ( int )HttpStatusCode.Unauthorized;
            return View( "ErrorViews/CustomError", messageModel );
        }
        public ActionResult NotFound()
        {
            var messageModel = new ErrorMessage
                                            {
                                                Message = "The URL you have requested was not found.",
                                                Title = "404 Not Found"
                                            };

            Response.TrySkipIisCustomErrors = true;
            Response.StatusCode = ( int )HttpStatusCode.NotFound;
            return View( "ErrorViews/CustomError", messageModel );
        }
        public ActionResult InternalServerError()
        {
            var messageModel = new ErrorMessage
                                            {
                                                Message = "An internal Server error occurred",
                                                Title = "500 Internal Server Error" 
                                            };
            Response.TrySkipIisCustomErrors = true;
            Response.StatusCode = ( int )HttpStatusCode.InternalServerError;
            return View( "ErrorViews/CustomError", messageModel );
        }
    }
}
