using System.Xml.Serialization;
using System.Runtime.Serialization;
using System;
using MML.Common;
using System.ServiceModel;
using System.Collections.Generic;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "OrderRequestedViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "OrderRequestedViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class OrderRequestedViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "RequestedOrders" )]
        [DataMember()]
        public List<RequestedOrdersView> RequestedOrders { get; set; }

        [XmlElement( ElementName = "LoanPurposeList" )]
        [DataMember()]
        public List<LoanTransactionType> LoanPurposeList { get; set; }
    }
}