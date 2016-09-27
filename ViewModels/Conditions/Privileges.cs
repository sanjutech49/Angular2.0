using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MML.Web.LoanCenter.ViewModels
{
    [Serializable]
    public sealed class Privileges
    {
        public bool Delete { get; set; }
        public bool ViewTab { get; set; }
        public bool ChangeItemStatus { get; set; }
    }
}