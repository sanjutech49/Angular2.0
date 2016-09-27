using System.Xml.Serialization;
using System.Runtime.Serialization;
using System.ServiceModel;
using System;
using MML.Common;
using System.Collections.Generic;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "OrderProcessedViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "OrderProcessedViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class OrderProcessedViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "ProcessedOrders" )]
        [DataMember()]
        public List<ProcessedOrdersView> ProcessedOrders { get; set; }
    }
}