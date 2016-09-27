using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "AppraisalBillingHistoryViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "AppraisalBillingHistoryViewModel" )]
    [Serializable]
    public class AppraisalBillingHistoryViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "CurrentDate" )]
        [DataMember()]
        public DateTime CurrentDate
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "OrderAppraisalBillingHistories" )]
        [DataMember()]
        public List<OrderAppraisalBillingHistory> OrderAppraisalBillingHistories
        {
            get;
            set;
        }
    }
}