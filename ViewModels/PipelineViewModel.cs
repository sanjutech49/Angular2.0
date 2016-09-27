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
    [XmlType( Namespace = Namespaces.Default, TypeName = "PipelineViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "PipelineViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class PipelineViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "PipelineItems" )]
        [DataMember()]
        public List<PipelineViewItem> PipelineItems { get; set; }

        [XmlElement( ElementName = "ActivityType" )]
        [DataMember()]
        public Int32 ActivityType { get; set; }

        [XmlElement( ElementName = "ActivityTypeList" )]
        [DataMember()]
        public List<ActivityType> ActivityTypeList { get; set; }

        [XmlElement( ElementName = "LoanPurposeList" )]
        [DataMember()]
        public List<LoanTransactionType> LoanPurposeList { get; set; }

        [XmlElement(ElementName = "BorrowerStatusList")]
        [DataMember()]
        public List<BorrowerStatusType> BorrowerStatusList { get; set; }
    }
}