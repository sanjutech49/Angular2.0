using System.Xml.Serialization;
using System.Runtime.Serialization;
using System.ServiceModel;
using System;
using MML.Common;
using System.Collections.Generic;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "OrderDeliveredForReviewViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "OrderDeliveredForReviewViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class OrderDeliveredForReviewViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "DeliveredForReviewOrders" )]
        [DataMember()]
        public List<DeliveredForReviewView> DeliveredForReviewOrders { get; set; }
    }
}