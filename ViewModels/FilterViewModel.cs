using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Xml.Serialization;
using MML.Common;
using MML.Web.LoanCenter.Helpers.Enums;
using System.Web.WebPages.Html;

namespace MML.Web.LoanCenter.ViewModels
{
    [XmlType( Namespace = Namespaces.Default, TypeName = "FilterViewModel" )]
    [XmlRoot( Namespace = Namespaces.Default )]
    [DataContract( Namespace = Namespaces.Default, Name = "FilterViewModel" )]
    [Serializable]
    public class FilterViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        public FilterViewModel()
        {
            this.FilterContext = FilterContextEnum.Contact;
            this.Companies = new List<SelectListItem>();
            this.Branches = new List<SelectListItem>();
            this.Users = new List<SelectListItem>();
            this.Channels = new List<SelectListItem>();
            this.Divisions = new List<SelectListItem>();
            this.OrderTypes = new List<SelectListItem>();
            this.NonConformming = new List<SelectListItem>();
            this.Rush = new List<SelectListItem>();
            this.Exceptions = new List<SelectListItem>();
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "FilterContext" )]
        [DataMember()]
        public FilterContextEnum FilterContext
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "CompanyId" )]
        [DataMember()]
        public Guid CompanyId
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Companies" )]
        [DataMember()]
        public List<SelectListItem> Companies
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
        public List<SelectListItem> Branches
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "UserId" )]
        [DataMember()]
        public int UserId
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "Users" )]
        [DataMember()]
        public List<SelectListItem> Users
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        [XmlElement( ElementName = "UsersForProspect" )]
        [DataMember()]
        public List<SelectListItem> UsersForProspect
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
        public List<SelectListItem> Channels
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
        public List<SelectListItem> Divisions
        {
            get;
            set;
        }

        /// <summary>
        /// List of Order Types
        /// </summary>
        [XmlElement( ElementName = "OrderTypes" )]
        [DataMember()]
        public List<SelectListItem> OrderTypes
        {
            get;
            set;
        }

        /// <summary>
        /// List with Yes / No Option for Non Conforming
        /// </summary>
        [XmlElement( ElementName = "NonConformming" )]
        [DataMember()]
        public List<SelectListItem> NonConformming
        {
            get;
            set;
        }

        /// <summary>
        /// List with Yes / No Option for Rush
        /// </summary>
        [XmlElement( ElementName = "Rush" )]
        [DataMember()]
        public List<SelectListItem> Rush
        {
            get;
            set;
        }

        /// <summary>
        /// List of LenderX Exceptions 
        /// </summary>
        [XmlElement( ElementName = "Exceptions" )]
        [DataMember()]
        public List<SelectListItem> Exceptions
        {
            get;
            set;
        }

        /// <summary>
        /// Order Type Id
        /// </summary>
        [XmlElement( ElementName = "OrderTypeId" )]
        [DataMember()]
        public Int32 OrderTypeId
        {
            get;
            set;
        }

        /// <summary>
        /// Answer for Non Conforming
        /// </summary>
        [XmlElement( ElementName = "NonConformmingId" )]
        [DataMember()]
        public Int32 NonConformmingId
        {
            get;
            set;
        }

        /// <summary>
        /// Answer for Rush
        /// </summary>
        [XmlElement( ElementName = "RushId" )]
        [DataMember()]
        public Int32 RushId
        {
            get;
            set;
        }

        /// <summary>
        /// Exception Id
        /// </summary>
        [XmlElement( ElementName = "ExceptionId" )]
        [DataMember()]
        public Int32 ExceptionId
        {
            get;
            set;
        }
    }
}