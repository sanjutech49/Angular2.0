using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "PendingApprovalViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "PendingApprovalViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class PendingApprovalViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "PendingApprovalItems" )]
        [DataMember()]
        public List<PendingApprovalViewItem> PendingApprovalItems
        {
            get;
            set;
        }

        [XmlElement( ElementName = "ActivityType" )]
        [DataMember()]
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
    }
}