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
    [XmlTypeAttribute( Namespace = Namespaces.Default, TypeName = "ItemViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "ItemViewModel" )]
    [Serializable]
    public class RateOptionItemViewModel : GridCommonBaseViewModel
    {
        [XmlElement( ElementName = "SentEmailId" )]
        [DataMember()]
        public Int32 SentEmailId { get; set; }

        [XmlElement( ElementName = "ContactId" )]
        [DataMember()]
        public Int32 ContactId { get; set; }

        [XmlElement( ElementName = "DateCreated" )]
        [DataMember]
        public DateTime DateCreated { get; set; }

        [XmlElement( ElementName = "LoanAmount" )]
        [DataMember]
        public decimal LoanAmount { get; set; }

        [XmlElement( ElementName = "Rate" )]
        [DataMember]
        public double Rate { get; set; }

        [XmlElement( ElementName = "Apr" )]
        [DataMember]
        public double Apr { get; set; }

        [XmlElement( ElementName = "Points" )]
        [DataMember]
        public double Points { get; set; }

        [XmlElement( ElementName = "PointsPercents" )]
        [DataMember]
        public double PointsPercents { get; set; }

        [XmlElement( ElementName = "Product" )]
        [DataMember]
        public string Product { get; set; }

        [XmlElement( ElementName = "DistributionList" )]
        [DataMember]
        public string DistributionList { get; set; }

        [XmlElement( ElementName = "LTV" )]
        [DataMember]
        public double LTV { get; set; }

        [XmlElement( ElementName = "CLTV" )]
        [DataMember]
        public double CLTV { get; set; }

        [XmlElement( ElementName = "IsWhatIfRateOption" )]
        [DataMember()]
        public bool? IsWhatIfRateOption { get; set; }

        [XmlElement( ElementName = "DebtToIncomeRatio" )]
        [DataMember()]
        public double DebtToIncomeRatio
        {
            get;
            set;
        }

        [XmlElement( ElementName = "ReportRepositoryItemId" )]
        [DataMember()]
        public Guid? ReportRepositoryItemId { get; set; }
    }
}