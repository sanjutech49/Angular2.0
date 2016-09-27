using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    public class BorrowerDetailsViewModel
    {
        public BorrowerCollection Borrowers { get; set; }
        public bool CollapseDetails { get; set; }
        public Guid LoanID { get; set; }
    }
}