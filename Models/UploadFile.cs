using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Telerik.Web.Mvc.UI;

namespace MML.Web.LoanCenter.Models
{
    [Serializable]
    public class UploadFile
    {
        public List<DropDownItem> DocumentCategories { get; set; }
    }
}