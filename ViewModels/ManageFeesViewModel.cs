using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using System.Runtime.Serialization;
using MML.Common;
using System.Collections.ObjectModel;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "ManageFeesViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "ManageFeesViewModel" )]
    public class ManageFeesViewModel
    {
        [XmlElement( ElementName = "TitleInformation" )]
        [DataMember]
        public String TitleInformation { get; set; }

        [XmlElement( ElementName = "LeadSourceInformation" )]
        [DataMember]
        public String LeadSourceInformation { get; set; }

        [XmlElement( ElementName = "TitleAndEscrow" )]
        [DataMember]
        public TitleAndEscrow TitleAndEscrow { get; set; }

        [XmlElement( ElementName = "FeeTitles801" )]
        [DataMember]
        public List<string> FeeTitles801 { get; set; }

        [XmlElement( ElementName = "FeeTitles804To820" )]
        [DataMember]
        public List<string> FeeTitles804To820 { get; set; }

        [XmlElement( ElementName = "FeeTitles900" )]
        [DataMember]
        public List<string> FeeTitles900 { get; set; }

        [XmlElement( ElementName = "FeeTitles1000" )]
        [DataMember]
        public List<string> FeeTitles1000 { get; set; }

        [XmlElement( ElementName = "FeeTitles1100" )]
        [DataMember]
        public List<string> FeeTitles1100 { get; set; }

        [XmlElement( ElementName = "FeeTitles1200" )]
        [DataMember]
        public List<string> FeeTitles1200 { get; set; }

        [XmlElement( ElementName = "FeeTitles1302To1307" )]
        [DataMember]
        public List<string> FeeTitles1302To1307 { get; set; }

        [XmlElement( ElementName = "FeeTitles1308To1311" )]
        [DataMember]
        public List<string> FeeTitles1308To1311 { get; set; }
    }
}