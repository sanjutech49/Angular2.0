using System.Xml.Serialization;
using System.Runtime.Serialization;
using System;
using MML.Common;
using System.ServiceModel;
using System.Collections.Generic;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "OrderExceptionViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "OrderExceptionViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class OrderExceptionViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "Exceptions" )]
        [DataMember()]
        public List<OrderExceptionView> Exceptions { get; set; }
    }
}