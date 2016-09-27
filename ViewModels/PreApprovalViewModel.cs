using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Web;
using System.Web.WebPages.Html;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "PreApprovalViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "PreApprovalViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class PreApprovalViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "PreApprovalItems" )]
        [DataMember()]
        public List<PreApprovalViewItem> PreApprovalItems
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