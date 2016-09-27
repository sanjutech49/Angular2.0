using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using System.Runtime.Serialization;
using MML.Common;
using System.Collections.ObjectModel;
using MML.Contracts;
using Telerik.Web.Mvc.UI;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "ManageProspectsViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "ManageProspectsViewModel" )]
    public class ManageProspectsViewModel
    {

        public ManageProspectsViewModel()
        {

            this.Companies = new List<DropDownItem>();
            this.Branches = new List<DropDownItem>();
            this.Channels = new List<DropDownItem>();
            this.Divisions = new List<DropDownItem>();
            this.ConciergeInfoList = new List<ConciergeInfo>();
            this.LoaInfoList = new List<ConciergeInfo>();
        }

        [XmlElement( ElementName = "LoanId" )]
        [DataMember]
        public Guid LoanId { get; set; }

        [XmlElement( ElementName = "ProspectId" )]
        [DataMember]
        public Int32 ProspectId { get; set; }

        [XmlElement( ElementName = "TitleInformation" )]
        [DataMember]
        public String TitleInformation { get; set; }

        [XmlElement( ElementName = "LeadSourceInformation" )]
        [DataMember]
        public String LeadSourceInformation { get; set; }

        [XmlElement( ElementName = "Emails" )]
        [DataMember]
        public List<SentEmailItem> Emails { get; set; }

        [XmlElement( ElementName = "Statuses" )]
        [DataMember]
        public Collection<KeyValuePair<String, String>> Statuses { get; set; }

        [XmlElement( ElementName = "ConciergeInfoList" )]
        [DataMember]
        public List<ConciergeInfo> ConciergeInfoList { get; set; }

        [XmlElement( ElementName = "LoaInfoList" )]
        [DataMember]
        public List<ConciergeInfo> LoaInfoList { get; set; }

        [XmlElement( ElementName = "CallCenterInfoList" )]
        [DataMember]
        public Collection<CallCenterInfo> CallCenterInfoList { get; set; }

        [XmlElement( ElementName = "SelectedConcierge" )]
        [DataMember]
        public String SelectedConcierge{ get; set; }

        [XmlElement( ElementName = "SelectedLoa" )]
        [DataMember]
        public String SelectedLoa { get; set; }

        [XmlElement( ElementName = "SelectedCallCenter" )]
        [DataMember]
        public String SelectedCallCenter { get; set; }

        [XmlElement( ElementName = "SelectedStatus" )]
        [DataMember]
        public String SelectedStatus { get; set; }

        [XmlElement( ElementName = "NMLSNumber" )]
        [DataMember]
        public String NMLSNumber { get; set; }


        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "CompanyId" )]
        [DataMember()]
        public string CompanyId
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Companies" )]
        [DataMember()]
        public List<DropDownItem> Companies
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "BranchId" )]
        [DataMember()]
        public Guid BranchId
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Branches" )]
        [DataMember()]
        public List<DropDownItem> Branches
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "ChannelId" )]
        [DataMember()]
        public Int32 ChannelId
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Channels" )]
        [DataMember()]
        public List<DropDownItem> Channels
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "DivisionId" )]
        [DataMember()]
        public Int32 DivisionId
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Divisions" )]
        [DataMember()]
        public List<DropDownItem> Divisions
        {
            get;
            set;
        }

        [XmlElement( ElementName = "HearAboutUs" )]
        [DataMember]
        public String HearAboutUs { get; set; }
    }
}
