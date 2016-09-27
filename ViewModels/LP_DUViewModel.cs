using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MML.Web.LoanCenter.ViewModels
{
    public class LP_DUViewModel
    {

        // Loan Prospector

        public string LP_ServiceEndpoint { get; set; }
        public string LP_Login { get; set; }
        public string LP_Password { get; set; }
        public string LP_CreditAgencyName { get; set; }
        public string LP_FindingsDocumentCategory { get; set; }
        public string LP_PdfConversionServiceUri { get; set; }


        //Desktop Underwriter
        public string DU_ServiceEndpoint { get; set; }
        public string DU_Login { get; set; }
        public string DU_Password { get; set; }
        public string DU_CreditAgencyName { get; set; }
        public string DU_CreditAgencyAccount { get; set; }
        public string DU_CreditAgencyPassword { get; set; }
        public string DU_FindingsDocumentCategory { get; set; }
        public string DU_PdfConversionServiceUri { get; set; }

    }
}
