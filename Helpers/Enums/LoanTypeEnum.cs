using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Helpers.Enums
{
    public enum LoanType
    {
        [StringValue("Pre-Purchase")]
        PrePurchase = 1, 

        [StringValue("Purchase")]
        Purchase, 

        [StringValue("Refinance")]
        Refinance
    }
}