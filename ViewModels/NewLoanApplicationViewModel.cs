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
    [XmlType( Namespace = Namespaces.Default, TypeName = "NewLoanApplicationViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "NewLoanApplicationViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class NewLoanApplicationViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "NewLoanApplicationViewItems" )]
        [DataMember()]
        public List<MML.Contracts.NewLoanApplicationViewItem> NewLoanApplicationViewItems
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

        [XmlElement( ElementName = "LoanPurposeList" )]
        [DataMember()]
        public List<LoanTransactionType> LoanPurposeList { get; set; }

        [XmlElement( ElementName = "BorrowerStatusList" )]
        [DataMember()]
        public List<BorrowerStatusType> BorrowerStatusList { get; set; }
    }
}