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
    [XmlType( Namespace = Namespaces.Default, TypeName = "GridCommonBaseViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "GridCommonBaseViewModel" )]
    [XmlSerializerFormat]
    [Serializable]
    public class GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "TotalItems" )]
        [DataMember()]
        public Int32 TotalItems { get; set; }

        [XmlElement( ElementName = "PageCount" )]
        [DataMember()]
        public Int32 PageCount { get; set; }

        [XmlElement( ElementName = "CurrentPage" )]
        [DataMember()]
        public Int32 CurrentPage { get; set; }

        [XmlElement( ElementName = "StartPage" )]
        [DataMember()]
        public Int32 StartPage { get; set; }

        [XmlElement( ElementName = "EndPage" )]
        [DataMember()]
        public Int32 EndPage { get; set; }

        [XmlElement( ElementName = "LastPageDots" )]
        [DataMember()]
        public Boolean LastPageDots { get; set; }

        [XmlElement( ElementName = "PageGroups" )]
        [DataMember()]
        public Int32 PageGroups { get; set; }

        [XmlElement( ElementName = "LastPageItems" )]
        [DataMember()]
        public Int32 LastPageItems { get; set; }
    }
}