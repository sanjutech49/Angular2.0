using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "CancelViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "CancelViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class CancelViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "CancelItems" )]
        [DataMember]
        public List<Contracts.CancelViewItem> CancelItems
        {
            get;
            set;
        }

        [XmlElement( ElementName = "ActivityType" )]
        [DataMember]
        public Int32 ActivityType
        {
            get;
            set;
        }

        [XmlElement(ElementName = "BorrowerStatusList")]
        [DataMember()]
        public List<BorrowerStatusType> BorrowerStatusList { get; set; }

             
    }
}