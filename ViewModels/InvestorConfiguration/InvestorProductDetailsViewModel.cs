using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web.Mvc;
using System.Xml.Serialization;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels.InvestorConfiguration
{

    [XmlType]
    [Serializable]
    public class InvestorProductDetailsViewModel
    {
        public InvestorProduct InvestorProduct { get; set; }
        public List<SelectListItem> InvestorRules { get; set; }

        [DisplayName( "Investor Website URL" )]
        //[Helpers.Attributes.UrlAttribute]
        public string InvestorWebsiteUrl { get; set; }
    }
}