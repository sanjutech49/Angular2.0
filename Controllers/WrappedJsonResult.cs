using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MML.Web.LoanCenter.Controllers
{
    public class WrappedJsonResult : JsonResult
    {
        public override void ExecuteResult( ControllerContext context )
        {
            context.HttpContext.Response.Write( "<html><body><textarea id=\"jsonResult\" name=\"jsonResult\">" );
            base.ExecuteResult( context );
            context.HttpContext.Response.Write( "</textarea></body></html>" );
            context.HttpContext.Response.ContentType = "text/html";
        }
    }
}