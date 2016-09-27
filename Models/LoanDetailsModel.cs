using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using System.Runtime.Serialization;
using MML.Common;
using System.Collections.ObjectModel;
using MML.Contracts;
using Telerik.Web.Mvc.UI;
namespace MML.Web.LoanCenter.Models
{
    public class LoanDetailsModel : CommandHeader
    {
        [XmlElement( ElementName = "LoanId" )]
        [DataMember]
        public Guid? LoanId { get; set; }

        [XmlElement( ElementName = "ShowRedisclosureTab" )]
        [DataMember]
        public Boolean ShowRedisclosureTab { get; set; }

        [XmlElement(ElementName = "LoanSummaryObject")]
        [DataMember]
        public LoanSummary LoanSummaryObject { get; set; }
    }
}