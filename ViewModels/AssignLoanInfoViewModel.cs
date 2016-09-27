using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Web.Mvc;
using System.Xml.Serialization;
using MML.Common;
using MML.Contracts;
using Telerik.Web.Mvc.UI;
using System.Collections.ObjectModel;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "AssignLoanInfoViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "AssignLoanInfoViewModel" )]
    public class AssignLoanInfoViewModel
    {

        public AssignLoanInfoViewModel()
        {
            
            this.Companies = new List<DropDownItem>();
            this.Branches = new List<DropDownItem>();
            this.Channels = new List<DropDownItem>();
            this.Divisions = new List<DropDownItem>();
        }



        [XmlElement( ElementName = "LoanId" )]
        [DataMember()]
        public Guid LoanId { get; set; }

        [XmlElement( ElementName = "ConciergeId" )]
        [DataMember()]
        public Int32? ConciergeId { get; set; }

        [XmlElement( ElementName = "ConciergeNMLS" )]
        [DataMember()]
        public String ConciergeNMLS { get; set; }
        
        [XmlElement( ElementName = "LoanNumber" )]
        [DataMember()]
        public String LoanNumber { get; set; }

        [XmlElement( ElementName = "EnableDigitalDocsCall" )]
        [DataMember()]
        public Boolean EnableDigitalDocsCall { get; set; }

        [XmlElement( ElementName = "LoaId" )]
        [DataMember()]
        public Int32? LoaId { get; set; }

        [XmlElement( ElementName = "ConciergeList" )]
        [DataMember()]
        public List<ConciergeInfo> ConciergeList { get; set; }

        [XmlElement( ElementName = "LoaList" )]
        [DataMember()]
        public List<ConciergeInfo> LoaList { get; set; }

        [XmlElement( ElementName = "LosFolders" )]
        [DataMember()]
        public List<LosFolder> LosFolders { get; set; }

        [XmlElement( ElementName = "LosFolder" )]
        [DataMember()]
        public String LosFolder { get; set; }

        [XmlElement( ElementName = "UrlaDeliveryMethod" )]
        [DataMember()]
        public List<DropDownItem> UrlaDeliveryMethod { get; set; }

        [XmlElement( ElementName = "EnableDownload" )]
        [DataMember()]
        public Boolean EnableDownload { get; set; }

        [XmlElement( ElementName = "ActivityName" )]
        [DataMember()]
        public String ActivityName { get; set; }

        [XmlElement( ElementName = "DownloadLink" )]
        [DataMember()]
        public String DownloadLink { get; set; }

        [XmlElement( ElementName = "TitleInformation" )]
        [DataMember()]
        public string TitleInformation { get; set; }

        [XmlElement( ElementName = "LeadSourceInformation" )]
        [DataMember()]
        public string LeadSourceInformation { get; set; }

        [XmlElement( ElementName = "ImportToLosInProgress" )]
        [DataMember()]
        public bool ImportToLosInProgress { get; set; }

        [XmlElement( ElementName = "UserCanChangeLoanNumber" )]
        [DataMember()]
        public bool UserCanChangeLoanNumber { get; set; }

        
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

        [XmlElement( ElementName = "CallCenterInfoList" )]
        [DataMember]
        public Collection<CallCenterInfo> CallCenterInfoList { get; set; }

        [XmlElement( ElementName = "SelectedCallCenter" )]
        [DataMember]
        public String SelectedCallCenter { get; set; }

        [XmlElement( ElementName = "CallCenterId" )]
        [DataMember()]
        public Int32? CallCenterId { get; set; }
    }
}
