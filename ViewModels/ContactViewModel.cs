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
    [XmlType( Namespace = Namespaces.Default, TypeName = "ContactViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "ContactViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class ContactViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "Contacts" )]
        [DataMember()]
        public List<MML.Contracts.ContactViewItem> Contacts
        {
            get;
            set;
        }

        [XmlElement( ElementName = "ProspectLO" )]
        [DataMember()]
        public List<SelectListItem> ProspectLO
        {
            get;
            set;
        }

        [XmlElement( ElementName = "StatusList" )]
        [DataMember()]
        public List<SelectListItem> StatusList
        {
            get;
            set;
        }

        [XmlElement( ElementName = "ProspectLOConciergeList" )]
        [DataMember()]
        public List<SelectListItem> ProspectLOConciergeList
        {
            get;
            set;
        }

        [XmlElement(ElementName = "ProspectConciergeFilterList")]
        [DataMember]
        public List<SelectListItem> ProspectConciergeFilterList
        {
            get;
            set;
        }

        [XmlElement( ElementName = "ProspectStatusList" )]
        [DataMember()]
        public List<SelectListItem> ProspectStatusList
        {
            get;
            set;
        }

        [XmlElement( ElementName = "LoanPurposeList" )]
        [DataMember()]
        public List<LoanTransactionType> LoanPurposeList 
        { 
            get; 
            set; 
        }
    }
}