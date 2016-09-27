using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "CompletedLoansViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "CompletedLoansViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class CompletedLoansViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "CompletedLoansItems" )]
        [DataMember]
        public List<Contracts.CompletedLoansViewItem> CompletedLoansItems
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

        [XmlElement( ElementName = "ActivityTypeList" )]
        [DataMember()]
        public List<ActivityType> ActivityTypeList
        {
            get;
            set;
        }

        [XmlElement(ElementName = "BorrowerStatusList")]
        [DataMember()]
        public List<BorrowerStatusType> BorrowerStatusList { get; set; }

             
    }
}