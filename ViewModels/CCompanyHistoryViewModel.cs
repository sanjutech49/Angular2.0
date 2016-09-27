using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Xml.Serialization;
using MML.Contracts;
using MML.Contacts;
namespace MML.Web.LoanCenter.ViewModels
{
    public class CCompanyHistoryViewModel
    {
        [XmlElement( ElementName = "CompanyHistoryItems" )]
        [DataMember]
        public List<CCompanyHistory> CompanyHistoryItems
        {
            get;
            set;
        }        
    }
}