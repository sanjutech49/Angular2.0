using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MML.Web.LoanCenter.Models.SecureLink
{
    public class AuthenticationViewModel
    {
        public bool isSecureLinkTestMode { get; set; }
        public bool isTokenValid { get; set; }
        public JObject authenticationViewModel { get; set; }
    }
}