using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts;
using MML.Contracts.DomainModels;
using System.Web.Mvc;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "LoanServicesViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "LoanServicesViewModel" )]
    [Serializable]
    public class LoanServicesViewModel
    {
        [XmlElement( ElementName = "LoanServiceList" )]
        [DataMember()]
        public List<LoanServiceContract> LoanServiceList
        {
            get;
            set;
        }

        [XmlElement( ElementName = "TitleInformation" )]
        [DataMember]
        public String TitleInformation
        {
            get;
            set;
        }

        [XmlElement( ElementName = "LeadSourceInformation" )]
        [DataMember]
        public String LeadSourceInformation
        {
            get;
            set;
        }

        [XmlElement( ElementName = "Actions" )]
        [DataMember]
        public List<SelectListItem> Actions
        {
            get;
            set;
        }

        [XmlElement( "AvailableFilters" )]
        [DataMember]
        public LoanServiceFiltersContract AvailableFilters 
        { 
            get; 
            set; 
        }

        [XmlElement( "SelectedFilter" )]
        [DataMember]
        public LoanServiceFilterContract SelectedFilter
        {
            get;
            set;
        }
    }
}