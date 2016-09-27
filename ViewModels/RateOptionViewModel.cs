using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using MML.iMP.Common;
using System.Runtime.Serialization;
using Telerik.Web.Mvc.UI;
using System.ComponentModel.DataAnnotations;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "UploadFileViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "UploadFileViewModel" )]
    [Serializable]
    public class RateOptionViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "CollapseDetails" )]
        [DataMember()]
        public bool CollapseDetails { get; set; }

        [XmlElement( ElementName = "BuiltInMode" )]
        [DataMember()]
        public bool BuiltInMode { get; set; }

        [XmlElement( ElementName = "SentEmailIdCurrent" )]
        [DataMember()]
        public Int32 SentEmailIdCurrent { get; set; }

        [XmlElement( ElementName = "SentEmailNote" )]
        [DataMember()]
        public string SentEmailNote { get; set; }
        
        [XmlElement( ElementName = "RateOptionList" )]
        [DataMember()]
        public List<RateOptionItemViewModel> RateOptionList
        {
            get;
            set;
        }


        [XmlElement( ElementName = "LoanAmount" )]
        [DataMember]
        public decimal LoanAmount { get; set; }

        [XmlElement( ElementName = "LTV" )]
        [DataMember]
        public double LTV { get; set; }

        [XmlElement( ElementName = "CLTV" )]
        [DataMember]
        public double CLTV { get; set; }
    }
}