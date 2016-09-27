using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MML.Web.LoanCenter.Controllers
{
    public class AuthController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Get()
        {
            return Request.CreateErrorResponse(HttpStatusCode.MethodNotAllowed, new InvalidOperationException("Please use HttpPost for your operation."));
        }

        [HttpPost]
        public HttpResponseMessage Post([FromBody] AuthRequestMessage request)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new AuthResponseMessage() { TokenValid = true, RedirectUrl = "" });
        }
    }

    public class AuthRequestMessage
    {
        public string SPAuthToken { get; set; }
    }

    public class AuthResponseMessage
    {
        public bool TokenValid { get; set; }
        public string RedirectUrl { get; set; }
    }
}
