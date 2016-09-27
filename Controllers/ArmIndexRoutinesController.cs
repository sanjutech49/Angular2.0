using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MML.Web.Facade;
using MML.Contracts;
using System.Net;

namespace MML.Web.LoanCenter.Controllers
{
    public class ArmIndexRoutinesController : Controller
    {
        //
        // GET: /ArmIndexRoutines/

        public ActionResult GetArmIndexRoutines()
        {
            List<ArmIndex> viewModel = RetrieveIndices();

            
            return PartialView( "~/Views/Shared/SystemAdmin/ArmIndexRoutines/ArmIndexRoutines.cshtml", viewModel);
        }

        [HttpPost]
        public ActionResult RetrieveCurrentIndices()
        {
            
            try
            {
                List<ArmIndex> indices = RetrieveIndices( true );

                if ( Request.IsAjaxRequest() )
                {
                    return Json( indices );

                }
                else
                {
                    Response.StatusCode = ( int )HttpStatusCode.BadRequest;
                    return Content( "Action allowed only for ajax requests", "text/plain" );
                }
            }
            catch
            {
                Response.StatusCode = ( int )HttpStatusCode.InternalServerError;
                return Content( "Internal server error occured", "text/plain" );
            }
        }

        private List<ArmIndex> RetrieveIndices( bool retrieveNew = false)
        {
            List<ArmIndex> indices = new List<ArmIndex>();

            ArmIndex libor = PricingServiceFacade.RetrieveArmIndex( IndexType.Libor, retrieveNew );
            ArmIndex treasury = PricingServiceFacade.RetrieveArmIndex( IndexType.Treasury, retrieveNew );

            if ( libor != null )
            {
                indices.Add( libor );
            }
            if ( treasury != null )
            {
                indices.Add( treasury );
            }

            return indices;
        }
    }
}
