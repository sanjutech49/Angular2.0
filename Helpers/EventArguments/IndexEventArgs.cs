using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.EventArguments
{
    /// <summary>
    /// 
    /// </summary>
    public class IndexEventArgs : EventArgs
    {
        /// <summary>
        /// 
        /// </summary>
        public IndexViewModel IndexViewModel { get; set; }
    }
}