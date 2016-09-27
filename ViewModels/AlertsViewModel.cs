using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "AlertsViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract(Namespace = Namespaces.Default, Name = "AlertsViewModel")]
    [XmlSerializerFormat]
    [Serializable]
    public class AlertsViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "AlertItems" )]
        [DataMember]
        public List<Contracts.AlertViewItem> AlertItems
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

        [XmlElement(ElementName = "LoanPurposeList")]
        [DataMember()]
        public List<LoanTransactionType> LoanPurposeList { get; set; }

        [XmlElement( ElementName = "ActivityTypeList" )]
        [DataMember()]
        public List<ActivityType> ActivityTypeList { get; set; }

        [XmlElement( ElementName = "NumberOfAlerts" )]
        [DataMember]
        public Int32 NumberOfAlerts
        {
            get;
            set;
        }
    }
}