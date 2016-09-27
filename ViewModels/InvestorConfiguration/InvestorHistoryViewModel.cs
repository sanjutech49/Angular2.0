using System;
using System.Collections.Generic;
using System.Xml.Serialization;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels.InvestorConfiguration
{
    [XmlType]
    [Serializable]
    public class InvestorHistoryViewModel
    {    
        public List<InvestorHistory> InvestorHistory { get; set; }      
    }
}