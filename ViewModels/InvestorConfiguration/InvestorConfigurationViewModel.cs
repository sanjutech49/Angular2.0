using System;
using System.Collections.Generic;
using System.Xml.Serialization;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels.InvestorConfiguration
{
    [XmlType]
    [Serializable]
    public class InvestorConfigurationViewModel : GridCommonBaseViewModel
    {   
        public List<Investor> Investors  { get; set; }    
        public bool? Active { get; set; }
        public int? SelectedId { get; set; }
    }
}